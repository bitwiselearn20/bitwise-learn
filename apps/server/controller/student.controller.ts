import type { Request, Response } from "express";
import { hashPassword } from "../utils/password";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
import type { CreateStudentBody, UpdateStudentBody } from "../utils/type";
import { generatePassword } from "../utils/nodemailer/GeneratePass";
import { handleSendMail } from "../utils/nodemailer/mailHandler";
class StudentController {
  async createStudent(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      const institutionId = req.user.id;
      const data: CreateStudentBody = req.body;
      if (!data) throw new Error("please provide all required fields");

      if (req.user.type !== "INSTITUTION") {
        throw new Error("only institution can create students");
      }

      const institution = await prismaClient.institution.findFirst({
        where: { id: institutionId },
      });
      if (!institution) throw new Error("institution not found");

      const batch = await prismaClient.batch.findFirst({
        where: {
          id: data.batchId,
          institutionId: institutionId,
        },
      });
      if (!batch) throw new Error("batch does not belong to institution");

      const existingStudent = await prismaClient.student.findFirst({
        where: { email: data.email },
      });
      if (existingStudent)
        throw new Error("student with this email already exists");

      const loginPassword = generatePassword();
      const hashedPassword = await hashPassword(loginPassword);

      const createdStudent = await prismaClient.student.create({
        data: {
          name: data.name,
          rollNumber: data.rollNumber,
          email: data.email,
          loginPassword: hashedPassword,
          batchId: data.batchId,
          instituteId: institutionId,
        },
      });
      await handleSendMail(data.email, loginPassword);

      return res
        .status(200)
        .json(apiResponse(200, "student created successfully", createdStudent));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }

  async updateStudent(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");

      const userId = req.user.id;
      const studentId = req.params.id;
      const data: UpdateStudentBody = req.body;

      if (!studentId) throw new Error("student id is required");

      if (req.user.type !== "INSTITUTION") {
        throw new Error("only institution can update students");
      }

      const student = await prismaClient.student.findFirst({
        where: { id: studentId },
      });
      if (!student) throw new Error("student not found");

      // Check if student belongs to the institute
      if (req.user.type === "INSTITUTION" && student.instituteId !== userId) {
        throw new Error("student does not belongs to your institution");
      }

      const updatedStudent = await prismaClient.student.update({
        where: { id: studentId },
        data: {
          name: data.name ?? student.name,
          rollNumber: data.rollNumber ?? student.rollNumber,
          email: data.email ?? student.email,
          batchId: data.batchId ?? student.batchId,
          loginPassword: data.loginPassword
            ? await hashPassword(data.loginPassword)
            : student.loginPassword,
        },
        select: {
          id: true,
          name: true,
          rollNumber: true,
          email: true,
          batchId: true,
          instituteId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "student updated successfully", updatedStudent));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }

  async deleteStudent(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");

      const userId = req.user.id;
      const studentId = req.params.id;

      if (!studentId) throw new Error("student id is required");

      if (req.user.type !== "INSTITUTION") {
        throw new Error("only institution can delete students");
      }

      const student = await prismaClient.student.findFirst({
        where: { id: studentId },
      });
      if (!student) throw new Error("student not found");

      // Code to be debugged

      if (req.user.type === "INSTITUTION" && student.instituteId !== userId) {
        throw new Error("student does not belongs to this institution");
      }

      const deletedStudent = await prismaClient.student.delete({
        where: { id: studentId },
      });
      if (!deletedStudent) throw new Error("Error deleting student");

      return res
        .status(200)
        .json(apiResponse(200, "student deleted successfully", deletedStudent));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }

  async getAllStudents(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      const userId = req.user.id;

      let whereClause: any = {};

      if (req.user.type === "INSTITUTION") {
        whereClause = { instituteId: userId };
      }

      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type !== "INSTITUTION" &&
        req.user.type !== "VENDOR"
      ) {
        throw new Error("not authorized to view students");
      }

      const students = await prismaClient.student.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          rollNumber: true,
          email: true,
          batchId: true,
          instituteId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "students fetched successfully", students));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }

  async getStudentById(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;
      const studentId = req.params.id;

      if (!studentId) throw new Error("student id is required");

      // const dbUser = await prismaClient.user.findFirst({
      //     where: { id: userId },
      // });
      // if (!dbUser) throw new Error("no such user found");

      const student = await prismaClient.student.findFirst({
        where: { id: studentId },
      });
      if (!student) throw new Error("student not found");

      if (req.user.type === "INSTITUTION" && student.instituteId !== userId) {
        throw new Error("not authorized to view this student");
      }

      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type !== "INSTITUTION" &&
        req.user.type !== "VENDOR"
      ) {
        throw new Error("not authorized");
      }

      return res
        .status(200)
        .json(apiResponse(200, "student fetched successfully", student));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async getStudentByBatch(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;
      const batchId = req.params.id;

      if (!batchId) throw new Error("batch id is required");

      // const dbUser = await prismaClient.user.findFirst({
      //     where: { id: userId },
      // });
      // if (!dbUser) throw new Error("no such user found");

      const students = await prismaClient.student.findMany({
        where: { batchId: batchId },
        select: {
          id: true,
          name: true,
          rollNumber: true,
          email: true,
          batchId: true,
          instituteId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!students) throw new Error("students not found");

      // if (req.user.type === "INSTITUTION" && student.instituteId !== userId) {
      //     throw new Error("not authorized to view this student");
      // }

      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN"
        // req.user.type !== "INSTITUTION" &&
        // req.user.type !== "VENDOR"
      ) {
        throw new Error("not authorized");
      }

      return res
        .status(200)
        .json(
          apiResponse(200, "batch students fetched successfully", students),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
}
export default new StudentController();
