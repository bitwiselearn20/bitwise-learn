import type { Request, Response } from "express";
import type {
  CreateAssessmentSection,
  UpdateAssessmentSection,
} from "../utils/type";
import prismaClient from "../utils/prisma";
import apiResponse from "../utils/apiResponse";

class AssessmentSectionController {
  async createAssessmentSection(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("User not authenticated");

      const data: CreateAssessmentSection = req.body;

      if (!data) throw new Error("Please provide all fields");

      if (!data.assessmentId) {
        throw new Error("Assessment ID is required");
      }

      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type !== "INSTITUTION" &&
        req.user.type !== "VENDOR"
      ) {
        throw new Error("User Not Authorized to create Assessments");
      }

      const createdAssessmentSection =
        await prismaClient.assessmentSection.create({
          data: {
            name: data.name,
            marksPerQuestion: data.marksPerQuestion,
            assessmentType: data.assessmentType,
            assessment: {
              connect: {
                id: data.assessmentId,
              },
            },
          },
        });

      return res
        .status(200)
        .json(
          apiResponse(
            200,
            "Assessment Section Created Successfully.",
            createdAssessmentSection,
          ),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }

  async updateAssessmentSection(req: Request, res: Response) {
    try {
      const sectionId = req.params.id;
      if (!req.user) throw new Error("User not authenticated");
      const data: UpdateAssessmentSection = req.body;
      if (!data) throw new Error("Please provide all fields");
      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type !== "INSTITUTION" &&
        req.user.type !== "VENDOR"
      )
        throw new Error("User Not Authorized to update Assessments");

      const section = await prismaClient.assessmentSection.findFirst({
        where: { id: sectionId as string },
      });
      if (!section) throw new Error("assessment section not found");

      const updatedAssessmentSection =
        await prismaClient.assessmentSection.update({
          where: { id: sectionId as string },
          data: {
            name: data.name ?? section.name,
            marksPerQuestion: data.marksPerQuestion ?? section.marksPerQuestion,
          },
        });
      if (!updatedAssessmentSection)
        throw new Error("Error Updating Assessment Section");
      return res
        .status(200)
        .json(
          apiResponse(
            200,
            "Assessment Section Updated Successfully.",
            updatedAssessmentSection,
          ),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async deleteAssessmentSection(req: Request, res: Response) {
    try {
      const sectionId = req.params.id;
      if (!req.user) throw new Error("User not authenticated");
      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type !== "INSTITUTION" &&
        req.user.type !== "VENDOR"
      )
        throw new Error("User Not Authorized to delete Assessments");

      const section = await prismaClient.assessmentSection.findFirst({
        where: { id: sectionId as string },
      });
      if (!section) throw new Error("assessment section not found");

      const deletedAssessmentSection =
        await prismaClient.assessmentSection.delete({
          where: { id: sectionId as string },
        });
      if (!deletedAssessmentSection)
        throw new Error("Error Deleting Assessment Section");
      return res
        .status(200)
        .json(
          apiResponse(
            200,
            "Assessment Section Deleted Successfully.",
            deletedAssessmentSection,
          ),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async getAllAssessmentSection(req: Request, res: Response) {
    try {
      const assessmentId = req.params.id;
      if (!req.user) throw new Error("user is not authenticated");
      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type !== "INSTITUTION" &&
        req.user.type !== "VENDOR"
      )
        throw new Error("User Not Authorized to view Assessment Sections");
      if (!assessmentId) throw new Error("Assessment ID is required");
      const sections = await prismaClient.assessmentSection.findMany({
        where: {
          assessmentId: assessmentId as string,
        },
        select: {
          id: true,
          name: true,
          marksPerQuestion: true,
          assessmentType: true,
          assessmentId: true,
        },
      });

      return res
        .status(200)
        .json(
          apiResponse(
            200,
            "assessment sections fetched successfully",
            sections,
          ),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async getAssessmentSectionById(req: Request, res: Response) {
    try {
      const sectionId = req.params.id;
      if (!req.user) throw new Error("User not authenticated");
      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type !== "INSTITUTION" &&
        req.user.type !== "VENDOR"
      )
        throw new Error("User Not Authorized to update Assessments");

      const sections = await prismaClient.assessmentSection.findFirst({
        where: { id: sectionId as string },
        select: {
          name: true,
          marksPerQuestion: true,
          assessmentType: true,
          assessmentId: true,
        },
      });
      if (!sections) throw new Error("assessment sections not found");

      return res
        .status(200)
        .json(apiResponse(200, "Assessment Fetched Successfully", sections));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
}
export default new AssessmentSectionController();
