import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateToken, verifyToken } from "../../utils/jwt";
import { createUserToken } from "../../utils/userToken";
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
    accressToken: userToken?.accressToken,
    refreshToken: userToken?.refreshToken,
  };
};

const getAccessToken = async (refreshToken: string) => {
  const verifiedToken = verifyToken(
    refreshToken,
    config.JWT_REFRESH_TOKEN as string
  ) as JwtPayload;
  const existUser = await User.findOne({ email: verifiedToken?.email });
  if (!existUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not Exist");
  }
  if (
    existUser?.isActive === "IN-ACTIVE" ||
    existUser?.isActive === "BLOCKED"
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, `User is ${existUser.isActive}`);
  }

  if (existUser.isDeleted === true) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted");
  }

  const jwtPayload = {
    userId: existUser?._id,
    email: existUser?.email,
    role: existUser?.role,
  };
  // const accressToken = jwt.sign(jwtPayload, "Samio11", { expiresIn: "1d" });
  const accressToken = generateToken(
    jwtPayload,
    process.env.JWT_TOKEN as string,
    process.env.JWT_EXPIRES as string
  );

  return {
    accressToken,
  };
};

export const authServices = { credentialsLogin, getAccessToken };
