import { ERole, IAuthProvider, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcrypt";
export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: process.env.SUPER_ADMIN_EMAIL,
    });
    if (isSuperAdminExist) {
      console.log(`Super Admin Exists`);
      return;
    }
    console.log(`Trying to create Super Admin`);
    const hashedPassword = await bcrypt.hash(
      process.env.SUPER_ADMIN_PASSWORD as string,
      Number(process.env.BCRYPT_SALT)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: process.env.SUPER_ADMIN_EMAIL as string,
    };
    const payload: IUser = {
      name: "Samio Hasan",
      email: process.env.SUPER_ADMIN_EMAIL as string,
      role: ERole.SUPER_ADMIN,
      password: hashedPassword,
      auths: [authProvider],
      isVerified: true,
    };
    const superAdmin = await User.create(payload);
    console.log("Super Admin Created", superAdmin);
  } catch (error) {
    console.log(error);
  }
};
