import type { Request, Response } from "express";
import type { CreateAssessment, UpdateAssessment } from "../utils/type";
import prismaClient from "../utils/prisma";
import apiResponse from "../utils/apiResponse";
import MQClient from "../utils/producer";
class AssessmentController {
  async createAssessment(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("User not authenticated");
      const data: CreateAssessment = req.body;
      if (!data) throw new Error("Please provide all fields");
      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type !== "INSTITUTION" &&
        req.user.type !== "VENDOR"
      )
        throw new Error("User Not Authorized to create Assessments");
      // const existingAssessment = await prismaClient.assessment.findFirst({
      //     where:{
      //         name:data.name
      //     }
      // });
      // if(existingAssessment)throw new Error("Assessment with this name already exists");
      const startTime = new Date(data.startTime);
      const endTime = new Date(data.endTime);
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime()))
        throw new Error("Invalid startTime or endTime");

      const createdAssessment = await prismaClient.assessment.create({
        data: {
          name: data.name,
          description: data.description,
          instruction: data.instruction,
          startTime,
          endTime,
          individualSectionTimeLimit: data.individualSectionTimeLimit,
          status: data.status,
          creatorId: req.user.id,
          batchId: data.batchId,
        },
      });
      if (!createdAssessment) throw new Error("Error Creating Assessment");
      return res
        .status(200)
        .json(
          apiResponse(
            200,
            "Assessment Created Successfully.",
            createdAssessment,
          ),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async updateAssessment(req: Request, res: Response) {
    try {
      const assessmentId = req.params.id;
      const data: UpdateAssessment = req.body;

      if (!req.user) throw new Error("User not authenticated");
      if (!data) throw new Error("Please provide all fields");
      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type !== "INSTITUTION" &&
        req.user.type !== "VENDOR"
      )
        throw new Error("User Not Authorized to update Assessments");

      const assessment = await prismaClient.assessment.findFirst({
        where: { id: assessmentId as string },
      });
      if (!assessment) throw new Error("assessment not found");

      const updatedAssessment = await prismaClient.assessment.update({
        where: { id: assessmentId as string },
        data: {
          name: data.name ?? assessment.name,
          description: data.description ?? assessment.description,
          instruction: data.instruction ?? assessment.description,
          startTime: data.startTime ?? assessment.startTime,
          endTime: data.endTime ?? assessment.endTime,
          individualSectionTimeLimit:
            data.individualSectionTimeLimit ??
            assessment.individualSectionTimeLimit,
          status: data.status ?? assessment.status,
        },
      });
      if (!updatedAssessment) throw new Error("Error Updating Assessment");
      return res
        .status(200)
        .json(
          apiResponse(
            200,
            "Assessment Updated Successfully.",
            updatedAssessment,
          ),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async deleteAssessment(req: Request, res: Response) {
    try {
      const assessmentId = req.params.id;
      if (!req.user) throw new Error("User not authenticated");
      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type !== "INSTITUTION" &&
        req.user.type !== "VENDOR"
      )
        throw new Error("User Not Authorized to delete Assessments");

      const assessment = await prismaClient.assessment.findFirst({
        where: { id: assessmentId as string },
      });
      if (!assessment) throw new Error("assessment not found");

      const deletedAssessment = await prismaClient.assessment.delete({
        where: { id: assessmentId as string },
      });
      if (!deletedAssessment) throw new Error("Error Deleting Assessment");
      return res
        .status(200)
        .json(
          apiResponse(
            200,
            "Assessment Deleted Successfully.",
            deletedAssessment,
          ),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async getAllAssessment(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type !== "INSTITUTION" &&
        req.user.type !== "VENDOR"
      )
        throw new Error("User Not Authorized to delete Assessments");
      const assessments = await prismaClient.assessment.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          instruction: true,
          startTime: true,
          endTime: true,
          individualSectionTimeLimit: true,
          status: true,
          batchId: true,
        },
      });

      return res
        .status(200)
        .json(
          apiResponse(200, "assessments fetched successfully", assessments),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async getAssessmentById(req: Request, res: Response) {
    try {
      const assessmentId = req.params.id;
      if (!req.user) throw new Error("User not authenticated");
      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type !== "INSTITUTION" &&
        req.user.type !== "VENDOR"
      )
        throw new Error("User Not Authorized to update Assessments");

      const assessment = await prismaClient.assessment.findUnique({
        where: { id: assessmentId as string },
        select: {
          id: true,
          name: true,
          description: true,
          instruction: true,
          startTime: true,
          endTime: true,
          individualSectionTimeLimit: true,
          status: true,
          batchId: true,
          sections: {
            include: {
              questions: true,
            },
          },
        },
      });
      if (!assessment) throw new Error("assessment not found");

      return res
        .status(200)
        .json(apiResponse(200, "Assessment Fetched Successfully", assessment));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async changeAssessmentStatus(req: Request, res: Response) {
    try {
      const assessmentId = req.params.id;
      if (!req.user) throw new Error("User not authenticated");
      const { status } = req.body;
      if (!status) throw new Error("Please provide all fields");
      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type !== "INSTITUTION" &&
        req.user.type !== "VENDOR"
      )
        throw new Error("User Not Authorized to update Assessments");

      const assessment = await prismaClient.assessment.findFirst({
        where: { id: assessmentId as string },
      });
      if (!assessment) throw new Error("assessment not found");

      const updatedAssessment = await prismaClient.assessment.update({
        where: { id: assessmentId as string },
        data: {
          status: status ?? assessment.status,
        },
      });
      if (!updatedAssessment) throw new Error("Error Updating Assessment");
      return res
        .status(200)
        .json(
          apiResponse(
            200,
            "Assessment Updated Successfully.",
            updatedAssessment,
          ),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async assessmentReportRequest(req: Request, res: Response) {
    try {
      const assessmentId = req.params.id;
      const dbAssessment = await prismaClient.assessment.findUnique({
        where: { id: assessmentId as string },
      });

      if (!dbAssessment) throw new Error("no such valid assessment found");

      if (dbAssessment.status !== "ENDED") {
        throw new Error("wait for test to end");
      }
      //TODO: Send the response to the queue
      await MQClient.registerNewChannel("assessment-report");

      const messageSent = await MQClient.sendToQueue(
        "assessment-report",
        JSON.stringify({ id: dbAssessment.id }),
      );

      if (!messageSent) throw new Error("request failed");

      return res
        .status(200)
        .json(apiResponse(200, "message pushed into queue", null));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
}
export default new AssessmentController();
