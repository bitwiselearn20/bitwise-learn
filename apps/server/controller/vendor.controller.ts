import type { Request, Response } from "express";
import { hashPassword } from "../utils/password";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
import type { CreateVendorBody, UpdateVendorBody } from "../utils/type";
import { generatePassword } from "../utils/nodemailer/GeneratePass";
import { handleSendMail } from "../utils/nodemailer/mailHandler";
class VendorController {
  async createVendor(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      const data: CreateVendorBody = req.body;
      if (!data) throw new Error("Please Provide all required fields");

      if (req.user.type !== "INSTITUTION" && req.user.type !== "SUPERADMIN") {
        throw new Error("only institution can create vendors");
      }
      const existingVendor = await prismaClient.vendor.findFirst({
        where: { email: data.email },
      });
      if (existingVendor)
        throw new Error("vendor with this email already exists");
      const loginPassword = generatePassword();
      const hashedPassword = await hashPassword(loginPassword);

      const createdVendor = await prismaClient.vendor.create({
        data: {
          name: data.name,
          email: data.email,
          secondaryEmail: data.secondaryEmail ?? null,
          tagline: data.tagline,
          phoneNumber: data.phoneNumber,
          secondaryPhoneNumber: data.secondaryPhoneNumber ?? null,
          websiteLink: data.websiteLink,
          loginPassword: hashedPassword,

        },
      });
      await handleSendMail(data.email, loginPassword);

      if (!createdVendor) throw new Error("error in creating vendor");
      return res
        .status(200)
        .json(apiResponse(200, "vendor created successfully", createdVendor));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async updateVendor(req: Request, res: Response) {
    try {
      const vendorId = req.params.id;

      if (!req.user) throw new Error("user is not authenticated");
      const data: UpdateVendorBody = req.body;

      const institutionId = req.user.id;

      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type !== "INSTITUTION"
      ) {
        throw new Error("only institution can update vendors");
      }
      const vendor = await prismaClient.vendor.findFirst({
        where: { id: vendorId },
      });
      if (!vendor) throw new Error("Vendor not found");


      const updatedVendor = await prismaClient.vendor.update({
        where: { id: vendorId },
        data: {
          name: data.name ?? vendor.name,
          email: data.email ?? vendor.email,
          secondaryEmail: data.secondaryEmail ?? vendor.secondaryEmail,
          tagline: data.tagline ?? vendor.tagline,
          phoneNumber: data.phoneNumber ?? vendor.phoneNumber,
          secondaryPhoneNumber:
            data.secondaryPhoneNumber ?? vendor.secondaryPhoneNumber,
          websiteLink: data.websiteLink ?? vendor.websiteLink,
          loginPassword: data.loginPassword
            ? await hashPassword(data.loginPassword)
            : vendor.loginPassword,
        },
      });

      if (!updatedVendor) throw new Error("error in updating vendor");
      return res
        .status(200)
        .json(apiResponse(200, "vendor updated successfully", updatedVendor));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async deleteVendor(req: Request, res: Response) {
    try {
      const vendorId = req.params.id;

      if (!req.user) throw new Error("user is not authenticated");

      const institutionId = req.user.id;

      if (req.user.type !== "INSTITUTION") {
        throw new Error("only institution can delete vendors");
      }
      const vendor = await prismaClient.vendor.findFirst({
        where: { id: vendorId },
      });
      if (!vendor) throw new Error("vendor not found");



      const deletedVendor = await prismaClient.vendor.delete({
        where: { id: vendorId },
      });

      if (!deletedVendor) throw new Error("error in deleting vendor");
      return res
        .status(200)
        .json(apiResponse(200, "vendor updated successfully", deletedVendor));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async getAllVendors(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");

      const institutionId = req.user.id;
      let whereClause: any = {};

      if (req.user.type !== "INSTITUTION" && req.user.type != "SUPERADMIN") {
        throw new Error("only institution can view vendors");
      }
      if (req.user.type == "INSTITUTION") {
        whereClause = { institutionId: req.user.id };
      }
      const institutions = await prismaClient.vendor.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "vendors fetched successfully", institutions));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async getVendorById(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");

      const institutionId = req.user.id;
      const vendorId = req.params.id;
      if (req.user.type !== "INSTITUTION") {
        throw new Error("only institution can view vendors");
      }
      const vendor = await prismaClient.vendor.findFirst({
        where: { id: vendorId },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!vendor) throw new Error("vendor not found");


      if (!vendor) {
        throw new Error("vendor not found");
      }

      return res
        .status(200)
        .json(apiResponse(200, "vendor found successfully", vendor));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
}
export default new VendorController();
