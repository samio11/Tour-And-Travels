import express from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodValidationSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "./user.interface";

const router = express.Router();

router.post(
  "/create-user",
  validateRequest(createUserZodValidationSchema),
  userController.createUser
);
router.get(
  "/",
  checkAuth(ERole.ADMIN, ERole.SUPER_ADMIN),
  userController.getAllUser
);
router.patch(
  "/:id",
  checkAuth(...Object.values(ERole)),
  userController.updateUser
);

export const userRouter = router;
