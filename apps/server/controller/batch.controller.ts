import type { Request, Response } from "express";
import { hashPassword } from "../utils/password";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
import type { CreateBatchBody, UpdateBatchBody } from "../utils/type";
// import type { CreateTeacherBody, UpdateTeacherBody } from "../utils/type";
class BatchController {
  async createBatch(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      const data: CreateBatchBody = req.body;
      if (!data) throw new Error("Please Provide all required fields");

      if (req.user.type !== "INSTITUTION") {
        throw new Error("only institution can create batches");
      }
      const existingBatch = await prismaClient.batch.findFirst({
        where: { batchname: data.batchname },
      });
      if (existingBatch) throw new Error("Batch with this name already exists");

      const createdBatch = await prismaClient.batch.create({
        data: {
          batchname: data.batchname,
          branch: data.branch,
          batchEndYear: data.batchEndYear,
          institutionId: req.user.id,
        },
      });

      if (!createdBatch) throw new Error("error in creating batch");
      return res
        .status(200)
        .json(apiResponse(200, "batch created successfully", createdBatch));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async updateBatch(req: Request, res: Response) {
    try {
      const batchId = req.params.id;
      if (!batchId) throw new Error("Batch id is required");
      if (!req.user) throw new Error("user is not authenticated");
      const data: UpdateBatchBody = req.body;

      const institutionId = req.user.id;

      if (req.user.type !== "INSTITUTION") {
        throw new Error("only institution can update batches");
      }
      const batch = await prismaClient.batch.findFirst({
        where: { id: batchId as string },
      });
      if (!batch) throw new Error("Batch not found");

      if (batch.institutionId !== institutionId) {
        throw new Error("this batch does not belongs to this institution");
      }

      const updatedBatch = await prismaClient.batch.update({
        where: { id: batchId as string },
        data: {
          batchname: data.batchname ?? batch.batchname,
          branch: data.branch ?? batch.branch,
          batchEndYear: data.batchEndYear ?? batch.batchEndYear,
        },
      });

      if (!updatedBatch) throw new Error("error in updating batch");
      return res
        .status(200)
        .json(apiResponse(200, "batch updated successfully", updatedBatch));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async deleteBatch(req: Request, res: Response) {
    try {
      const batchId = req.params.id;

      if (!req.user) throw new Error("user is not authenticated");

      const institutionId = req.user.id;

      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type !== "INSTITUTION"
      ) {
        throw new Error("only institution can delete batches");
      }
      const batch = await prismaClient.batch.findFirst({
        where: { id: batchId as string },
      });
      if (!batch) throw new Error("Batch not found");

      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type == "INSTITUTION" &&
        batch.institutionId !== institutionId
      ) {
        throw new Error("this batch does not belongs to this institution");
      }

      const deletedBatch = await prismaClient.batch.delete({
        where: { id: batchId as string },
      });

      if (!deletedBatch) throw new Error("error in deleting batch");
      return res
        .status(200)
        .json(apiResponse(200, "batch updated successfully", deletedBatch));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async getAllBatches(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");

      const institutionId = req.user.id;
      let whereClause: any = {};
      if (req.user.type !== "INSTITUTION" && req.user.type !== "SUPERADMIN") {
        throw new Error("only institution can view batches");
      }
      if (req.user.type === "INSTITUTION")
        whereClause = { institutionId: institutionId };

      const institutions = await prismaClient.batch.findMany({
        where: whereClause,
        select: {
          id: true,
          batchname: true,
          branch: true,
          batchEndYear: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "batches fetched successfully", institutions));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async getBatchById(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      let whereClause: any = {};
      const institutionId = req.user.id;
      const batchId = req.params.id;
      if (req.user.type !== "INSTITUTION" && req.user.type !== "SUPERADMIN") {
        throw new Error("only institution can view batches");
      }
      const batch = await prismaClient.batch.findFirst({
        where: { id: batchId as string },

        select: {
          id: true,
          batchname: true,
          branch: true,
          batchEndYear: true,
          institutionId: true,
          students: true,
          institution: {
            select: {
              name: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!batch) throw new Error("Batch not found");

      if (
        req.user.type === "INSTITUTION" &&
        batch.institutionId !== institutionId
      ) {
        throw new Error("this batch does not belong to this institution");
      }

      if (!batch) {
        throw new Error("batch not found");
      }

      return res
        .status(200)
        .json(apiResponse(200, "batch found successfully", batch));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
}
export default new BatchController();
