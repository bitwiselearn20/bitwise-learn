import type { Request, Response } from "express";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";

class SuperAdminController {
  async getAllInformation(req: Request, res: Response) {
    try {
      const adminId = req.user?.id;
      if (!adminId) throw new Error("unAuthenticated User");

      const dbAdmin = await prismaClient.user.findUnique({
        where: {
          id: adminId,
        },
      });

      if (!dbAdmin) throw new Error("db Admin not found");

      const [
        institutions,
        vendors,
        admins,
        students,
        teachers,
        batches,
        courses,
        assessments,
      ] = await Promise.all([
        prismaClient.institution.count(),
        prismaClient.vendor.count(),
        prismaClient.user.count({where:{ROLE:"ADMIN"}}),
        prismaClient.student.count(),
        prismaClient.teacher.count(),
        prismaClient.batch.count(),
        prismaClient.course.count(),
        prismaClient.assessment.count(),
      ]);

      const institutionHierarchy = await prismaClient.institution.findMany({
        select:{
          id:true,
          name:true,
          batches:{
            select:{
              id:true,
              batchname:true,
              _count:{
                select:{
                  students:true,
                  teachers:true,
                  assessments:true,
                },
              },
            },
          },
          _count:{
            select:{
              students:true,
              teachers:true,
              batches:true,
            },
          },
        },
      });

      return res.status(200).json(
        apiResponse(200, "SuperAdmin DashBoard Data",{
          overview:{
            institutions,
            vendors,
            admins,
            students,
            teachers,
            batches,
            courses,
            assessments,
          },
          institutions:institutionHierarchy,
        })
      );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
}
export default new SuperAdminController();
