import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

import postRouter from "./routes/postRoutes.js";

dotenv.config();

const app = express();
const port = 1710;

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use("/api/v1/posts", postRouter);

app.get("/", async (req, res) => {
  res.send("Hello from SERVER!");
});

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Server has started on port http://localhost:${port}`);
});
