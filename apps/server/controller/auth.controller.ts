import type { Request, Response } from "express";
import prismaClient from "../utils/prisma";
import apiResponse from "../utils/apiResponse";
import { comparePassword } from "../utils/password";
import { generateFreshTokens, verifyRefreshToken } from "../utils/jwt";
import type { JwtPayload } from "../utils/type";

class AuthController {
  // ADMIN / SUPERADMIN LOGIN
  async adminLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        throw new Error("email and password are required");

      const admin = await prismaClient.user.findFirst({
        where: { email },
      });

      if (!admin) throw new Error("invalid credentials");
      console.log("password is ", password);
      console.log("your password is ", admin.password);
      const isValid = await comparePassword(password, admin.password);
      if (!isValid) throw new Error("invalid credentials");

      const tokens = generateFreshTokens({
        id: admin.id,
        type: admin.ROLE as JwtPayload["type"],
      });

      return res.status(200).json(apiResponse(200, "login successful", tokens));
    } catch (error: any) {
      return res.status(401).json(apiResponse(401, error.message, null));
    }
  }

  // INSTITUTION LOGIN
  async institutionLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        throw new Error("email and password are required");

      const institution = await prismaClient.institution.findFirst({
        where: { email },
      });

      if (!institution) throw new Error("invalid credentials");

      const isValid = await comparePassword(
        password,
        institution.loginPassword,
      );
      if (!isValid) throw new Error("invalid credentials");

      const tokens = generateFreshTokens({
        id: institution.id,
        type: "INSTITUTION",
      });

      return res.status(200).json(apiResponse(200, "login successful", tokens));
    } catch (error: any) {
      return res.status(401).json(apiResponse(401, error.message, null));
    }
  }

  //  VENDOR LOGIN
  async vendorLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        throw new Error("email and password are required");

      const vendor = await prismaClient.vendor.findFirst({
        where: { email },
      });

      if (!vendor) throw new Error("invalid credentials");

      const isValid = await comparePassword(password, vendor.loginPassword);
      if (!isValid) throw new Error("invalid credentials");

      const tokens = generateFreshTokens({
        id: vendor.id,
        type: "VENDOR",
      });

      return res.status(200).json(apiResponse(200, "login successful", tokens));
    } catch (error: any) {
      return res.status(401).json(apiResponse(401, error.message, null));
    }
  }

  //  TEACHER LOGIN
  async teacherLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        throw new Error("email and password are required");

      const teacher = await prismaClient.teacher.findFirst({
        where: { email },
      });

      if (!teacher) throw new Error("invalid credentials");

      const isValid = await comparePassword(password, teacher.loginPassword);
      if (!isValid) throw new Error("invalid credentials");

      const tokens = generateFreshTokens({
        id: teacher.id,
        type: "TEACHER",
      });

      return res.status(200).json(apiResponse(200, "login successful", tokens));
    } catch (error: any) {
      return res.status(401).json(apiResponse(401, error.message, null));
    }
  }
  async studentLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        throw new Error("email and password are required");

      const student = await prismaClient.student.findFirst({
        where: { email },
      });

      if (!student) throw new Error("invalid credentials");

      const isValid = await comparePassword(password, student.loginPassword);
      if (!isValid) throw new Error("invalid credentials");

      const tokens = generateFreshTokens({
        id: student.id,
        type: "STUDENT",
      });
      const dbStudent = await prismaClient.student.findUnique({
        where: { id: student.id },
        select: {
          email: true,
          name: true,
          rollNumber: true,
          batch: {
            select: {
              batchname: true,
              branch: true,
              batchEndYear: true,
            },
          },
          insitution: {
            select: {
              name: true,
              tagline: true,
              websiteLink: true,
            },
          },
        },
      });

      return res.status(200).json(
        apiResponse(200, "login successful", {
          tokens: tokens.accessToken,
          data: dbStudent,
        }),
      );
    } catch (error: any) {
      return res.status(401).json(apiResponse(401, error.message, null));
    }
  }
  //  REFRESH TOKEN
  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw new Error("refresh token required");

      const decoded = verifyRefreshToken(refreshToken);

      const newAccessToken = generateFreshTokens({
        id: decoded.id,
        type: decoded.type,
      }).accessToken;

      return res.status(200).json(
        apiResponse(200, "token refreshed", {
          accessToken: newAccessToken,
        }),
      );
    } catch (error: any) {
      return res.status(401).json(apiResponse(401, error.message, null));
    }
  }
}

export default new AuthController();
