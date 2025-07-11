import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { userServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(async (req, res) => {
  const result = await userServices.createUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User Created Done",
    data: result,
  });
});
const updateUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const token = req.headers.authorization;
  const verifiedToken = verifyToken(
    token as string,
    process.env.JWT_TOKEN as string
  ) as JwtPayload;
  const payload = req.body;
  const result = await userServices.updateUser(userId, payload, verifiedToken);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User Updated Done",
    data: result,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const result = await userServices.getAllUser();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Getting Data",
    data: result.totalData,
    meta: result.meta,
  });
});

export const userController = { createUser, getAllUser, updateUser };
