import type { Request, Response } from "express";
import { hashPassword } from "../utils/password";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
import type { CreateAdminBody, UpdateAdminBody } from "../utils/type";
import { createAbstractBuilder } from "typescript";
import cloudinaryService from "../service/cloudinary.service";
import { handleSendMail } from "../utils/nodemailer/mailHandler";
import { generatePassword } from "../utils/nodemailer/GeneratePass";
class AdminController {
    async createAdmin(req: Request, res: Response) {
        try {
            const data: CreateAdminBody = req.body;
            if (!data) throw new Error("Please Provide all required fields");
            if (!req.user) throw new Error("user is not authenticated");
            const userId = req.user.id;

            const dbSuperAdmin = await prismaClient.user.findFirst({
                where: { id: userId },
            });

            if (!dbSuperAdmin) throw new Error("no such user found!");

            if (dbSuperAdmin.ROLE !== "SUPERADMIN") {
                throw new Error("only superadmin can create admins");
            }

            const dbAdmin = await prismaClient.user.findFirst({
                where: {
                    email: data.email,
                },
            });

            if (dbAdmin) throw new Error("admin with this email exists");
            const generatedPassword = await generatePassword()
            const hashedPassword = await hashPassword(generatedPassword);

            const createdAdmin = await prismaClient.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: hashedPassword,
                    ROLE: "ADMIN",
                    // createdBy: dbSuperAdmin.id,
                },
            });
            const email = data.email;
            await handleSendMail(email, generatedPassword);
            if (!createdAdmin) throw new Error("error in creating admin");
            return res
                .status(200)
                .json(apiResponse(200, "admin created successfully", createdAdmin));
        } catch (error: any) {
            console.log(error);
            return res.status(200).json(apiResponse(200, error.message, null));
        }
    }
    async updateAdmin(req: Request, res: Response) {
        try {
            if (!req.user) throw new Error("user is not authenticated");
            const userId = req.user.id;
            const adminId = req.params.id;

            if (!adminId) throw new Error("admin id is required");

            const data: UpdateAdminBody = req.body;

            const dbSuperAdmin = await prismaClient.user.findFirst({
                where: { id: userId },
            });

            if (!dbSuperAdmin) throw new Error("no such user found!");

            if (dbSuperAdmin.ROLE !== "SUPERADMIN") {
                throw new Error("only superadmin can update admins");
            }

            const admin = await prismaClient.user.findFirst({
                where: {
                    id: adminId,
                    ROLE: "ADMIN",
                },
            });

            if (!admin) throw new Error("admin not found");

            if (data.email && data.email !== admin.email) {
                const emailExists = await prismaClient.user.findFirst({
                    where: { email: data.email },
                });

                if (emailExists) throw new Error("email already in use");
            }

            const updatedAdmin = await prismaClient.user.update({
                where: { id: adminId },
                data: {
                    name: data.name ?? admin.name,
                    email: data.email ?? admin.email,
                    password: data.password
                        ? await hashPassword(data.password)
                        : admin.password,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    ROLE: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            return res
                .status(200)
                .json(apiResponse(200, "admin updated successfully", updatedAdmin));
        } catch (error: any) {
            console.log(error);
            return res.status(200).json(apiResponse(200, error.message, null));
        }
    }

    async deleteAdmin(req: Request, res: Response) {
        try {
            if (!req.user) throw new Error("user is not authenticated");
            const userId = req.user.id;
            const adminId = req.params.id;

            if (!adminId) throw new Error("admin id is required");

            const dbSuperAdmin = await prismaClient.user.findFirst({
                where: { id: userId },
            });

            if (!dbSuperAdmin) throw new Error("no such user found!");

            if (dbSuperAdmin.ROLE !== "SUPERADMIN") {
                throw new Error("only superadmin can view admins");
            }

            const admin = await prismaClient.user.findFirst({
                where: {
                    ROLE: "ADMIN",
                    id: adminId
                },
            });
            if (!admin) throw new Error("admin not found");
            if (admin.id === userId) {
                throw new Error("superadmin cannot delete themselves");
            }
            const deletedAdmin = await prismaClient.user.delete({
                where: { id: adminId },
            });
            if (!deletedAdmin) throw new Error("Error deleting admin");
            return res
                .status(200)
                .json(apiResponse(200, "admin deleted successfully", deletedAdmin));
        } catch (error: any) {
            console.log(error);
            return res.status(200).json(apiResponse(200, error.message, null));
        }
    }
    async getAllAdmins(req: Request, res: Response) {
        try {
            if (!req.user) throw new Error("user is not authenticated");
            const userId = req.user.id;

            const dbSuperAdmin = await prismaClient.user.findFirst({
                where: { id: userId },
            });

            if (!dbSuperAdmin) throw new Error("no such user found!");

            if (dbSuperAdmin.ROLE !== "SUPERADMIN") {
                throw new Error("only superadmin can view admins");
            }

            const admins = await prismaClient.user.findMany({
                where: {
                    ROLE: "ADMIN",
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    ROLE: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            return res
                .status(200)
                .json(apiResponse(200, "admins fetched successfully", admins));
        } catch (error: any) {
            console.log(error);
            return res.status(200).json(apiResponse(200, error.message, null));
        }
    }

    async getAdminbyId(req: Request, res: Response) {
        try {
            if (!req.user) throw new Error("user is not authenticated");
            const userId = req.user.id;
            const adminId = req.params.id;

            if (!adminId) throw new Error("admin id is required");

            const dbSuperAdmin = await prismaClient.user.findFirst({
                where: { id: userId },
            });

            if (!dbSuperAdmin) throw new Error("no such user found!");

            if (dbSuperAdmin.ROLE !== "SUPERADMIN") {
                throw new Error("only superadmin can view admins");
            }

            const admin = await prismaClient.user.findFirst({
                where: {
                    ROLE: "ADMIN",
                    id: adminId
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    ROLE: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            if (!admin) throw new Error("admin not found");
            return res
                .status(200)
                .json(apiResponse(200, "admin fetched successfully", admin));
        } catch (error: any) {
            console.log(error);
            return res.status(200).json(apiResponse(200, error.message, null));
        }
    }
}
export default new AdminController();