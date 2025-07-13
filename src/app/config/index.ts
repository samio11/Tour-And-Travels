import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  database: process.env.DATABASE,
  NODE_ENV: process.env.NODE_ENV,
  JWT_TOKEN: process.env.JWT_TOKEN,
  JWT_EXPIRES: process.env.JWT_EXPIRES,
  BCRYPT_SALT: process.env.BCRYPT_SALT,
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
  JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN,
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
};
