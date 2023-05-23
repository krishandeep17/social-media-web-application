import express from "express";

import reactRouter from "../routes/reactRoutes.js";
import commentRouter from "../routes/commentRoutes.js";

import { protect } from "../middleware/authMiddleware.js";
import {
  multerSingleUpload,
  uploadPostImage,
} from "../middleware/postMiddleware.js";

import {
  getAllPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

const router = express.Router();

// For this specific route here, we want to use react router instead
router.use("/:postId/reacts", reactRouter);

// For this specific route here, we want to use comment router instead
router.use("/:postId/comments", commentRouter);

router.use(protect);

router
  .route("/")
  .get(getAllPosts)
  .post(multerSingleUpload, uploadPostImage, createPost);

router.route("/:id").get(getPost).patch(updatePost).delete(deletePost);

export default router;
