import type { Request, Response } from "express";
import prismaClient from "../utils/prisma";
import apiResponse from "../utils/apiResponse";
import { comparePassword, hashPassword } from "../utils/password";
import { generateFreshTokens, verifyRefreshToken } from "../utils/jwt";
import type { JwtPayload } from "../utils/type";
import {
  handleSendMail,
  handleSendOTPMail,
  handleVerifyOTP,
} from "../utils/nodemailer/mailHandler";
import { generateResetToken, verifyResetToken } from "../utils/resetToken";

class AuthController {
  async sendVerificationOTP(req: Request, res: Response) {
    try {
      /**
       * req.params = email
       */
      if (!req.user) throw new Error("User not authenticated");

      const { email } = req.body;
      let dbUser;
      if (req.user.type === "ADMIN" || req.user.type === "SUPERADMIN") {
        dbUser = await prismaClient.user.findFirst({ where: { email: email } });
      } else if (req.user.type === "STUDENT") {
        dbUser = await prismaClient.student.findFirst({
          where: { email: email },
        });
      } else if (req.user.type === "VENDOR") {
        dbUser = await prismaClient.vendor.findFirst({
          where: { email: email },
        });
      } else if (req.user.type === "TEACHER") {
        dbUser = await prismaClient.teacher.findFirst({
          where: { email: email },
        });
      } else {
        dbUser = await prismaClient.institution.findFirst({
          where: { email: email },
        });
      }
      if (!dbUser) throw new Error("no such user found!");

      console.log(email);
      const sentOtp = await handleSendOTPMail(email, "email-otp-verification");
      if (sentOtp === false) throw new Error("OTP could not be sent");
      res.status(200).json(apiResponse(200, "OTP sent successfully", null));
    } catch (error: any) {
      console.log(error);
      res.status(500).json(apiResponse(500, error.message, error));
    }
  }
  // match the expected OTP
  async matchVerificationOTP(req: Request, res: Response) {
    try {
      /**
       * req.params = email
       */

      const { email, otp } = req.body;
      if (!req.user) throw new Error("User not authenticated");

      let dbUser;
      if (req.user.type === "ADMIN" || req.user.type === "SUPERADMIN") {
        dbUser = await prismaClient.user.findFirst({ where: { email: email } });
        if (!dbUser) throw new Error("no such user found!");
      } else if (req.user.type === "STUDENT") {
        dbUser = await prismaClient.student.findFirst({
          where: { email: email },
        });
        if (!dbUser) throw new Error("no such user found!");
      } else if (req.user.type === "VENDOR") {
        dbUser = await prismaClient.vendor.findFirst({
          where: { email: email },
        });
        if (!dbUser) throw new Error("no such user found!");
      } else if (req.user.type === "TEACHER") {
        dbUser = await prismaClient.teacher.findFirst({
          where: { email: email },
        });
        if (!dbUser) throw new Error("no such user found!");
      }

      const isCorrect = handleVerifyOTP(email, otp);

      if (!isCorrect) throw new Error("otp is not verified");
      res.status(200).json(apiResponse(200, "OTP verified sucessfully", null));
    } catch (error: any) {
      console.log(error);
      res.status(500).json(apiResponse(500, error.message, error));
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { newPassword } = req.body;
      const resetToken = req.cookies.reset_token;

      if (!resetToken) {
        return res
          .status(401)
          .json(apiResponse(401, "Reset token missing or expired", null));
      }
      if (!newPassword) {
        return res
          .status(400)
          .json(apiResponse(400, "new password is required", null));
      }

      // 🔐 Verify reset token
      const payload = verifyResetToken(resetToken);

      if (payload.purpose !== "PASSWORD_RESET") {
        return res
          .status(401)
          .json(apiResponse(401, "Invalid reset token", null));
      }

      const email = payload.email;

      // 🔍 find user in all tables
      let userType:
        | "ADMIN"
        | "STUDENT"
        | "VENDOR"
        | "TEACHER"
        | "INSTITUTION"
        | null = null;
      let dbUser: any = null;

      dbUser = await prismaClient.user.findFirst({ where: { email } });
      if (dbUser) userType = "ADMIN";

      if (!dbUser) {
        dbUser = await prismaClient.student.findFirst({ where: { email } });
        if (dbUser) userType = "STUDENT";
      }

      if (!dbUser) {
        dbUser = await prismaClient.vendor.findFirst({ where: { email } });
        if (dbUser) userType = "VENDOR";
      }

      if (!dbUser) {
        dbUser = await prismaClient.teacher.findFirst({ where: { email } });
        if (dbUser) userType = "TEACHER";
      }

      if (!dbUser) {
        dbUser = await prismaClient.institution.findFirst({ where: { email } });
        if (dbUser) userType = "INSTITUTION";
      }

      if (!dbUser || !userType) {
        return res.status(404).json(apiResponse(404, "User not found", null));
      }

      // 🔐 Hash new password
      const hashed = await hashPassword(newPassword);

      // 🔄 Update password
      if (userType === "ADMIN") {
        await prismaClient.user.update({
          where: { id: dbUser.id },
          data: { password: hashed },
        });
      } else if (userType === "STUDENT") {
        await prismaClient.student.update({
          where: { id: dbUser.id },
          data: { loginPassword: hashed },
        });
      } else if (userType === "VENDOR") {
        await prismaClient.vendor.update({
          where: { id: dbUser.id },
          data: { loginPassword: hashed },
        });
      } else if (userType === "TEACHER") {
        await prismaClient.teacher.update({
          where: { id: dbUser.id },
          data: { loginPassword: hashed },
        });
      } else {
        await prismaClient.institution.update({
          where: { id: dbUser.id },
          data: { loginPassword: hashed },
        });
      }

      const tokens = generateFreshTokens({
        id: dbUser.id,
        type: userType,
      });
      res.clearCookie("reset_token");

      return res
        .status(200)
        .json(apiResponse(200, "Password reset successfully", { tokens }));
    } catch (error: any) {
      console.error(error);
      return res.status(500).json(apiResponse(500, error.message, null));
    }
  }

  // ADMIN / SUPERADMIN LOGIN
  async adminLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        throw new Error("email and password are required");

      const admin = await prismaClient.user.findFirst({
        where: { email },
      });
      console.log(admin);
      if (!admin) throw new Error("invalid credentials");
      console.log("password is ", password);
      console.log("your password is ", admin.password);
      console.log("hash password is ", await hashPassword(password));

      const isValid = await comparePassword(password, admin.password);
      if (!isValid) throw new Error("invalid credentials");

      const tokens = generateFreshTokens({
        id: admin.id,
        type: admin.ROLE as JwtPayload["type"],
      });

      const dbAdmin = await prismaClient.user.findUnique({
        where: { id: admin.id },
        select: {
          id: true,
          name: true,
          email: true,
          ROLE: true,
          password: false,
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "login successful", { tokens, data: dbAdmin }));
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

      const dbInstitute = await prismaClient.institution.findUnique({
        where: { id: institution.id },
        select: {
          email: true,
          id: true,
          name: true,
          address: true,
          pinCode: true,
          tagline: true,
          websiteLink: true,
          phoneNumber: true,
        },
      });
      return res
        .status(200)
        .json(
          apiResponse(200, "login successful", { data: dbInstitute, tokens }),
        );
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

      const dbVendor = await prismaClient.vendor.findUnique({
        where: { id: vendor.id },
        select: {
          email: true,
          id: true,
          name: true,
          tagline: true,
          websiteLink: true,
          phoneNumber: true,
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "login successful", { data: dbVendor, tokens }));
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

      const dbTeacher = await prismaClient.teacher.findUnique({
        where: { id: teacher.id },
        select: {
          name: true,
          email: true,
          phoneNumber: true,
          loginPassword: false,
          institution: {
            select: {
              id: true,
              name: true,
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
      return res
        .status(200)
        .json(
          apiResponse(200, "login successful", { data: dbTeacher, tokens }),
        );
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
              id: true,
              batchname: true,
              branch: true,
              batchEndYear: true,
            },
          },
          insitution: {
            select: {
              id: true,
              name: true,
              tagline: true,
              websiteLink: true,
            },
          },
        },
      });

      return res.status(200).json(
        apiResponse(200, "login successful", {
          tokens: tokens,
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

  async forgotPassword(req: Request, res: Response) {
    try {
      /**
       * req.body = {email}
       */
      const { email } = req.body;

      if (!email) {
        return res
          .status(400)
          .json(apiResponse(400, "Email is required", null));
      }

      // Check user in all tables
      let dbUser;
      dbUser = await prismaClient.user.findFirst({ where: { email } });

      if (!dbUser) {
        dbUser = await prismaClient.student.findFirst({ where: { email } });
      }
      if (!dbUser) {
        dbUser = await prismaClient.vendor.findFirst({ where: { email } });
      }
      if (!dbUser) {
        dbUser = await prismaClient.teacher.findFirst({ where: { email } });
      }
      if (!dbUser) {
        dbUser = await prismaClient.institution.findFirst({ where: { email } });
      }

      if (!dbUser) {
        return res.status(404).json(apiResponse(404, "User not found", null));
      }

      // Send password reset OTP
      const sentOtp = await handleSendOTPMail(email, "reset-password");
      if (sentOtp === false) throw new Error("OTP could not be sent");

      return res
        .status(200)
        .json(apiResponse(200, "Password reset OTP sent to your email", null));
    } catch (error: any) {
      res.status(500).json(apiResponse(500, error.message, error));
    }
  }
  // verify the forgot password OTP
  async verifyForgotPassword(req: Request, res: Response) {
    try {
      /**
       * req.body = {email, otp}
       */
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res
          .status(400)
          .json(apiResponse(400, "Email and OTP are required", null));
      }

      // Check user in all tables
      let dbUser;
      dbUser = await prismaClient.user.findFirst({ where: { email } });

      if (!dbUser) {
        dbUser = await prismaClient.student.findFirst({ where: { email } });
      }
      if (!dbUser) {
        dbUser = await prismaClient.vendor.findFirst({ where: { email } });
      }
      if (!dbUser) {
        dbUser = await prismaClient.teacher.findFirst({ where: { email } });
      }
      if (!dbUser) {
        dbUser = await prismaClient.institution.findFirst({ where: { email } });
      }

      if (!dbUser) {
        return res.status(404).json(apiResponse(404, "User not found", null));
      }

      // Verify OTP
      const verifiedOtp = handleVerifyOTP(email, otp);
      if (!verifiedOtp) {
        return res
          .status(401)
          .json(apiResponse(401, "OTP is not verified", null));
      }

      const resetToken = generateResetToken(email);

      return res
        .status(200)
        .json(
          apiResponse(200, "Forgot password OTP verified successfully", {
            resetToken,
          }),
        );
    } catch (error: any) {
      res.status(500).json(apiResponse(500, error.message, error));
    }
  }
}

export default new AuthController();
