import type { NextFunction, Request, Response } from "express";

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //@ts-ignore
  req["user"] = { id: "6953fe21886add45ec3e62da" };
  next();
};
