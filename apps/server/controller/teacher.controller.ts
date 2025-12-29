import type { Request, Response } from "express";
import { hashPassword } from "../utils/password";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
import type { CreateTeacherBody, UpdateTeacherBody } from "../utils/type";
class TeacherController {
    async createTeacher(req: Request, res: Response) {
        try {
            if (!req.user) throw new Error("user is not authenticated");

            const data: CreateTeacherBody = req.body;
            if (!data) throw new Error("please provide all required fields");

            const userId = req.user.id;

            const dbUser = await prismaClient.user.findFirst({
                where: { id: userId },
            });

            if (!dbUser) throw new Error("no such user found!");

            if (dbUser.ROLE !== "INSTITUTION" && dbUser.ROLE !== "VENDOR") {
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

            if (data.vendorId) {
                const vendor = await prismaClient.vendor.findFirst({
                    where: {
                        id: data.vendorId,
                        institutionId: data.instituteId,
                    },
                });
                if (!vendor) throw new Error("invalid vendor for institution");
            }

            const hashedPassword = await hashPassword(data.loginPassword);

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

            const dbUser = await prismaClient.user.findFirst({
                where: { id: userId },
            });
            if (!dbUser) throw new Error("no such user found");

            if (dbUser.ROLE !== "INSTITUTION" && dbUser.ROLE !== "VENDOR") {
                throw new Error("only institution or vendor can update teachers");
            }

            const teacher = await prismaClient.teacher.findFirst({
                where: { id: teacherId },
            });
            if (!teacher) throw new Error("teacher not found");

            if (dbUser.ROLE === "INSTITUTION" && teacher.instituteId !== userId) {
                throw new Error("not authorized");
            }

            if (dbUser.ROLE === "VENDOR" && teacher.vendorId !== userId) {
                throw new Error("not authorized");
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

            const dbUser = await prismaClient.user.findFirst({
                where: { id: userId },
            });
            if (!dbUser) throw new Error("no such user found");

            if (dbUser.ROLE !== "INSTITUTION" && dbUser.ROLE !== "VENDOR") {
                throw new Error("only institution or vendor can delete teachers");
            }

            const teacher = await prismaClient.teacher.findFirst({
                where: { id: teacherId },
            });
            if (!teacher) throw new Error("teacher not found");

            if (dbUser.ROLE === "INSTITUTION" && teacher.instituteId !== userId) {
                throw new Error("not authorized");
            }

            if (dbUser.ROLE === "VENDOR" && teacher.vendorId !== userId) {
                throw new Error("not authorized");
            }

            await prismaClient.teacher.delete({
                where: { id: teacherId },
            });

            return res
                .status(200)
                .json(apiResponse(200, "teacher deleted successfully", teacher));
        } catch (error: any) {
            console.log(error);
            return res.status(200).json(apiResponse(200, error.message, null));
        }
    }

    async getAllTeachers(req: Request, res: Response) {
        try {
            if (!req.user) throw new Error("user is not authenticated");
            const userId = req.user.id;

            const dbUser = await prismaClient.user.findFirst({
                where: { id: userId },
            });
            if (!dbUser) throw new Error("no such user found");

            let whereClause: any = {};

            if (dbUser.ROLE === "INSTITUTION") {
                whereClause = { instituteId: userId };
            }

            if (dbUser.ROLE === "VENDOR") {
                whereClause = { vendorId: userId };
            }

            if (
                dbUser.ROLE !== "SUPERADMIN" &&
                dbUser.ROLE !== "ADMIN" &&
                dbUser.ROLE !== "INSTITUTION" &&
                dbUser.ROLE !== "VENDOR"
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

            const dbUser = await prismaClient.user.findFirst({
                where: { id: userId },
            });
            if (!dbUser) throw new Error("no such user found");

            const teacher = await prismaClient.teacher.findFirst({
                where: { id: teacherId },
            });
            if (!teacher) throw new Error("teacher not found");

            if (dbUser.ROLE === "INSTITUTION" && teacher.instituteId !== userId) {
                throw new Error("not authorized to view this teacher");
            }

            if (dbUser.ROLE === "VENDOR" && teacher.vendorId !== userId) {
                throw new Error("not authorized to view this teacher");
            }

            if (
                dbUser.ROLE !== "SUPERADMIN" &&
                dbUser.ROLE !== "ADMIN" &&
                dbUser.ROLE !== "INSTITUTION" &&
                dbUser.ROLE !== "VENDOR"
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

}
export default new TeacherController();