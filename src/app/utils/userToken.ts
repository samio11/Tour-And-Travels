import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";

export const createUserToken = (userData: Partial<IUser>) => {
  const jwtPayload = {
    userId: userData?._id,
    email: userData?.email,
    role: userData?.role,
  };
  // const accressToken = jwt.sign(jwtPayload, "Samio11", { expiresIn: "1d" });
  const accressToken = generateToken(
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
    accressToken,
    refreshToken,
  };
};
