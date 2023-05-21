import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import {
  reactPost,
  getAllReacts,
  createReact,
} from "../controllers/routerController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getAllReacts).post(createReact);

router.route("/:postId").patch(reactPost);

export default router;
