import express from "express";

import { protect, restrictTo } from "../middleware/authMiddleware.js";
import {
  getSingleImage,
  uploadCommentImage,
  setPostUserId,
} from "../middleware/commentMiddleware.js";

import {
  getAllComments,
  createComment,
  getComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";

// Preserve the req.params values from the parent(post) router
const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route("/")
  .get(getAllComments)
  .post(getSingleImage, uploadCommentImage, setPostUserId, createComment);

router.use(restrictTo("admin"));

router.route("/:id").get(getComment).patch(updateComment).delete(deleteComment);

export default router;
