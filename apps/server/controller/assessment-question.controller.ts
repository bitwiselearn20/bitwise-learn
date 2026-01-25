import type { Request, Response } from "express";
import type {
  CreateAssessmentQuestionBody,
  UpdateAssessmentQuestionBody,
} from "../utils/type";
import prismaClient from "../utils/prisma";
import apiResponse from "../utils/apiResponse";

class AssessmentQuestionController {
  async createAssessmentQuestion(req: Request, res: Response) {
    try {
      const data: CreateAssessmentQuestionBody = req.body;
      const sectionId = req.params.id;

      if (!sectionId) throw new Error("sectionID not found");
      if (!req.user) throw new Error("User not authenticated");
      if (!data) throw new Error("Please provide all fields");
      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type !== "INSTITUTION" &&
        req.user.type !== "VENDOR"
      )
        throw new Error("User Not Authorized to create Assessments");

      const dbSection = await prismaClient.assessmentSection.findUnique({
        where: { id: sectionId as string },
      });

      if (!dbSection) throw new Error("section not found");

      let createdAssessmentQuestion;

      if (!data.problem) {
        createdAssessmentQuestion =
          await prismaClient.assessmentQuestion.create({
            data: {
              question: data.question,
              options: data.options,
              correctOption: data.correctOption,
              maxMarks: data.maxMarks,
              sectionId: dbSection.id,
            },
          });
      } else {
        createdAssessmentQuestion =
          await prismaClient.assessmentQuestion.create({
            data: {
              problem: {
                connect: {
                  id: data.problem as string,
                },
              },
              maxMarks: data.maxMarks,
              section: {
                connect: {
                  id: dbSection.id,
                },
              },
              options: [],

            },
          });
      }
      if (!createdAssessmentQuestion)
        throw new Error("Error Creating Assessment Section");
      return res
        .status(200)
        .json(
          apiResponse(
            200,
            "Assessment Section Created Successfully.",
            createdAssessmentQuestion,
          ),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async updateAssessmentQuestion(req: Request, res: Response) {
    try {
      const questionId = req.params.id;
      const data: UpdateAssessmentQuestionBody = req.body;

      if (!req.user) throw new Error("User not authenticated");
      if (!data) throw new Error("Please provide all fields");
      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type !== "INSTITUTION" &&
        req.user.type !== "VENDOR"
      )
        throw new Error("User Not Authorized to update Assessments");

      const dbQuestion = await prismaClient.assessmentQuestion.findFirst({
        where: { id: questionId as string },
      });
      if (!dbQuestion) throw new Error("Question not found");

      const updatedAssessmentQuestion =
        await prismaClient.assessmentQuestion.update({
          where: { id: dbQuestion.id },
          data: {
            maxMarks: data.maxMarks ?? dbQuestion.maxMarks,
            options: data.options ?? dbQuestion.options,
            correctOption: data.correctOption ?? dbQuestion.correctOption,
            question: data.question ?? dbQuestion.question,
          },
        });
      if (!updatedAssessmentQuestion)
        throw new Error("Error Updating Assessment Question");
      return res
        .status(200)
        .json(
          apiResponse(
            200,
            "Assessment Question Updated Successfully.",
            updatedAssessmentQuestion,
          ),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async deleteAssessmentQuestion(req: Request, res: Response) {
    try {
      const questionId = req.params.id;
      if (!req.user) throw new Error("User not authenticated");
      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type !== "INSTITUTION" &&
        req.user.type !== "VENDOR"
      )
        throw new Error("User Not Authorized to delete Assessments");

      const section = await prismaClient.assessmentQuestion.findFirst({
        where: { id: questionId as string },
      });
      if (!section) throw new Error("assessment section not found");

      const deletedAssessmentSection =
        await prismaClient.assessmentQuestion.delete({
          where: { id: questionId as string },
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
  async getAllSectionQuestion(req: Request, res: Response) {
    try {
      const sectionId = req.params.id;
      if (!req.user) throw new Error("user is not authenticated");
      if (
        req.user.type !== "SUPERADMIN" &&
        req.user.type !== "ADMIN" &&
        req.user.type !== "INSTITUTION" &&
        req.user.type !== "VENDOR"
      )
        throw new Error("User Not Authorized to delete Assessments");
      const dbSection = await prismaClient.assessmentSection.findUnique({
        where: { id: sectionId as string },
      });
      if (!dbSection) throw new Error("no such section exists");

      const questions = await prismaClient.assessmentQuestion.findMany({
        where: {
          sectionId: dbSection.id,
        },
      });

      return res
        .status(200)
        .json(
          apiResponse(
            200,
            "assessment questions fetched successfully",
            questions,
          ),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
}
export default new AssessmentQuestionController();
