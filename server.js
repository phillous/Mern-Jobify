import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";

//routers

import authRouter from "./routes/authRouter.js";
import JobRouter from "./routes/jobRouter.js";
import userRouter from "./routes/userRouter.js";

//public
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

//middlewares
import { authenticateUser } from "./middleware/authMiddleware.js";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(path.resolve(__dirname, "./public")));

app.use(cookieParser());
app.use(express.json());

app.get("/api/v1/test", (req, res) => {
  res.json({ msg: "test route" });
});

const port = process.env.PORT || 5100;

app.use("/api/v1/jobs", authenticateUser, JobRouter);
app.use("/api/v1/users", authenticateUser, userRouter);
app.use("/api/v1/auth", authRouter);

app.use("*", (req, res) => {
  res.status(404).json({ msg: "not found" });
});

app.use(errorHandlerMiddleware);

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on PORT ${port}....`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
