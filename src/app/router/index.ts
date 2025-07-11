import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { authRouter } from "../modules/auth/auth.route";

const router = Router();
const moduleRoutes = [
  {
    path: "/user",
    element: userRouter,
  },
  {
    path: "/auth",
    element: authRouter,
  },
];

moduleRoutes.forEach((x) => router.use(x.path, x.element));

export default router;
