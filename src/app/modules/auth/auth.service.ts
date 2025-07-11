import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken } from "../../utils/jwt";

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
  const jwtPayload = {
    userId: existUser?.id,
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
    email: existUser?.email,
    accressToken,
  };
};

export const authServices = { credentialsLogin };
