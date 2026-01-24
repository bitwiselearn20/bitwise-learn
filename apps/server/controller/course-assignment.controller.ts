import type { Request, Response } from "express";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
import type {
  AssignmentQuestionBody,
  CourseAssignmentBody,
  CourseAssignmentUpdate,
  UpdateAssignment,
} from "../utils/type";

class CourseAssignmentController {
  async addAssignmentToSection(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      const userId = req.user.id;
      const data: CourseAssignmentBody = req.body;

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such admin found!");

      const dbSection = await prismaClient.courseSections.findFirst({
        where: { id: data.sectionId },
      });

      if (!dbSection) throw new Error("invalid section id");

      const dbAssignment = await prismaClient.courseAssignemnt.findFirst({
        where: {
          name: data.name,
        },
      });

      if (dbAssignment) throw new Error("assignment already exists");

      const createdAssignment = await prismaClient.courseAssignemnt.create({
        data: {
          name: data.name,
          description: data.description,
          sectionId: data.sectionId,
          marksPerQuestion: data.marksPerQuestion,
          instruction: data.instruction,
        },
      });

      if (!createdAssignment) throw new Error("assignemnt was not created");

      return res
        .status(200)
        .json(apiResponse(200, "assignment added", createdAssignment));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async updateAssignmentToSection(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      const userId = req.user.id;
      const data: CourseAssignmentUpdate = req.body;
      const assignemntId = req.params.id;
      if (!assignemntId) throw new Error("assignmentID is required!");
      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such admin found!");

      const dbAssignment = await prismaClient.courseAssignemnt.findFirst({
        where: {
          id: assignemntId as string,
        },
      });

      if (!dbAssignment) throw new Error("assignment not found");

      const updatedAssignment = await prismaClient.courseAssignemnt.update({
        where: { id: dbAssignment.id },
        data: {
          description: data.description ?? dbAssignment.description,
          marksPerQuestion:
            data.marksPerQuestion ?? dbAssignment.marksPerQuestion,
          instruction: data.instruction ?? dbAssignment.instruction,
        },
      });

      if (!updatedAssignment) throw new Error("assignemnt was not updated");

      return res
        .status(200)
        .json(apiResponse(200, "assignment updated", updatedAssignment));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async removeAssignmentFromSection(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      const userId = req.user.id;
      const assignemntId = req.params.id;

      if (!assignemntId) throw new Error("assignmentID is required!");

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such admin found!");

      const dbAssignment = await prismaClient.courseAssignemnt.findFirst({
        where: {
          id: assignemntId as string,
        },
      });

      if (!dbAssignment) throw new Error("assignment not found");

      const removedAssignment = await prismaClient.courseAssignemnt.delete({
        where: { id: dbAssignment.id },
      });

      if (!removedAssignment) throw new Error("assignemnt was not removed");

      return res
        .status(200)
        .json(apiResponse(200, "assignment removed", removedAssignment));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getAllAssignmentFromSection(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("User not Authenticated");
      const userId = req.user.id;
      const sectionId = req.params.id;
      if (!sectionId) throw new Error("assignmentID is required!");

      const dbAdmin = await prismaClient.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbAdmin) throw new Error("No such Admin Found");

      const dbSection = await prismaClient.courseSections.findFirst({
        where: {
          id: sectionId as string,
          creatorId: userId,
        },
      });

      if (!dbSection) throw new Error("can not find course section");

      const dbAssignment = await prismaClient.courseAssignemnt.findMany({
        where: {
          sectionId: sectionId as string,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "assignment fetched", dbAssignment));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getAssignmentById(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");

      const userId = req.user.id;
      const assignmentId = req.params.id;

      const assignment = await prismaClient.courseAssignemnt.findFirst({
        where: {
          id: assignmentId as string,
          section: {
            creatorId: userId,
          },
        },
        include: {
          courseAssignemntQuestions: true,
        },
      });

      if (!assignment) throw new Error("assignment not found");

      return res
        .status(200)
        .json(apiResponse(200, "assignment fetched", assignment));
    } catch (error: any) {
      console.log(error);
      return res.status(500).json(apiResponse(500, error.message, null));
    }
  }

  async addCourseAssignemntQuestion(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      const userId = req.user.id;
      const data: AssignmentQuestionBody = req.body;
      if (!data) throw new Error("data is required");

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such admin found!");
      if (data.options.length === 0)
        throw new Error("more options are required");

      const dbQuestion = await prismaClient.courseAssignemntQuestion.findFirst({
        where: {
          question: data.question,
        },
      });

      if (dbQuestion) throw new Error("question already exists");

      const createdQuestion =
        await prismaClient.courseAssignemntQuestion.create({
          data: {
            question: data.question,
            type: data.options.length === 1 ? "SCQ" : "MCQ",
            options: data.options,
            assignmentId: data.assignmentId,
            correctAnswer: data.correctAnswer,
          },
        });

      if (!createdQuestion) throw new Error("question couldnot be added");

      return res
        .status(200)
        .json(
          apiResponse(200, "question added to assignment", createdQuestion),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async updateCourseAssignemntQuestion(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      const userId = req.user.id;
      const questionId = req.params.id;

      const data: UpdateAssignment = req.body;
      if (!data) throw new Error("data is required");

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such admin found!");

      const dbQuestion = await prismaClient.courseAssignemntQuestion.findFirst({
        where: {
          id: questionId as string,
        },
      });

      if (!dbQuestion) throw new Error("question doesnot  exists");

      const updatedQuestion =
        await prismaClient.courseAssignemntQuestion.update({
          where: {
            id: dbQuestion.id,
          },
          data: {
            question: data.question ?? dbQuestion.question,
            options: data.options ?? dbQuestion.options,
            correctAnswer: data.correctAnswer ?? dbQuestion.correctAnswer,
            type: data.type ?? dbQuestion.type,
          },
        });

      if (!updatedQuestion) throw new Error("question couldnot be updated");

      return res
        .status(200)
        .json(
          apiResponse(200, "question updated to assignment", updatedQuestion),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async removeCourseAssignemntQuestion(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      const userId = req.user.id;
      const questionId = req.params.id;

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such admin found!");

      const dbQuestion = await prismaClient.courseAssignemntQuestion.findFirst({
        where: {
          id: questionId as string,
        },
      });

      if (!dbQuestion) throw new Error("question doesnot  exists");

      const removedQuestion =
        await prismaClient.courseAssignemntQuestion.delete({
          where: {
            id: dbQuestion.id,
          },
        });

      if (!removedQuestion) throw new Error("question couldnot be removed");

      return res
        .status(200)
        .json(
          apiResponse(200, "question removed to assignment", removedQuestion),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
}
export default new CourseAssignmentController();
