import type { Request, Response } from "express";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";

const MAX_PAGE_ENTRY = 100;
class ReportController {
  async getCountByInstitution(req: Request, res: Response) {
    try {
      /**
       * This controller is going to tell the number of courses that the institution has
       * as well as the number of assessments the institution has provided.
       */
      const institutionId = req.params.id;
      const userId = req.user?.id;

      if (!institutionId) throw new Error("institutionId not found");
      if (!userId) throw new Error("userId not found");
      if (req.user?.type && req.user.type === "STUDENT")
        throw new Error("unAuthorized user");

      const dbInstitution = await prismaClient.institution.findUnique({
        where: {
          id: institutionId as string,
        },
      });

      if (!dbInstitution) throw new Error("no such id found");

      const courseCount = await prismaClient.courseEnrollment.count({
        where: { instituteId: dbInstitution.id },
      });
      const assessmentCount = await prismaClient.assessment.count({
        where: {
          batch: {
            institutionId: dbInstitution.id,
          },
        },
      });

      return res.status(200).json(
        apiResponse(200, "course stats found", {
          courseCount,
          assessmentCount,
        }),
      );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }

  async getCourseReport(req: Request, res: Response) {
    try {
      /**
       * This particular course is going to do a few computational task i.e.
       * it is going to get the course and the institution id and based on that generate a report
       * per student these things will be generated - inside of courses, videos watched and assignments completed
       * and a few matrix for assignments like correct % etc.
       */

      const courseId = req.params.courseId;
      const instituteId = req.params.instituteId;
      const rawPage = Number(req.query.page);
      const pageNumber =
        Number.isInteger(rawPage) && rawPage >= 0 ? rawPage : 0;

      if (!courseId) throw new Error("courseId is required");
      if (!instituteId) throw new Error("instituteID is required");

      const dbCourse = await prismaClient.course.findUnique({
        where: {
          id: courseId as string,
        },
      });

      if (!dbCourse) throw new Error("course not found");
      const dbInstitution = await prismaClient.institution.findUnique({
        where: {
          id: instituteId as string,
        },
      });

      if (!dbInstitution) throw new Error("course not found");

      const isAllocated = await prismaClient.courseEnrollment.findFirst({
        where: {
          courseId: dbCourse.id,
          instituteId: dbInstitution.id,
        },
      });

      if (!isAllocated) throw new Error("un-allocated course");

      const totalCourseTopics = await prismaClient.course.findUnique({
        where: {
          id: dbCourse.id,
        },
        select: {
          courseSections: {
            select: {
              courseLearningContents: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

      const totalTopics = totalCourseTopics?.courseSections.reduce(
        (acc, section) => acc + section.courseLearningContents.length,
        0,
      );

      const studentData = await prismaClient.student.findMany({
        where: {
          instituteId: dbInstitution.id,
        },
        select: {
          id: true,
          name: true,
          rollNumber: true,

          courseProgresses: {
            where: {
              content: {
                section: {
                  courseId: dbCourse.id,
                },
              },
            },
            select: {
              contentId: true,
            },
          },

          courseAssignemntSubmissions: {
            where: {
              question: {
                assignment: {
                  section: {
                    courseId: dbCourse.id,
                  },
                },
              },
            },
            select: {
              isCorrect: true,
              marksObtained: true,
              question: {
                select: {
                  assignmentId: true,
                },
              },
            },
          },
        },
        orderBy: {
          rollNumber: "asc",
        },
        skip: MAX_PAGE_ENTRY * pageNumber,
        take: MAX_PAGE_ENTRY,
      });

      return res.status(200).json(
        apiResponse(200, "course data fetched", {
          data: studentData,
          totalCourseTopics: totalTopics,
        }),
      );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }

  async getAllAssesmentReports(req: Request, res: Response) {
    try {
      /**
       * This particular course is going to do a few computational task i.e.
       * it is going to get the course and the institution id and based on that generate a report
       * per student these things will be generated - inside of courses, videos watched and assignments completed
       * and a few matrix for assignments like correct % etc.
       */

      const assessmentId = req.params.assessmentId;
      const instituteId = req.params.instituteId;
      const rawPage = Number(req.query.page);

      const pageNumber =
        Number.isInteger(rawPage) && rawPage >= 0 ? rawPage : 0;

      if (!assessmentId) throw new Error("courseId is required");
      if (!instituteId) throw new Error("instituteID is required");

      const dbAssessment = await prismaClient.assessment.findUnique({
        where: {
          id: assessmentId as string,
        },
      });

      if (!dbAssessment) throw new Error("Assessment not found");
      const dbInstitution = await prismaClient.institution.findUnique({
        where: {
          id: instituteId as string,
        },
      });

      if (!dbInstitution) throw new Error("course not found");

      const studentAssessments =
        await prismaClient.assessmentSubmission.findMany({
          where: {
            assessmentId: dbAssessment.id,
          },
          select: {
            student: {
              select: {
                name: true,
                batch: true,
                rollNumber: true,
                email: true,
              },
            },
            startedAt: true,
            submittedAt: true,
            totalMarks: true,
            studentIp: true,
            proctoringStatus: true,
          },
          skip: MAX_PAGE_ENTRY * pageNumber,
          take: MAX_PAGE_ENTRY,
        });

      return res.status(200).json(
        apiResponse(200, "course data fetched", {
          data: studentAssessments,
        }),
      );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
}

export default new ReportController();
