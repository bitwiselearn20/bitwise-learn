import type { Request, Response } from "express";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
import CodeExecution from "../service/piston.service";

class AssessmentSubmission {
  async submitAssessment(req: Request, res: Response) {
    try {
      const assessmentId = req.params.id;
      const userId = req.user?.id;

      if (!assessmentId) throw new Error(" assessmentID is required");
      if (!userId) throw new Error(" userID is required");

      const dbUser = await prismaClient.student.findUnique({
        where: { id: userId as string },
      });

      if (!dbUser) throw new Error("user not found");

      const dbAssessment = await prismaClient.assessment.findUnique({
        where: { id: assessmentId as string },
      });
      if (!dbAssessment) throw new Error("assessment not found");
      if (dbAssessment.status !== "LIVE") throw new Error("test has ended");
      const dbAssessmentSubmission =
        await prismaClient.assessmentSubmission.findFirst({
          where: { assessmentId: dbAssessment?.id, studentId: dbUser.id },
        });

      if (dbAssessmentSubmission)
        throw new Error("already submitted assessment");

      const assessmentQuestion =
        await prismaClient.assessmentQuestionSubmission.findMany({
          where: {
            studentId: dbUser.id,
            assessmentId: dbAssessment.id,
          },
        });

      const totalMarks = assessmentQuestion.reduce((acc, submission) => {
        return acc + (submission?.marksObtained || 0);
      }, 0);

      const submitAssignment = await prismaClient.assessmentSubmission.create({
        data: {
          assessmentId: dbAssessment?.id,
          studentId: dbUser.id,
          studentIp: req.ip as string,
          proctoringStatus:
            req.body.tabSwitchCount !== 0 ? "CHEATED" : "NOT_CHEATED",
          tabSwitchCount: req.body.tabSwitchCount || 0,
          isSubmitted: true,
          totalMarks: totalMarks,
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "assignment submitted", submitAssignment));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async submitAssessmentQuestion(req: Request, res: Response) {
    try {
      const questionId = req.params.id;
      const userId = req.user?.id;

      if (!questionId) throw new Error("questionID is required");
      if (!userId) throw new Error("userID is required");

      const dbStudent = await prismaClient.student.findUnique({
        where: { id: userId as string },
      });

      if (!dbStudent) throw new Error("student not found");
      const dbQuestion = await prismaClient.assessmentQuestion.findUnique({
        where: { id: questionId as string },
        select: {
          id: true,
          question: true,
          options: true,
          correctOption: true,
          problemId: true,
          section: {
            select: {
              assessmentId: true,
              assessmentType: true,
              marksPerQuestion: true,
            },
          },
        },
      });

      if (!dbQuestion) throw new Error("assessment Question not found");

      const dbSubmission =
        await prismaClient.assessmentQuestionSubmission.findFirst({
          where: { questionId: dbQuestion.id, studentId: dbStudent.id },
        });
      let result: any;
      const isMCQ = dbQuestion.section.assessmentType;
      const marksPerQuestion = dbQuestion.section.marksPerQuestion;

      if (dbSubmission) {
        if (isMCQ) {
          console.log("starting update result in mcq");
          console.log(dbQuestion.correctOption);
          result = await prismaClient.assessmentQuestionSubmission.update({
            where: { id: dbSubmission.id },
            data: {
              answer: req.body.option,
              marksObtained:
                dbQuestion.correctOption == req.body.option
                  ? marksPerQuestion
                  : 0,
            },
          });
          console.log("updated result in mcq");
        } else {
          //TODO: way to handle code questions
          const dbProblem = await prismaClient.problem.findUnique({
            where: { id: dbQuestion.problemId as string },
          });

          if (!dbProblem) throw new Error("problem not found");

          const { passed, wrong } = await CodeExecution.compileTestQuestion(
            req.body.code,
            req.body.language,
          );
          // ALL PASSED, FULL MARKS
          if (wrong == 0) {
            result = await prismaClient.assessmentQuestionSubmission.update({
              where: { id: dbSubmission.id },
              data: {
                answer: req.body.code,
                marksObtained: marksPerQuestion,
              },
            });
          } else {
            result = await prismaClient.assessmentQuestionSubmission.update({
              where: { id: dbSubmission.id },
              data: {
                answer: req.body.code,
                marksObtained: Math.round(
                  (marksPerQuestion * passed) / (wrong + passed),
                ),
              },
            });
          }
        }
      } else {
        if (isMCQ) {
          result = await prismaClient.assessmentQuestionSubmission.create({
            data: {
              questionId: dbQuestion.id,
              studentId: dbStudent.id,
              assessmentId: dbQuestion.section.assessmentId,
              answer: req.body.option,
              marksObtained:
                dbQuestion.correctOption == req.body.option
                  ? marksPerQuestion
                  : 0,
            },
          });
        } else {
          //TODO: way to handle code questions
          const { passed, wrong } = await CodeExecution.compileTestQuestion(
            req.body.code,
            req.body.language,
          );
          // ALL PASSED, FULL MARKS
          if (wrong == 0) {
            result = await prismaClient.assessmentQuestionSubmission.create({
              data: {
                questionId: dbQuestion.id,
                studentId: dbStudent.id,
                assessmentId: dbQuestion.section.assessmentId,
                answer: req.body.code,
                marksObtained: marksPerQuestion,
              },
            });
          } else {
            result = await prismaClient.assessmentQuestionSubmission.create({
              data: {
                questionId: dbQuestion.id,
                studentId: dbStudent.id,
                assessmentId: dbQuestion.section.assessmentId,
                answer: req.body.code,
                marksObtained: Math.round(
                  (marksPerQuestion * passed) / (wrong + passed),
                ),
              },
            });
          }
        }
      }
      return res.status(200).json(apiResponse(200, "saved", null));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
}
export default new AssessmentSubmission();
