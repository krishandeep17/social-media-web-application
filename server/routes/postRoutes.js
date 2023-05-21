import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import {
  multerSingleUpload,
  uploadPostImage,
  uploadCommentImage,
} from "../middleware/postMiddleware.js";
import {
  getAllPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  // commentOnPost,
} from "../controllers/postController.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getAllPosts)
  .post(multerSingleUpload, uploadPostImage, createPost);

router.route("/:id").get(getPost).patch(updatePost).delete(deletePost);

router.route("/:id/comment").patch(
  multerSingleUpload,
  uploadCommentImage
  // commentOnPost
);

export default router;
