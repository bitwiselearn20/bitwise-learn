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

      const dataObject = {
        institutions: 0,
        vendors: 0,
        admins: 0,
        batches: 0,
      };

      dataObject["institutions"] = await prismaClient.institution.count();
      dataObject["batches"] = await prismaClient.batch.count();
      dataObject["admins"] = await prismaClient.user.count();
      dataObject["vendors"] = await prismaClient.vendor.count();

      return res.status(200).json(apiResponse(200, "data fetched", dataObject));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
}
export default new SuperAdminController();
