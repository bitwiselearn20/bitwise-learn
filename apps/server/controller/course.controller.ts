import type { Request, Response } from "express";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
import type { CourseBody, UpdateCourse } from "../utils/type";
import cloudinaryService from "../service/cloudinary.service";

/**
 * this module is reponsible for creating courses and course sections
 */
class CoursesController {
  async createCourse(req: Request, res: Response) {
    try {
      const data: CourseBody = req.body;
      if (!data) throw new Error("please provide all required field");

      if (!req.user) throw new Error("user is not authenticated");
      const userId = req.user.id;

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such admin found!");

      const dbCourse = await prismaClient.course.findFirst({
        where: {
          name: data.name,
        },
      });

      if (dbCourse) throw new Error("course with this name exists");

      const createdCourse = await prismaClient.course.create({
        data: {
          name: data.name,
          description: data.description,
          level: data.level || "BASIC",
          duration: data.duration,
          instructorName: data.instructorName,
          createdBy: dbAdmin.id,
        },
      });

      if (!createdCourse) throw new Error("error in creating courses");

      return res
        .status(200)
        .json(apiResponse(200, "course created", createdCourse));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async uploadThumbnail(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;
      const courseId = req.params.id;
      if (!req.file) throw new Error("thumbnail is required!");
      if (!userId) throw new Error("userId is required");
      if (!courseId) throw new Error("courseId is required");

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such user found!");

      const dbCourse = await prismaClient.course.findFirst({
        where: { id: courseId as string },
      });

      if (!dbCourse) throw new Error("no courseId found!");

      const uniqueFilename = `${req.file.originalname}_thumbnail_${Date.now()}`;

      const fileLink = await cloudinaryService.uploadFile(
        req.file,
        "thumbnail",
        uniqueFilename,
      );
      if (!fileLink) throw new Error("file upload failed");

      const updatedCourse = await prismaClient.course.update({
        where: {
          id: dbCourse.id,
        },
        data: {
          thumbnail: fileLink,
        },
      });

      if (!updatedCourse) throw new Error("course couldn't be created");

      return res
        .status(200)
        .json(apiResponse(200, "course thumbnail added", updatedCourse));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async uploadCompletionCertificate(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;
      const courseId = req.params.id;
      if (!req.file) throw new Error("certificate is required!");
      if (!userId) throw new Error("userId is required");
      if (!courseId) throw new Error("courseId is required");

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such user found!");

      const dbCourse = await prismaClient.course.findFirst({
        where: { id: courseId as string },
      });

      if (!dbCourse) throw new Error("no courseId found!");

      const uniqueFilename = `${req.file.originalname}_certificate_${Date.now()}`;

      const fileLink = await cloudinaryService.uploadFile(
        req.file,
        "certificate",
        uniqueFilename,
      );
      if (!fileLink) throw new Error("file upload failed");

      const updatedCourse = await prismaClient.course.update({
        where: {
          id: dbCourse.id,
        },
        data: {
          certificate: fileLink,
        },
      });

      if (!updatedCourse) throw new Error("course couldn't be created");

      return res
        .status(200)
        .json(apiResponse(200, "course certificate added", updatedCourse));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async changePublishStatus(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;
      const courseId = req.params.id;

      if (!userId) throw new Error("userId is required");
      if (!courseId) throw new Error("courseId is required");

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such user found!");

      const dbCourse = await prismaClient.course.findFirst({
        where: { id: courseId as string },
      });

      if (!dbCourse) throw new Error("no courseId found!");

      const updatedCourse = await prismaClient.course.update({
        where: {
          id: dbCourse.id,
        },
        data: {
          isPublished:
            dbCourse.isPublished === "PUBLISHED"
              ? "NOT_PUBLISHED"
              : "PUBLISHED",
        },
      });

      if (!updatedCourse) throw new Error("couldnot update course");

      return res
        .status(200)
        .json(apiResponse(200, "course updated successfully", updatedCourse));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async updateCourse(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;
      const courseId = req.params.id;

      if (!userId) throw new Error("userId is required");
      if (!courseId) throw new Error("courseId is required");

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such user found!");

      const dbCourse = await prismaClient.course.findFirst({
        where: { id: courseId as string },
      });

      if (!dbCourse) throw new Error("no courseId found!");

      const data: UpdateCourse = req.body;

      const updatedCourse = await prismaClient.course.update({
        where: {
          id: dbCourse.id,
        },
        data: {
          description: data.description ?? dbCourse.description,
          duration: data.duration ?? dbCourse.duration,
          instructorName: data.instructorName ?? dbCourse.instructorName,
          level: data.level ?? dbCourse.level,
        },
      });

      if (!updatedCourse) throw new Error("course could not be updated");

      return res
        .status(200)
        .json(apiResponse(200, "course updated successfully", updatedCourse));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getAllCoursesByAdmin(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;

      if (!userId) throw new Error("userId is required");

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such user found!");

      const courses = await prismaClient.course.findMany({
        where: { createdBy: dbAdmin.id },
      });

      return res
        .status(200)
        .json(apiResponse(200, "data fetched successfully", courses));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getCourseById(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;
      const courseId = req.params.id;
      if (!userId) throw new Error("userId is required");
      if (!courseId) throw new Error("courseId is required");
      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such user found!");
      const dbCourse = await prismaClient.course.findUnique({
        where: { id: courseId as string },
      });

      if (!dbCourse) throw new Error("no course found!");

      const courses = await prismaClient.course.findUnique({
        where: { id: dbCourse.id },
        include: {
          courseSections: {
            include: {
              courseAssignemnts: true,
              courseLearningContents: true,
            },
          },
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "data fetched successfully", courses));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async removeCourse(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;
      const courseId = req.params.id;

      if (!userId) throw new Error("userId is required");
      if (!courseId) throw new Error("courseId is required");

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such user found!");

      const dbCourse = await prismaClient.course.findFirst({
        where: { id: courseId as string },
      });

      if (!dbCourse) throw new Error("no courseId found!");

      const deletedCourse = await prismaClient.course.delete({
        where: {
          id: dbCourse.id,
        },
      });

      if (!deletedCourse) throw new Error("error in deleting course");

      return res
        .status(200)
        .json(apiResponse(200, "course has been removed", deletedCourse));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }

  async addCourseSection(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;
      const courseId = req.params.id;
      const { name } = req.body;

      if (!userId) throw new Error("userId is required");
      if (!courseId) throw new Error("courseId is required");
      if (!name) throw new Error(" a course section must have a name");
      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such user found!");

      const dbCourse = await prismaClient.course.findFirst({
        where: { id: courseId as string },
      });

      if (!dbCourse) throw new Error("no course found!");

      const createdCourseSection = await prismaClient.courseSections.create({
        data: {
          name,
          creatorId: dbAdmin.id,
          courseId: dbCourse.id,
        },
      });

      if (!createdCourseSection) throw new Error("error in creating courses");

      return res
        .status(200)
        .json(
          apiResponse(200, "new section has been added", createdCourseSection),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async updateCourseSection(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;
      const courseSectionId = req.params.id;
      const { name } = req.body;

      if (!userId) throw new Error("userId is required");
      if (!name || name.trim().length === 0)
        throw new Error(" updated course section must have a name");

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such user found!");

      const dbCourseSection = await prismaClient.courseSections.findFirst({
        where: { id: courseSectionId as string },
      });

      if (!dbCourseSection) throw new Error("no such course section found!");

      const updatedCourseSection = await prismaClient.courseSections.update({
        where: { id: dbCourseSection.id },
        data: { name },
      });

      if (!updatedCourseSection) throw new Error("error in creating courses");

      return res
        .status(200)
        .json(
          apiResponse(200, "section has been updated", updatedCourseSection),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async removeCourseSection(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;
      const courseSectionId = req.params.id;

      if (!userId) throw new Error("userId is required");
      if (!courseSectionId) throw new Error("Section ID is Required");

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such user found!");

      const dbCourseSection = await prismaClient.courseSections.findFirst({
        where: { id: courseSectionId as string },
      });

      if (!dbCourseSection) throw new Error("no such course section found!");

      const removedCourseSection = await prismaClient.courseSections.delete({
        where: { id: dbCourseSection.id },
      });

      if (!removedCourseSection) throw new Error("error in deleting section");

      return res
        .status(200)
        .json(
          apiResponse(200, "section has been removed", removedCourseSection),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getAllSectionsByCourse(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;
      const courseId = req.params.id;
      if (!userId) throw new Error("userId is required");
      if (!courseId) throw new Error("courseId is required");

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such user found!");

      const dbCourse = await prismaClient.course.findUnique({
        where: { id: courseId as string },
      });

      if (!dbCourse) throw new Error("no course found!");

      const sections = await prismaClient.courseSections.findMany({
        where: { courseId: dbCourse.id },
        include: {
          courseAssignemnts: true,
          courseLearningContents: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "sections fetched successfully", sections));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getCourseSectionContent(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user not authenticated");
      const userId = req.user.id;
      const sectionId = req.params.id;
      if (!userId) throw new Error("userId is required");
      if (!sectionId) throw new Error("courseId is required");
      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such user found!");
      const dbSection = await prismaClient.courseSections.findUnique({
        where: { id: sectionId as string },
      });

      if (!dbSection) throw new Error("no course found!");

      const courses = await prismaClient.courseLearningContent.findMany({
        where: { sectionId: dbSection.id },
      });

      return res
        .status(200)
        .json(apiResponse(200, "data fetched successfully", courses));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
}

export default new CoursesController();
