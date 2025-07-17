import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { authServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { createUserToken } from "../../utils/userToken";
import config from "../../config";
import passport from "passport";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await AuthServices.credentialsLogin(req.body)

    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        // ❌❌❌❌❌
        // throw new AppError(401, "Some error")
        // next(err)
        // return new AppError(401, err)

        // ✅✅✅✅
        // return next(err)
        // console.log("from err");
        return next(new AppError(401, err));
      }

      if (!user) {
        // console.log("from !user");
        // return new AppError(401, info.message)
        return next(new AppError(401, info.message));
      }

      const userTokens = await createUserToken(user);

      // delete user.toObject().password

      const { password: pass, ...rest } = user.toObject();

      setAuthCookie(res, userTokens);

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);

    // res.cookie("accessToken", loginInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // })

    // res.cookie("refreshToken", loginInfo.refreshToken, {
    //     httpOnly: true,
    //     secure: false,
    // })
  }
);
const getAccessToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Refresh Token,Please Login");
  }
  const result = await authServices.getAccessToken(refreshToken);

  // res.cookie("accessToken", result.accessToken, {
  //   httpOnly: true,
  //   secure: false,
  // });

  setAuthCookie(res, result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Refresh Token Getting Successful",
    data: result,
  });
});

const loggedOut = catchAsync(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Logged Out Successfully",
    data: null,
  });
});
const resetPassword = catchAsync(async (req, res) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const decodedToken = req.user;
  console.log(decodedToken);
  const result = await authServices.resetPassword(
    oldPassword,
    newPassword,
    decodedToken as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Password Changed Successfully",
    data: null,
  });
});

const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    // /booking => booking , => "/" => ""
    const user = req.user;

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }

    const tokenInfo = createUserToken(user);

    setAuthCookie(res, tokenInfo);

    // sendResponse(res, {
    //     success: true,
    //     statusCode: httpStatus.OK,
    //     message: "Password Changed Successfully",
    //     data: null,
    // })

    res.redirect(`${config.FRONTEND_URL}/${redirectTo}`);
  }
);

export const authController = {
  credentialsLogin,
  getAccessToken,
  loggedOut,
  resetPassword,
  googleCallbackController,
};
