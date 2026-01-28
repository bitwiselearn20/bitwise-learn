import type { Request, Response } from "express";
import { hashPassword } from "../utils/password";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
import type {
  CreateInstitutionBody,
  UpdateInstitutionBody,
} from "../utils/type";
import { generatePassword } from "../utils/nodemailer/GeneratePass";
import { handleSendMail } from "../utils/nodemailer/mailHandler";

class InstitutionController {
  async createInstitution(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      const data: CreateInstitutionBody = req.body;
      if (!data) throw new Error("Please Provide all required fields");
      const userId = req.user.id;

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such user found!");

      if (dbAdmin.ROLE !== "ADMIN" && dbAdmin.ROLE !== "SUPERADMIN") {
        throw new Error("only admin/superadmin can view institutions");
      }
      const existingInstitute = await prismaClient.institution.findFirst({
        where: { email: data.email },
      });
      if (existingInstitute)
        throw new Error("Institute with this email already exists");
      const loginPassword = generatePassword();
      const hashedPassword = await hashPassword(loginPassword);

      const createdInstitution = await prismaClient.institution.create({
        data: {
          name: data.name,
          email: data.email,
          secondaryEmail: data.secondaryEmail ?? null,
          phoneNumber: data.phoneNumber,
          secondaryPhoneNumber: data.secondaryPhoneNumber ?? null,
          address: data.address,
          pinCode: data.pinCode,
          tagline: data.tagline,
          websiteLink: data.websiteLink,
          loginPassword: hashedPassword,
          createdBy: dbAdmin.id,
        },
      });
      await handleSendMail(data.email, loginPassword);
      if (!createdInstitution) throw new Error("error in creating institution");
      return res
        .status(200)
        .json(
          apiResponse(
            200,
            "institution created successfully",
            createdInstitution,
          ),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async updateInstitution(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      const userId = req.user.id;
      const institutionId = req.params.id;

      if (!institutionId) throw new Error("institution id is required");

      const data: UpdateInstitutionBody = req.body;

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such user found!");

      if (dbAdmin.ROLE !== "ADMIN" && dbAdmin.ROLE !== "SUPERADMIN") {
        throw new Error("only admin or superadmin can update institutions");
      }

      const institution = await prismaClient.institution.findFirst({
        where: { id: institutionId },
      });

      if (!institution) throw new Error("institution not found");

      if (data.email && data.email !== institution.email) {
        const emailExists = await prismaClient.institution.findFirst({
          where: { email: data.email },
        });

        if (emailExists) throw new Error("email already in use");
      }

      const updatedInstitution = await prismaClient.institution.update({
        where: { id: institutionId },
        data: {
          name: data.name ?? institution.name,
          email: data.email ?? institution.email,
          secondaryEmail: data.secondaryEmail ?? institution.secondaryEmail,
          phoneNumber: data.phoneNumber ?? institution.phoneNumber,
          secondaryPhoneNumber:
            data.secondaryPhoneNumber ?? institution.secondaryPhoneNumber,
          address: data.address ?? institution.address,
          pinCode: data.pinCode ?? institution.pinCode,
          tagline: data.tagline ?? institution.tagline,
          websiteLink: data.websiteLink ?? institution.websiteLink,
          loginPassword: data.loginPassword
            ? await hashPassword(data.loginPassword)
            : institution.loginPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res
        .status(200)
        .json(
          apiResponse(
            200,
            "institution updated successfully",
            updatedInstitution,
          ),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }

  async deleteInstitution(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      const userId = req.user.id;
      const institutionId = req.params.id;

      if (!institutionId) throw new Error("institution id is required");

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such user found!");

      if (dbAdmin.ROLE !== "ADMIN" && dbAdmin.ROLE !== "SUPERADMIN") {
        throw new Error("only admin/superadmin can view institutions");
      }

      const institution = await prismaClient.institution.findFirst({
        where: {
          id: institutionId,
        },
      });
      if (!institution) throw new Error("institution not found");
      const deletedInstitution = await prismaClient.institution.delete({
        where: { id: institutionId },
      });
      if (!deletedInstitution) throw new Error("Error deleting institution");

      return res
        .status(200)
        .json(
          apiResponse(
            200,
            "institution deleted successfully",
            deletedInstitution,
          ),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async getAllInstitutions(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      const userId = req.user.id;

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such user found!");

      if (dbAdmin.ROLE !== "ADMIN" && dbAdmin.ROLE !== "SUPERADMIN") {
        throw new Error("only admin/superadmin can view institutions");
      }

      const institutions = await prismaClient.institution.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res
        .status(200)
        .json(
          apiResponse(200, "institutions fetched successfully", institutions),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async getInstitutionById(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      const userId = req.user.id;
      const institutionId = req.params.id;

      if (!institutionId) throw new Error("institution id is required");

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such user found!");

      if (dbAdmin.ROLE !== "ADMIN" && dbAdmin.ROLE !== "SUPERADMIN") {
        throw new Error("only admin/superadmin can view institutions");
      }

      const institutions = await prismaClient.institution.findFirst({
        where: {
          id: institutionId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          tagline: true,
          address: true,
          websiteLink: true,
          phoneNumber: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!institutions) throw new Error("institute not found");
      return res
        .status(200)
        .json(
          apiResponse(200, "institution fetched successfully", institutions),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async getInstitutionByVendor(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      const userId = req.user.id;
      const vendorId = req.params.id;

      if (!vendorId) throw new Error("institution id is required");

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such user found!");

      if (dbAdmin.ROLE !== "ADMIN" && dbAdmin.ROLE !== "SUPERADMIN") {
        throw new Error("only admin/superadmin can view institutions");
      }

      const institute = await prismaClient.institution.findMany({
        where: {
          createdBy: vendorId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          tagline: true,
          address: true,
          websiteLink: true,
          phoneNumber: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!institute) throw new Error("institute not found");
      return res
        .status(200)
        .json(apiResponse(200, "institution fetched successfully", institute));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }

async getInstitutionDashboard(req: Request, res: Response) {
  try {
    if (!req.user) throw new Error("Unauthenticated user");

    const user = await prismaClient.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) throw new Error("User not found");

    const institutionId = req.params.institutionId;
    console.log(institutionId)
    if (!institutionId) {
      throw new Error("institutionId is required");
    }

    const institution = await prismaClient.institution.findUnique({
      where: { id: institutionId },
    });

    if (!institution) throw new Error("Institution not found");

    // FIX 2: correct access control (already right)
    if (
      user.ROLE !== "SUPERADMIN" &&
      institution.createdBy !== user.id
    ) {
      throw new Error("You do not have access to this institution");
    }

    const [batches, students, teachers, assessments, courses] =
      await Promise.all([
        prismaClient.batch.count({
          where: { institutionId: institution.id },
        }),
        prismaClient.student.count({
          where: { institutionId: institution.id },
        }),
        prismaClient.teacher.count({
          where: { instituteId: institution.id },
        }),
        prismaClient.assessment.count({
          where: {
            batch: { institutionId: institution.id },
          },
        }),
        prismaClient.courseEnrollment.count({
          where: { institutionId: institution.id },
        }),
      ]);

    const batchBreakdown = await prismaClient.batch.findMany({
      where: { institutionId: institution.id },
      select: {
        id: true,
        batchname: true,
        branch: true,
        batchEndYear: true,
        _count: {
          select: {
            students: true,
            teachers: true,
            assessments: true,
          },
        },
      },
    });

    return res.status(200).json(
      apiResponse(200, "Institution dashboard data", {
        institution: {
          id: institution.id,
          name: institution.name,
          tagline: institution.tagline,
          createdAt: institution.createdAt,
        },
        overview: {
          batches,
          students,
          teachers,
          courses,
          assessments,
        },
        batches: batchBreakdown,
      }),
    );
  } catch (error: any) {
    console.error(error);

    // ✅ FIX 3: correct error status
    return res.status(400).json(
      apiResponse(400, error.message, null)
    );
  }
}
}
export default new InstitutionController();
