import z from "zod";
import { EIsActive, ERole } from "./user.interface";

export const createUserZodValidationSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name Must be String" })
    .min(2, { message: "Name Cant be less than 2 character" }),
  email: z.string().email(),
  password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/, {
    message: "Password must contain at least one letter and one number",
  }),
  phone: z
    .string()
    .regex(/^\+8801[3-9]\d{8}$/, {
      message: "Phone number must start with +880 and be valid",
    })
    .optional(),
  address: z.string().optional(),
});
export const updateUserZodValidationSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name Must be String" })
    .min(2, { message: "Name Cant be less than 2 character" })
    .optional(),
  password: z
    .string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/, {
      message: "Password must contain at least one letter and one number",
    })
    .optional(),
  phone: z
    .string()
    .regex(/^\+8801[3-9]\d{8}$/, {
      message: "Phone number must start with +880 and be valid",
    })
    .optional(),
  address: z
    .string({ invalid_type_error: "Address must be in string" })
    .optional(),
  role: z.enum(Object.values(ERole) as [string]).optional(),
  isDeleted: z.boolean().optional(),
  isActive: z.enum(Object.values(EIsActive) as [string]).optional(),
  isVerified: z.boolean().optional(),
});
