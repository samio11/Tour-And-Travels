import { Router } from "express";
import { userRouter } from "../modules/user/user.route";

const router = Router();
const moduleRoutes = [
  {
    path: "/user",
    element: userRouter,
  },
];

moduleRoutes.forEach((x) => router.use(x.path, x.element));

export default router;
