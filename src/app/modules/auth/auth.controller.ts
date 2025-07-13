import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { authServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";

const credentialsLogin = catchAsync(async (req, res) => {
  const result = await authServices.credentialsLogin(req.body);
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: false,
  });
  res.cookie("accessToken", result.accressToken, {
    httpOnly: true,
    secure: false,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login Successful",
    data: result,
  });
});

const getAccessToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Refresh Token,Please Login");
  }
  const result = await authServices.getAccessToken(refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Refresh Token Getting Successful",
    data: result,
  });
});

export const authController = { credentialsLogin, getAccessToken };
