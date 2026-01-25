import type { Request, Response } from "express";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
import * as XLSX from "xlsx";
import { generatePassword } from "../utils/nodemailer/GeneratePass";
import { hashPassword } from "../utils/password";

interface CSVBatch {
  batchname: string;
  branch: string;
  batchEndYear: number;
}
interface CSVStudent {
  name: string;
  rollNumber: string;
  email: string;
  loginPassword?: string;
  batchId?: string;
  instituteId?: string;
}

interface CSVTestCase {
  testType: "HIDDEN" | "EXAMPLE";
  input: string;
  output: string;
  problemId: string;
}

class CSVUploader {
  async uploadMultipleBatches(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const file = req.file;
      const instituteId = req.params.id;

      if (!userId) throw new Error("unAuthenticated user");
      if (!file) throw new Error("file is needed");
      if (!instituteId) throw new Error("instituteId is needed");

      if (req.user?.type === "STUDENT" || req.user?.type === "TEACHER") {
        throw new Error("unAuthorized to perform this task");
      }
      const dbInstitute = await prismaClient.institution.findUnique({
        where: {
          id: instituteId as string,
        },
      });

      if (!dbInstitute) throw new Error("institute not found");

      let batchArray: CSVBatch[] = [];
      const workbook = XLSX.read(file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) throw new Error("No sheets found in workbook");
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) throw new Error("Sheet is undefined");

      batchArray = XLSX.utils.sheet_to_json(sheet, {
        defval: null,
        raw: false,
      });

      batchArray = batchArray.map((batchArray) => {
        return { ...batchArray, institutionId: dbInstitute.id };
      });
      const createdBatches = await prismaClient.batch.createMany({
        data: batchArray as any,
      });

      if (!Array.isArray(createdBatches) || createdBatches.length === 0) {
        throw new Error("batches couldn't be updated");
      }

      return res
        .status(200)
        .json(apiResponse(200, "batch uploaded", createdBatches));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async uploadMultipleStudent(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const batchId = req.params.id;
      const file = req.file;

      if (!userId) throw new Error("unAuthenticated user");
      if (!batchId) throw new Error("batchId not found");
      if (!file) throw new Error("file is needed");

      if (req.user?.type === "STUDENT" || req.user?.type === "TEACHER") {
        throw new Error("unAuthorized to perform this task");
      }

      const dbBatch = await prismaClient.batch.findUnique({
        where: { id: batchId as string },
      });

      if (!dbBatch) throw new Error("batch not found");

      let batchArray: CSVStudent[] = [];
      const workbook = XLSX.read(file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) throw new Error("No sheets found in workbook");
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) throw new Error("Sheet is undefined");

      const rows: any[] = XLSX.utils.sheet_to_json(sheet, {
        defval: null,
        raw: false,
      });

      for (const row of rows) {
        if (!row.Email && !row.email) continue;

        const password = generatePassword();
        const hashedPassword = await hashPassword(password);

        batchArray.push({
          name: row.Name ?? row.name,
          rollNumber: row["Roll Number"] ?? row.rollNumber,
          email: row.Email ?? row.email,
          loginPassword: hashedPassword,
          batchId: dbBatch.id,
          instituteId: dbBatch.institutionId,
        });
      }

      const createdStudent = await prismaClient.student.createMany({
        data: batchArray as any,
      });
      if (!createdStudent || createdStudent.count === 0) {
        throw new Error("batches couldn't be updated");
      }

      return res
        .status(200)
        .json(apiResponse(200, "students uploaded", createdStudent));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async uploadMultipleTestCase(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const problemId = req.params.id;
      const file = req.file;

      if (!userId) throw new Error("unAuthenticated user");
      if (!problemId) throw new Error("batchId not found");
      if (!file) throw new Error("file is needed");

      if (req.user?.type === "STUDENT" || req.user?.type === "TEACHER") {
        throw new Error("unAuthorized to perform this task");
      }

      const dbProblem = await prismaClient.problem.findUnique({
        where: { id: problemId as string },
      });

      if (!dbProblem) throw new Error("batch not found");

      let batchArray: CSVTestCase[] = [];
      const workbook = XLSX.read(file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) throw new Error("No sheets found in workbook");
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) throw new Error("Sheet is undefined");

      batchArray = XLSX.utils.sheet_to_json(sheet, {
        defval: null,
        raw: false,
      });
      batchArray = batchArray.map((batch: CSVTestCase) => {
        return { ...batch, problemId: dbProblem.id };
      });

      const createdTestCase = await prismaClient.problemTestCase.createMany({
        data: batchArray as any,
      });

      if (!createdTestCase || createdTestCase.count === 0) {
        throw new Error("batches couldn't be updated");
      }

      return res
        .status(200)
        .json(apiResponse(200, "students uploaded", createdTestCase));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
}
export default new CSVUploader();
