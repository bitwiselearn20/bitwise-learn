// import type { Request, Response, NextFunction } from "express";
// import { verifyAccessToken } from "../utils/jwt";
// import apiResponse from "../utils/apiResponse";

// export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const authHeader = req.headers.authorization;
//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             throw new Error("authorization token missing");
//         }
//         const token = authHeader.split(" ")[1] as string;
//         const decoded = verifyAccessToken(token);
//         req.user = {
//             id: decoded.id,
//             type: decoded.type,
//         }
//         next();
//     } catch (error: any) {
//         return res.status(401).json(apiResponse(401, error.message, null));
//     }
// }

import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import apiResponse from "../utils/apiResponse";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    /**
     * 🔧 TEMP DEV BYPASS (REMOVE LATER)
     */
    if (process.env.AUTH_BYPASS === "true") {
      req.user = {
        id: "6953fe21886add45ec3e62da", // SUPERADMIN ID
        type: "SUPERADMIN",
      };
      return next();
    }

    /**
     * 🔐 NORMAL JWT FLOW
     */
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("authorization token missing");
    }

    const token = authHeader.split(" ")[1] as string;
    const decoded = verifyAccessToken(token);

    req.user = {
      id: decoded.id,
      type: decoded.type,
    };

    next();
  } catch (error: any) {
    return res.status(401).json(apiResponse(401, error.message, null));
  }
};
