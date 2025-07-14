import express, { NextFunction, Request, Response } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import passport from "passport";

const router = express.Router();

router.post("/login", authController.credentialsLogin);
router.post("/refresh-token", authController.getAccessToken);
router.post("/logout", authController.loggedOut);
router.post(
  "/reset-password",
  checkAuth(...Object.values(ERole)),
  authController.resetPassword
);

//  /booking -> /login -> succesful google login -> /booking frontend
// /login -> succesful google login -> / frontend
router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);

// api/v1/auth/google/callback?state=/booking
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authController.googleCallbackController
);

export const authRouter = router;
