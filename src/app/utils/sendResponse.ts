import { Response } from "express";

interface IMeta {
  total: number;
}
interface TSuccessResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T | T[] | null;
  meta?: IMeta;
}

export const sendResponse = <T>(res: Response, data: TSuccessResponse<T>) => {
  res.status(data?.statusCode).json({
    success: true,
    message: data?.message,
    totalData: data?.data,
    meta: data?.meta,
  });
};
