import express from "express";
import { authMiddleware } from "../controllers/authController.js";

import {
  getAllPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/").get(getAllPosts).post(createPost);

router.route("/:id").get(getPost).patch(updatePost).delete(deletePost);

export default router;
