import type { Request, Response } from "express";
import cloudinaryService from "../service/cloudinary.service";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
import type { CourseContentBody, updateCourseContent } from "../utils/type";

class CouseContentController {
  async addContentToSection(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      const userId = req.user.id;
      const data: CourseContentBody = req.body;

      // console.log(data);
      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such admin found!");

      const dbSection = await prismaClient.courseSections.findFirst({
        where: { id: data.sectionId },
      });

      if (!dbSection) throw new Error("invalid section id");

      if (!data.videoUrl) throw new Error("videoUrl is required");

      console.log({
        name: data.name,
        description: data.description,
        sectionId: data.sectionId,
        transcript: data.transcript,
        videoUrl: data.videoUrl,
        creatorId: dbAdmin.id,
      });
      const addedContent = await prismaClient.courseLearningContent.create({
        data: {
          name: data.name,
          description: data.description,
          sectionId: data.sectionId,
          transcript: data.transcript,
          videoUrl: data.videoUrl,
          creatorId: dbAdmin.id,
        },
      });

      if (!addedContent) throw new Error("content added to course");

      return res
        .status(200)
        .json(apiResponse(200, "course content added", addedContent));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async updateContentToSection(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      const userId = req.user.id;
      const contentId = req.params.id;
      const data: updateCourseContent = req.body;

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such admin found!");

      const dbContent = await prismaClient.courseLearningContent.findFirst({
        where: { id: contentId },
      });

      if (!dbContent) throw new Error("invalid section id");

      const updatedData = await prismaClient.courseLearningContent.update({
        where: {
          id: dbContent.id,
        },
        data: {
          name: data.name ?? dbContent.name,
          description: data.description ?? dbContent.description,
          transcript: data.transcript ?? dbContent.transcript,
          videoUrl: data.videoUrl ?? dbContent.videoUrl,
        },
      });

      if (!updatedData) throw new Error("content could not be updated");

      return res
        .status(200)
        .json(apiResponse(200, "course content updated", null));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async deleteContentFromSection(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      const userId = req.user.id;
      const contentId = req.params.id;

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such admin found!");

      const dbContent = await prismaClient.courseLearningContent.findFirst({
        where: { id: contentId },
      });

      if (!dbContent) throw new Error("invalid section id");

      const deletedCourse = await prismaClient.courseLearningContent.delete({
        where: { id: dbContent.id },
      });

      if (!deletedCourse) throw new Error("course content couldnot be deleted");

      return res
        .status(200)
        .json(apiResponse(200, "course content deleted", deletedCourse));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async uploadFileToContent(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      const userId = req.user.id;
      const contentId = req.params.id;
      const file = req.file;

      if (!file) throw new Error("file is required for update");

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such admin found!");

      const dbContent = await prismaClient.courseLearningContent.findFirst({
        where: { id: contentId },
      });

      if (!dbContent) throw new Error("invalid section id");

      const uniqueFilename = `${file.originalname}_course_content_${Date.now()}`;

      const fileLink = await cloudinaryService.uploadFile(
        req.file,
        "course_content",
        uniqueFilename,
      );
      if (!fileLink) throw new Error("file upload failed");

      const updatedContentFile =
        await prismaClient.courseLearningContent.update({
          where: {
            id: dbContent.id,
          },
          data: {
            file: fileLink,
          },
        });

      if (!updatedContentFile) throw new Error("failed to upload file");

      return res
        .status(200)
        .json(apiResponse(200, "course file added", updatedContentFile));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async removeFileFromContent(req: Request, res: Response) {
    try {
      if (!req.user) throw new Error("user is not authenticated");
      const userId = req.user.id;
      const contentId = req.params.id;

      const dbAdmin = await prismaClient.user.findFirst({
        where: { id: userId },
      });

      if (!dbAdmin) throw new Error("no such admin found!");

      const dbContent = await prismaClient.courseLearningContent.findFirst({
        where: { id: contentId },
      });

      if (!dbContent) throw new Error("invalid section id");

      const fileLink = await cloudinaryService.deleteFile(dbContent.file!);
      if (!fileLink) throw new Error("file removal failed");

      const updatedContentFile =
        await prismaClient.courseLearningContent.update({
          where: {
            id: dbContent.id,
          },
          data: {
            file: null,
          },
        });

      if (!updatedContentFile) throw new Error("failed to remove file");

      return res
        .status(200)
        .json(apiResponse(200, "course file removed", updatedContentFile));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
}
export default new CouseContentController();
