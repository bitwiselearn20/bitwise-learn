import type { Request, Response } from "express";
import { hashPassword } from "../utils/password";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
import type { CreateTeacherBody, UpdateTeacherBody } from "../utils/type";
import { generatePassword } from "../utils/nodemailer/GeneratePass";
import { handleSendMail } from "../utils/nodemailer/mailHandler";
class TeacherController {
  async createTeacher(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");

      const data: CreateTeacherBody = req.body;
      if (!data) throw new Error("please provide all required fields");

      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type !== "INSTITUTION" &&
        req.user.type !== "VENDOR"
      ) {
        throw new Error("only institution or vendor can create teachers");
      }

      const institution = await prismaClient.institution.findFirst({
        where: { id: data.instituteId },
      });
      if (!institution) throw new Error("institution not found");

      const batch = await prismaClient.batch.findFirst({
        where: {
          id: data.batchId,
          institutionId: data.instituteId,
        },
      });
      if (!batch) throw new Error("batch does not belong to institution");

      // Logged-in user is a VENDOR
      if (req.user.type === "VENDOR") {
        const vendor = await prismaClient.vendor.findFirst({
          where: { id: req.user.id },
          select: { id: true, institutionId: true },
        });

        if (!vendor) {
          throw new Error("vendor not found");
        }

        if (vendor.institutionId !== data.instituteId) {
          throw new Error("vendor does not belong to this institution");
        }
      }

      const existingTeacher = await prismaClient.teacher.findFirst({
        where: { email: data.email },
      });
      if (existingTeacher)
        throw new Error("teacher with this email already exists");

      const loginPassword = generatePassword();
      const hashedPassword = await hashPassword(loginPassword);

      const createdTeacher = await prismaClient.teacher.create({
        data: {
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          loginPassword: hashedPassword,
          instituteId: data.instituteId,
          batchId: data.batchId,
          vendorId: data.vendorId ?? null,
        },
      });
      await handleSendMail(data.email, loginPassword);

      return res
        .status(200)
        .json(apiResponse(200, "teacher created successfully", createdTeacher));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }

  async updateTeacher(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");

      const userId = req.user.id;
      const teacherId = req.params.id;
      const data: UpdateTeacherBody = req.body;

      if (!teacherId) throw new Error("teacher id is required");

      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type !== "INSTITUTION" &&
        req.user.type !== "VENDOR"
      ) {
        throw new Error("only institution or vendor can update teachers");
      }

      const teacher = await prismaClient.teacher.findFirst({
        where: { id: teacherId },
      });
      if (!teacher) throw new Error("teacher not found");

      // Check if teacher belongs to the institute
      if (req.user.type === "INSTITUTION" && teacher.instituteId !== userId) {
        throw new Error("teacher does not belongs to your institution");
      } else if (
        teacher.vendorId &&
        req.user.type !== "VENDOR" &&
        teacher.vendorId !== userId
      ) {
        throw new Error("teacher does not belongs to this vendor");
      }

      const updatedTeacher = await prismaClient.teacher.update({
        where: { id: teacherId },
        data: {
          name: data.name ?? teacher.name,
          email: data.email ?? teacher.email,
          phoneNumber: data.phoneNumber ?? teacher.phoneNumber,
          batchId: data.batchId ?? teacher.batchId,
          vendorId: data.vendorId ?? teacher.vendorId,
          loginPassword: data.loginPassword
            ? await hashPassword(data.loginPassword)
            : teacher.loginPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          instituteId: true,
          batchId: true,
          vendorId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "teacher updated successfully", updatedTeacher));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }

  async deleteTeacher(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");

      const userId = req.user.id;
      const teacherId = req.params.id;

      if (!teacherId) throw new Error("teacher id is required");
      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type !== "INSTITUTION" &&
        req.user.type !== "VENDOR"
      ) {
        throw new Error("cannot delete a teacher");
      }
      const teacher = await prismaClient.teacher.findFirst({
        where: { id: teacherId },
      });
      if (!teacher) throw new Error("teacher not found");

      // TODO: make sure an no cross institution admins can be deleted

      const deletedTeacher = await prismaClient.teacher.delete({
        where: { id: teacherId },
      });
      if (!deletedTeacher) throw new Error("Error deleting teacher");

      return res
        .status(200)
        .json(apiResponse(200, "teacher deleted successfully", deletedTeacher));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }

  async getAllTeachers(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      const userId = req.user.id;

      let whereClause: any = {};

      if (req.user.type === "INSTITUTION") {
        whereClause = { instituteId: userId };
      }

      if (req.user.type === "VENDOR") {
        whereClause = { vendorId: userId };
      }

      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type !== "INSTITUTION" &&
        req.user.type !== "VENDOR"
      ) {
        throw new Error("not authorized to view teachers");
      }

      const teachers = await prismaClient.teacher.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          instituteId: true,
          batchId: true,
          vendorId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "teachers fetched successfully", teachers));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }

  async getTeacherById(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;
      const teacherId = req.params.id;

      if (!teacherId) throw new Error("teacher id is required");

      // const dbUser = await prismaClient.user.findFirst({
      //     where: { id: userId },
      // });
      // if (!dbUser) throw new Error("no such user found");

      const teacher = await prismaClient.teacher.findFirst({
        where: { id: teacherId },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          instituteId: true,
          batchId: true,
          vendorId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!teacher) throw new Error("teacher not found");

      if (req.user.type === "INSTITUTION" && teacher.instituteId !== userId) {
        throw new Error("not authorized to view this teacher");
      }

      if (req.user.type === "VENDOR" && teacher.vendorId !== userId) {
        throw new Error("not authorized to view this teacher");
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
        .json(apiResponse(200, "teacher fetched successfully", teacher));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async getTeacherByInstitute(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;
      const instituteId = req.params.id;

      if (!instituteId) throw new Error("institute id is required");

      const teachers = await prismaClient.teacher.findMany({
        where: { instituteId: instituteId },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          instituteId: true,
          batchId: true,
          vendorId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!teachers) throw new Error("teachers not found");

      if (req.user.type !== "SUPERADMIN" && req.user.type !== "ADMIN") {
        throw new Error("not authorized");
      }

      return res
        .status(200)
        .json(
          apiResponse(200, "institute teachers fetched successfully", teachers),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async getTeacherByBatch(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;
      const batchId = req.params.id;

      if (!batchId) throw new Error("batch id is required");

      // const dbUser = await prismaClient.user.findFirst({
      //     where: { id: userId },
      // });
      // if (!dbUser) throw new Error("no such user found");

      const teachers = await prismaClient.teacher.findMany({
        where: { batchId: batchId },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          batchId: true,
          instituteId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!teachers) throw new Error("teachers not found");

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
          apiResponse(200, "batch teachers fetched successfully", teachers),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
}

export default new TeacherController();
