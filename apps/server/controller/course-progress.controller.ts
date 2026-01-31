import type { Request, Response } from "express";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";

class CourseProgressController {
  async markAsDone(req: Request, res: Response) {
    try {
      const studentId = req.user?.id;
      const contentId = req.params.id;

      if (!studentId) throw new Error("studentId is required");
      if (!contentId) throw new Error("courseId is required");

      const dbStudent = await prismaClient.student.findUnique({
        where: { id: studentId },
      });

      if (!dbStudent) throw new Error("student not found ");

      const dbContent = await prismaClient.courseLearningContent.findUnique({
        where: { id: contentId as string },
      });
      if (!dbContent) throw new Error("content couldnot be found");

      const alreadyDone = await prismaClient.courseProgress.findFirst({
        where: {
          studentId,
          contentId: dbContent.id,
        },
      });

      if (alreadyDone)
        return res
          .status(200)
          .json(apiResponse(200, "already completed", null));

      const createdProgress = await prismaClient.courseProgress.create({
        data: {
          contentId: dbContent.id,
          studentId: dbStudent.id,
        },
      });

      if (!createdProgress) throw new Error("error in creating progress");

      return res
        .status(200)
        .json(apiResponse(200, "progress marked", createdProgress));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async unMarksAsDone(req: Request, res: Response) {
    try {
      const studentId = req.user?.id;
      const contentId = req.params.id;

      if (!studentId) throw new Error("studentId is required");
      if (!contentId) throw new Error("courseId is required");

      const dbStudent = await prismaClient.student.findUnique({
        where: { id: studentId },
      });

      if (!dbStudent) throw new Error("student not found ");

      const dbContent = await prismaClient.courseLearningContent.findUnique({
        where: { id: contentId as string },
      });
      if (!dbContent) throw new Error("content couldnot be found");

      const alreadyDone = await prismaClient.courseProgress.findFirst({
        where: {
          studentId,
          contentId: dbContent.id,
        },
      });

      if (!alreadyDone)
        return res
          .status(200)
          .json(apiResponse(200, "portion not completed", null));

      const createdProgress = await prismaClient.courseProgress.delete({
        where: {
          id: alreadyDone.id,
        },
      });

      if (!createdProgress) throw new Error("error in creating progress");

      return res
        .status(200)
        .json(apiResponse(200, "progress un-marked", createdProgress));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async getAllCourseProgress(req: Request, res: Response) {
    try {
      const studentId = req.user?.id;
      if (!studentId) throw new Error("studentId is required");

      const dbStudent = await prismaClient.student.findUnique({
        where: { id: studentId },
      });

      if (!dbStudent) throw new Error("no such user found");

      const insitutionId = dbStudent.instituteId;

      const dbCourses = await prismaClient.courseEnrollment.findMany({
        where: { institutionId: insitutionId },
        select: { courseId: true },
      });

      const coursesWithProgress = await prismaClient.course.findMany({
        where: {
          id: { in: dbCourses.map((c) => c.courseId) },
        },
        select: {
          id: true,
          name: true,
          courseSections: {
            select: {
              courseLearningContents: {
                select: {
                  id: true,
                  courseProgresses: {
                    where: { studentId },
                    select: { id: true },
                  },
                },
              },
            },
          },
        },
      });

      const courseProgress = coursesWithProgress.map((course) => {
        let totalContents = 0;
        let completedContents = 0;

        course.courseSections.forEach((section) => {
          section.courseLearningContents.forEach((content) => {
            totalContents++;
            if (content.courseProgresses.length > 0) {
              completedContents++;
            }
          });
        });

        return {
          courseId: course.id,
          name: course.name,
          overallProgress:
            totalContents === 0 ? 0 : completedContents / totalContents,
        };
      });

      return res
        .status(200)
        .json(apiResponse(200, "course info fetched", courseProgress));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
  async getCourseProgressById(req: Request, res: Response) {
    try {
      const studentId = req.user?.id;
      const courseId = req.params.id;

      if (!studentId) throw new Error("studentId is required");
      if (!courseId) throw new Error("no courseId Found");

      const dbStudent = await prismaClient.student.findUnique({
        where: { id: studentId },
      });

      if (!dbStudent) throw new Error("student not found ");

      const dbCourse = await prismaClient.course.findUnique({
        where: { id: courseId as string },
      });
      if (!dbCourse) throw new Error("db course not found");

      const course = await prismaClient.course.findUnique({
        where: { id: dbCourse.id },
        select: {
          courseSections: {
            select: {
              id: true,
              courseLearningContents: {
                select: {
                  id: true,
                  courseProgresses: {
                    where: { studentId: dbStudent.id },
                    select: { id: true },
                  },
                },
              },
            },
          },
        },
      });

      if (!course) throw new Error("no course found");

      // get % per course
      let totalSections = 0;
      let completedSections = 0;
      const completedContentIds: string[] = [];
      course.courseSections.forEach((section) => {
        section.courseLearningContents.forEach((content) => {
          if (content.courseProgresses.length > 0) {
            completedContentIds.push(content.id);
            completedSections++;
          }
          totalSections++;
        });
      });

      const overAllCompletionStatus = completedSections / totalSections;

      return res.status(200).json(
        apiResponse(200, "course info fetched", {
          overallProgress: completedSections / totalSections,
          completedContentIds,
        }),
      );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(200, error.message, null));
    }
  }
}
export default new CourseProgressController();
