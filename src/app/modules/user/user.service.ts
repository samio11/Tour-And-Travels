import AppError from "../../errorHelpers/AppError";
import { ERole, IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...res } = payload;
  const existUser = await User.findOne({ email });
  if (existUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is Already Exists");
  }

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const hashedPass = await bcrypt.hash(
    password as string,
    Number(process.env.BCRYPT_SALT)
  );

  const result = await User.create({
    email,
    auths: [authProvider],
    password: hashedPass,
    ...res,
  });
  return result;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const checkExistUser = await User.findById(userId);
  if (!checkExistUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is Not Exist");
  }
  // Email cant change
  // Name,password,phone,address update
  // ADMIN/SUPER_ADMIN -> Role,IsDeleted (change)
  // Password => ReHashing

  if (payload.role) {
    if (decodedToken.role === ERole.USER || decodedToken.role === ERole.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You Cant Change Role");
    }
    if (
      payload.role === ERole.SUPER_ADMIN &&
      decodedToken.role === ERole.ADMIN
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "You Cant Change Role");
    }
  }
  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === ERole.USER || decodedToken.role === ERole.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You Cant Change This");
    }
  }
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(process.env.BCRYPT_SALT)
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return newUpdatedUser;
};

const getAllUser = async () => {
  const result = await User.find();
  const totalUser = await User.countDocuments();
  return {
    totalData: result,
    meta: {
      total: totalUser,
    },
  };
};

export const userServices = { createUser, getAllUser, updateUser };
