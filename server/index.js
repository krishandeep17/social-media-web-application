import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import morgan from "morgan";

import AppError from "./utils/appError.js";
import errorController from "./controllers/errorController.js";

import postRouter from "./routes/postRoutes.js";
import userRouter from "./routes/userRoutes.js";

// HANDLE SYNCHRONOUS ERROR
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 🤯 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();

const app = express();
const port = 1710;

// MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ROUTES
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

app.get("/", async (req, res) => {
  res.send("Hello from SERVER!");
});

// HANDLING UNHANDLED ROUTES
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(errorController);

// CONNECT DATABASE
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.log(err));

// START SERVER
const server = app.listen(port, () => {
  console.log(`Server has started on port http://localhost:${port}`);
});

// HANDLE PROMISE REJECTION
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 🤯 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
