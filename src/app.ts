import express, { Application, Request, Response } from "express";
import cors from "cors";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import router from "./app/router";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import config from "./app/config";
import "./app/config/passport";

const app: Application = express();

app.use(
  expressSession({
    secret: config.EXPRESS_SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is Running Successfully" });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
