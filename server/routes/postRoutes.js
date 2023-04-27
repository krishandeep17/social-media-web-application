import express from "express";

import {
  getAllPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

const router = express.Router();

router.route("/").get(getAllPosts).post(createPost);

router.route("/:id").get(getPost).patch(updatePost).delete(deletePost);

export default router;
