import type { Request, Response } from "express";
import { hashPassword } from "../utils/password";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
import type { CreateTeacherBody, UpdateTeacherBody } from "../utils/type";
class BatchController {
    async createBatch(req: Request, res: Response) { }
    async updateBatch(req: Request, res: Response) { }
    async deleteBatch(req: Request, res: Response) { }
    async getAllBatches(req: Request, res: Response) { }
    async getBatcheById(req: Request, res: Response) { }
}