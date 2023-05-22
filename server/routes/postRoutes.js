import express from "express";

import reactRouter from "../routes/reactRoutes.js";
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
  commentOnPost,
} from "../controllers/postController.js";

const router = express.Router();

// For this specific route here, we want to use react router instead
router.use("/:postId/reacts", reactRouter);

router.use(protect);

router
  .route("/")
  .get(getAllPosts)
  .post(multerSingleUpload, uploadPostImage, createPost);

router.route("/:id").get(getPost).patch(updatePost).delete(deletePost);

router
  .route("/:id/comment")
  .patch(multerSingleUpload, uploadCommentImage, commentOnPost);

export default router;
