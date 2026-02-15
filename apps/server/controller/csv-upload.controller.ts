import type { Request, Response } from "express";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
import * as XLSX from "xlsx";
import { generatePassword } from "../utils/nodemailer/GeneratePass";
import { hashPassword } from "../utils/password";
import { password } from "bun";

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
interface CSVCloudInfo {
  cloudname: string;
  cloudpass: string;
  cloudPlatform: string;
  cloudurl: string;
  email: string;
}
interface CSVAssignmentQuestion {
  question: string;
  type: "SCQ" | "MCQ";
  options: string;
  correctAnswer: string;
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
        return {
          ...batch,
          input: batch.input.toString(),
          problemId: dbProblem.id,
        };
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
  async uploadCloudCred(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const file = req.file;

      if (!userId) throw new Error("unAuthenticated user");
      if (!file) throw new Error("file is needed");

      if (req.user?.type === "STUDENT" || req.user?.type === "TEACHER") {
        throw new Error("unAuthorized to perform this task");
      }

      let batchArray: CSVCloudInfo[] = [];
      const workbook = XLSX.read(file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) throw new Error("No sheets found in workbook");
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) throw new Error("Sheet is undefined");

      batchArray = XLSX.utils.sheet_to_json(sheet, {
        defval: null,
        raw: false,
      });

      for (let i = 0; i < batchArray.length; i++) {
        let batch = batchArray[i];
        const dbStudent = await prismaClient.student.findUnique({
          where: { email: batch?.email },
        });

        const updatedStudent = await prismaClient.student.update({
          where: { id: dbStudent?.id },
          data: {
            cloudname: batch?.cloudname,
            cloudpass: batch?.cloudpass,
            cloudPlatform: batch?.cloudPlatform as any,
            cloudurl: batch?.cloudurl,
          },
        });
      }

      return res.status(200).json(apiResponse(200, "students uploaded", null));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async uploadAssignmentQuestion(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const assignmentId = req.params.id as string;
      const file = req.file;

      if (!userId) throw new Error("unauthenticated user");
      if (!file) throw new Error("file is required");
      if (req.user?.type === "STUDENT" || req.user?.type === "TEACHER") {
        throw new Error("unauthorized to perform this task");
      }

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });
      if (!dbAdmin) throw new Error("no such admin found");

      /* ---------------- XLSX PARSING ---------------- */
      const workbook = XLSX.read(file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) throw new Error("no sheet found");

      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<any>(sheet!, {
        defval: "",
        raw: false,
      });

      if (!rows.length) throw new Error("empty file");

      /* ---------------- EXISTING QUESTIONS ---------------- */
      const existingQuestions =
        await prismaClient.courseAssignemntQuestion.findMany({
          where: { assignmentId },
          select: { question: true },
        });

      const existingSet = new Set(
        existingQuestions.map((q) => q.question.trim().toLowerCase()),
      );

      /* ---------------- TRANSFORM & VALIDATE ---------------- */
      const validQuestions: any[] = [];
      const skipped: any[] = [];

      for (const row of rows) {
        const question = row.question?.trim();
        let options = row.options.split("|");
        const correct = row.correctAnswer;
        options = options.map((opt: string) => {
          return opt.trim();
        });

        if (!question || !options || !correct) {
          skipped.push({ row, reason: "missing required fields" });
          continue;
        }

        console.log({
          question,
          options,
          correctAnswer: [correct],
          assignmentId,
          type: options.length === 1 ? "SCQ" : "MCQ",
        });
        validQuestions.push({
          question,
          options,
          correctAnswer: [correct],
          assignmentId,
          type: options.length === 1 ? "SCQ" : "MCQ",
        });
      }

      /* ---------------- BULK INSERT ---------------- */

      if (validQuestions.length) {
        const data = await prismaClient.courseAssignemntQuestion.createMany({
          data: validQuestions,
        });
        console.log(data);
      }

      return res.status(200).json(
        apiResponse(200, "assignment questions uploaded", {
          totalRows: rows.length,
          inserted: validQuestions.length,
          skipped: skipped.length,
          skippedDetails: skipped,
        }),
      );
    } catch (error: any) {
      console.error(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async uploadAssessmentMCQQuestions(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const sectionId = req.params.id as string;
      const file = req.file;

      if (!userId) throw new Error("unauthenticated user");
      if (!file) throw new Error("file is required");
      if (req.user?.type === "STUDENT") {
        throw new Error("user not authorized to upload assessment questions");
      }

      const dbSection = await prismaClient.assessmentSection.findUnique({
        where: { id: sectionId },
      });
      if (!dbSection) throw new Error("assessment section not found");

      /* ---------------- READ FILE ---------------- */
      const workbook = XLSX.read(file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) throw new Error("no sheet found");

      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<any>(sheet!, {
        defval: "",
        raw: false,
      });

      if (!rows.length) throw new Error("empty file");

      /* ---------------- PROCESS ROWS ---------------- */
      const validQuestions: any[] = [];
      const skipped: any[] = [];

      rows.forEach((row, index) => {
        const rowNumber = index + 2; // Excel header = row 1

        const question = row.question?.trim();
        let optionsRaw = row.options.split("|");
        const correctOption = row.correctAnswer?.trim();
        const maxMarks = dbSection.marksPerQuestion;
        optionsRaw = optionsRaw.map((opt: string) => opt.trim());

        validQuestions.push({
          question,
          options: optionsRaw,
          correctOption,
          maxMarks,
          sectionId,
        });
      });

      /* ---------------- BULK INSERT ---------------- */
      if (validQuestions.length) {
        const createdQuestions =
          await prismaClient.assessmentQuestion.createMany({
            data: validQuestions.map((q) => ({
              question: q.question,
              options: q.options,
              correctOption: q.correctOption,
              maxMarks: q.maxMarks,
              sectionId: q.sectionId,
            })),
          });
        console.log(createdQuestions);
      }

      return res.status(200).json(
        apiResponse(200, "assessment MCQ questions uploaded successfully", {
          totalRows: rows.length,
          inserted: validQuestions.length,
          skipped: skipped.length,
          skippedRows: skipped,
        }),
      );
    } catch (error: any) {
      console.error(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
}
export default new CSVUploader();
