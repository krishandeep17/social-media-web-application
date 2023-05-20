import express from "express";

import { authMiddleware } from "../controllers/authController.js";
import {
  getAllPosts,
  getSingleImage,
  uploadPostImages,
  createPost,
  getPost,
  updatePost,
  deletePost,
  uploadCommentImage,
  commentOnPost,
} from "../controllers/postController.js";

const router = express.Router();

router.use(authMiddleware);

router
  .route("/")
  .get(getAllPosts)
  .post(getSingleImage, uploadPostImages, createPost);

router.route("/:id").get(getPost).patch(updatePost).delete(deletePost);

router
  .route("/:id/comment")
  .patch(getSingleImage, uploadCommentImage, commentOnPost);

export default router;
