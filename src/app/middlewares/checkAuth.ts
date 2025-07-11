import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth =
  (...authRole: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "No Token Given");
      }
      const verifyToken1 = verifyToken(
        accessToken,
        process.env.JWT_TOKEN as string
      ) as JwtPayload;
      if (!authRole.includes(verifyToken1.role)) {
        throw new AppError(403, "You dont have access for this route");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
