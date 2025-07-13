import express from "express";
import { authController } from "./auth.controller";

const router = express.Router();

router.post("/login", authController.credentialsLogin);
router.post("/refresh-token", authController.getAccessToken);

export const authRouter = router;
