import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("Unauthorised, Re-login");
    }

    const decoded = verifyAccessToken(token);

    let user;
    if (decoded.type === "ADMIN" || decoded.type === "SUPERADMIN") {
      user = await prismaClient.user.findUnique({
        where: { id: decoded.id },
      });
    } else if (decoded.type === "TEACHER") {
      user = await prismaClient.teacher.findUnique({
        where: { id: decoded.id },
      });
    } else if (decoded.type === "INSTITUTION") {
      user = await prismaClient.institution.findUnique({
        where: { id: decoded.id },
      });
    } else if (decoded.type === "VENDOR") {
      user = await prismaClient.vendor.findUnique({
        where: { id: decoded.id },
      });
    } else if (decoded.type === "STUDENT") {
      user = await prismaClient.student.findUnique({
        where: { id: decoded.id },
      });
    }

    if (!user) {
      return res
        .status(401)
        .json(apiResponse(401, "UNAUTHORIZED ENTITY", null));
    }
    req.user = {
      id: decoded.id,
      type: decoded.type,
    };

    next();
  } catch (error: any) {
    return res.status(401).json(apiResponse(401, error.message, null));
  }
};
