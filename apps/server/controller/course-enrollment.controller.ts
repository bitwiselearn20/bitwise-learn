import type { Request, Response } from "express";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";

class CourseEnrollment {
  async getAllEnrollmentsById(req: Request, res: Response) {
    try {
      const courseId = req.params.id;
      const dbCourse = await prismaClient.course.findUnique({
        where: { id: courseId as string },
      });

      if (!dbCourse) throw new Error("course not found");

      const getEnrollment = await prismaClient.courseEnrollment.findMany({
        where: { courseId: dbCourse.id },
        select: {
          institution: {
            select: {
              name: true,
              id: true,
            },
          },
          batch: {
            select: {
              id: true,
              batchname: true,
              branch: true,
            },
          },
        },
      });

      return res.status(200).json(
        apiResponse(200, "fetched enrollments", {
          course: dbCourse,
          data: getEnrollment,
        }),
      );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getAllEnrollmentsByBatch(req: Request, res: Response) {
    try {
      const batchId = req.params.id;
      const dbBatch = await prismaClient.batch.findUnique({
        where: { id: batchId as string },
      });

      if (!dbBatch) throw new Error("course not found");

      const getEnrollment = await prismaClient.courseEnrollment.findMany({
        where: { batchId: dbBatch.id },
        select: {
          course: true,
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "fetched enrollments", getEnrollment));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async addEnrollment(req: Request, res: Response) {
    try {
      const courseId = req.body.courses;
      const batchId = req.body.batchId;

      console.log(req.body);
      if (!courseId) throw new Error("course id is required");
      if (!batchId) throw new Error("institute id is required");

      const dbCourse = await prismaClient.course.findUnique({
        where: { id: courseId as string },
      });

      if (!dbCourse) throw new Error("course not found");

      const dbBatch = await prismaClient.batch.findUnique({
        where: { id: batchId as string },
      });

      if (!dbBatch) throw new Error("batch not found");

      const dbInstitute = await prismaClient.institution.findUnique({
        where: { id: dbBatch.institutionId },
      });

      if (!dbInstitute) throw new Error("institute not found");

      const getEnrollment = await prismaClient.courseEnrollment.findFirst({
        where: {
          courseId: dbCourse.id,
          batchId: dbBatch.id,
        },
      });

      if (getEnrollment) throw new Error("institute is already enrolled");

      const createEnrollment = await prismaClient.courseEnrollment.create({
        data: {
          courseId: dbCourse.id,
          institutionId: dbInstitute.id,
          batchId: dbBatch.id,
        },
      });

      return res
        .status(200)
        .json(apiResponse(500, "enrollment created", createEnrollment));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async removeEnrollment(req: Request, res: Response) {
    try {
      const enrollmentId = req.params.id;
      const userId = req.user?.id;

      if (!enrollmentId) throw new Error("enrollmentId is required");
      if (!userId) throw new Error("userId is required");

      const dbEnrollement = await prismaClient.courseEnrollment.findUnique({
        where: {
          id: enrollmentId as string,
        },
      });

      if (!dbEnrollement) throw new Error("dbEnrollement doesn't exist");

      const removedEnrollment = await prismaClient.courseEnrollment.delete({
        where: {
          id: dbEnrollement.id,
        },
      });

      return res
        .status(200)
        .json(apiResponse(500, "enrollment removed", removedEnrollment));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
}
export default new CourseEnrollment();
