import type { Request, Response } from "express";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
import type { GradesBody } from "../utils/type";

class CourseGradeController {
  async getAllAssignmentMarks(req: Request, res: Response) {
    try {
      const studentId = req.user?.id;

      if (!studentId) throw new Error("no new student found");

      const dbStudent = await prismaClient.student.findUnique({
        where: { id: studentId },
      });
      if (!dbStudent) throw new Error("no such student found");

      const institutionId = dbStudent.instituteId;
      const enrolledCourses = await prismaClient.courseEnrollment.findMany({
        where: { institutionId: institutionId },
      });

      const dbCourses = await prismaClient.course.findMany({
        where: { id: { in: enrolledCourses.map((c) => c.courseId) } },
        select: {
          id: true,
          name: true,
          courseSections: {
            select: {
              courseAssignemnts: {
                select: {
                  courseAssignemntQuestions: {
                    select: {
                      courseAssignemntSubmissions: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const result = dbCourses.map((course) => {
        let courseTotalMarks = 0;
        let courseObtainedMarks = 0;

        const sectionScores: Record<string, number> = {};

        course.courseSections.forEach((section, sectionIndex) => {
          let sectionTotalMarks = 0;
          let sectionObtainedMarks = 0;

          section.courseAssignemnts.forEach((assignment) => {
            assignment.courseAssignemntQuestions.forEach((question) => {
              const marksPerQuestion =
                Number(
                  question.courseAssignemntSubmissions[0]?.marksObtained,
                ) || 0;

              // total possible marks
              sectionTotalMarks += marksPerQuestion;
              courseTotalMarks += marksPerQuestion;

              // student's submission
              const submission = question.courseAssignemntSubmissions.find(
                (s) => s.studentId === studentId,
              );

              const obtained = submission?.marksObtained ?? 0;

              sectionObtainedMarks += obtained;
              courseObtainedMarks += obtained;
            });
          });

          sectionScores[`section_${sectionIndex + 1}`] =
            sectionTotalMarks === 0
              ? 0
              : sectionObtainedMarks / sectionTotalMarks;
        });

        return {
          courseId: course.id,
          courseName: course.name,
          overallScore:
            courseTotalMarks === 0 ? 0 : courseObtainedMarks / courseTotalMarks,
          sectionScores,
        };
      });

      return res
        .status(200)
        .json(apiResponse(200, "assignment fetched", result));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getAssignmentMarksByCourseId(req: Request, res: Response) {
    try {
      const studentId = req.user?.id;
      const courseId = req.params.id;

      if (!studentId) throw new Error("no new student found");
      if (!courseId) throw new Error("courseId is required");

      const dbStudent = await prismaClient.student.findUnique({
        where: { id: studentId },
      });
      if (!dbStudent) throw new Error("no such student found");

      const dbCourse = await prismaClient.course.findUnique({
        where: { id: courseId as string },
        select: {
          id: true,
          name: true,
          courseSections: {
            select: {
              courseAssignemnts: {
                select: {
                  courseAssignemntQuestions: {
                    select: {
                      courseAssignemntSubmissions: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!dbCourse) throw new Error("course not found");

      let courseTotalMarks = 0;
      let courseObtainedMarks = 0;
      const sectionScores: Record<string, number> = {};

      dbCourse.courseSections.forEach((section, sectionIndex) => {
        let sectionTotalMarks = 0;
        let sectionObtainedMarks = 0;

        section.courseAssignemnts.forEach((assignment) => {
          assignment.courseAssignemntQuestions.forEach((question) => {
            const marksPerQuestion =
              Number(question.courseAssignemntSubmissions[0]?.marksObtained) ||
              0;

            sectionTotalMarks += marksPerQuestion;
            courseTotalMarks += marksPerQuestion;

            const submission = question.courseAssignemntSubmissions.find(
              (s) => s.studentId === studentId,
            );

            const obtained = submission?.marksObtained ?? 0;

            sectionObtainedMarks += obtained;
            courseObtainedMarks += obtained;
          });
        });

        sectionScores[`section_${sectionIndex + 1}`] =
          sectionTotalMarks === 0
            ? 0
            : sectionObtainedMarks / sectionTotalMarks;
      });

      const result = {
        courseId: dbCourse.id,
        courseName: dbCourse.name,
        overallScore:
          courseTotalMarks === 0 ? 0 : courseObtainedMarks / courseTotalMarks,
        sectionScores,
      };

      return res
        .status(200)
        .json(apiResponse(200, "assignment fetched", result));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }

  async submitCourseAssignment(req: Request, res: Response) {
    try {
      const data: GradesBody[] = req.body;
      const studentId = req.user?.id;

      if (!studentId) throw new Error("no new student found");
      if (!Array.isArray(data) || data.length === 0)
        throw new Error("submission data is required");

      const dbStudent = await prismaClient.student.findUnique({
        where: { id: studentId },
      });
      if (!dbStudent) throw new Error("no such student found");

      const createdSubmissions: any[] = [];

      await prismaClient.$transaction(async (tx) => {
        for (const submission of data) {
          if (!submission.questionId || !submission.answer) {
            throw new Error("questionId and answer are required");
          }

          // check if already submitted
          const alreadySubmitted =
            await tx.courseAssignemntSubmission.findFirst({
              where: {
                questionId: submission.questionId,
                studentId: dbStudent.id,
              },
            });

          if (alreadySubmitted) continue;

          // fetch question with assignment for evaluation
          const dbQuestion = await tx.courseAssignemntQuestion.findUnique({
            where: { id: submission.questionId },
            include: {
              assignment: true,
            },
          });

          if (!dbQuestion) throw new Error("question not found");

          // evaluation logic
          const correctAnswers = dbQuestion.correctAnswer.sort();
          const submittedAnswers = submission.answer.sort();

          const isCorrect =
            correctAnswers.length === submittedAnswers.length &&
            correctAnswers.every((ans, idx) => ans === submittedAnswers[idx]);

          const marksObtained = isCorrect
            ? Number(dbQuestion.assignment.marksPerQuestion)
            : 0;

          const createdSubmission = await tx.courseAssignemntSubmission.create({
            data: {
              questionId: dbQuestion.id,
              studentId: dbStudent.id,
              answer: submission.answer,
              isCorrect,
              marksObtained,
            },
          });

          createdSubmissions.push(createdSubmission);
        }
      });

      return res
        .status(200)
        .json(apiResponse(200, "assignment submitted", createdSubmissions));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
}

export default new CourseGradeController();
