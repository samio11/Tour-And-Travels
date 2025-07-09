import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";

export const notFound = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API not Found",
    totalError: null,
  });
};
