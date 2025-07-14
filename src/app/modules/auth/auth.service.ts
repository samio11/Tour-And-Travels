import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateToken, verifyToken } from "../../utils/jwt";
import {
  createAccessTokenWithRefreshToken,
  createUserToken,
} from "../../utils/userToken";
import config from "../../config";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const existUser = await User.findOne({ email });
  if (!existUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not Exists");
  }
  const matchedPassword = await bcrypt.compare(
    password as string,
    existUser.password as string
  );
  if (!matchedPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password not matched! try again"
    );
  }
  const userToken = createUserToken(existUser);
  const { password: pass, ...rest } = existUser.toObject();
  return {
    user: rest,
    accessToken: userToken?.accessToken,
    refreshToken: userToken?.refreshToken,
  };
};

const getAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createAccessTokenWithRefreshToken(refreshToken);

  return {
    accessToken: newAccessToken,
  };
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);
  const isOldPasswordMatch = await bcrypt.compare(
    oldPassword,
    user?.password as string
  );
  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Password id not matched");
  }
  user!.password = await bcrypt.hash(newPassword, Number(config.BCRYPT_SALT));
  // Password Update
  user?.save();
};

export const authServices = { credentialsLogin, getAccessToken, resetPassword };
