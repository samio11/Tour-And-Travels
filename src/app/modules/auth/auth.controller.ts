import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { authServices } from "./auth.service";

const credentialsLogin = catchAsync(async (req, res) => {
  const result = await authServices.credentialsLogin(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login Successful",
    data: result,
  });
});

export const authController = { credentialsLogin };
