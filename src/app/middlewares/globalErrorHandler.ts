import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import config from "../config";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Opps! Something Went wrong";
  if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err?.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    totalError: err,
    stack: config.NODE_ENV === "development" ? err.stack : null,
  });
};
