import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { name, email } = payload;
  const result = await User.create({ name, email });
  return result;
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

export const userServices = { createUser, getAllUser };
