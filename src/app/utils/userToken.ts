import { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";

export const createUserToken = (userData: Partial<IUser>) => {
  const jwtPayload = {
    userId: userData?._id,
    email: userData?.email,
    role: userData?.role,
  };
  // const accressToken = jwt.sign(jwtPayload, "Samio11", { expiresIn: "1d" });
  const accessToken = generateToken(
    jwtPayload,
    process.env.JWT_TOKEN as string,
    process.env.JWT_EXPIRES as string
  );
  const refreshToken = generateToken(
    jwtPayload,
    process.env.JWT_REFRESH_TOKEN as string,
    process.env.JWT_REFRESH_EXPIRES as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
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
  const accessToken = generateToken(
    jwtPayload,
    process.env.JWT_TOKEN as string,
    process.env.JWT_EXPIRES as string
  );

  return accessToken;
};
