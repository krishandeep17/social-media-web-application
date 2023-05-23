import express from "express";

import { protect, restrictTo } from "../middleware/authMiddleware.js";
import {
  getAllPostReacts,
  createPostReact,
  getReact,
  updateReact,
  deleteReact,
} from "../controllers/reactController.js";

// Preserve the req.params values from the parent(post) router
const router = express.Router({ mergeParams: true });

router.use(protect);

router.route("/").get(getAllPostReacts).post(createPostReact);

router.use(restrictTo("admin"));

router.route("/:id").get(getReact).patch(updateReact).delete(deleteReact);

export default router;
