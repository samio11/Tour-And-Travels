import { Types } from "mongoose";

export enum ERole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
}

export interface IAuthProvider {
  provider: string;
  providerId: string;
}

export enum EIsActive {
  ACTIVE = "ACTIVE",
  IN_ACTIVE = "IN-ACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: ERole;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: boolean;
  isActive?: EIsActive;
  isVerified?: boolean;
  auths: IAuthProvider[];
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
