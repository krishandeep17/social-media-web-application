import express from "express";

import { protect, restrictTo } from "../middleware/authMiddleware.js";
import {
  multerUploadImage,
  uploadProfilePicture,
  uploadCoverPicture,
  checkUserFriend,
} from "../middleware/userMiddleware.js";

import {
  signup,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
} from "../controllers/authController.js";
import {
  getMe,
  updateMe,
  updateMyDetails,
  deleteMe,
  savePost,
  sendFriendRequest,
  acceptFriendRequest,
  deleteFriendRequest,
  removeFriend,
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.patch("/verifyEmail/:emailVerifyToken", verifyEmail);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:resetToken", resetPassword);

router.use(protect);

router.get("/me", getMe, getUser);
router.patch(
  "/updateMe",
  multerUploadImage,
  uploadProfilePicture,
  uploadCoverPicture,
  updateMe
);
router.patch("/updateMyPassword", updatePassword);
router.patch("/updateMyDetails", updateMyDetails);
router.delete("/deleteMe", deleteMe, deleteUser);
router.patch("/savePost/:postId", savePost);

router.use(checkUserFriend);

router.route("/sendFriendRequest/:receiverId").patch(sendFriendRequest);
router.route("/acceptFriendRequest/:senderId").patch(acceptFriendRequest);
router.route("/deleteFriendRequest/:senderId").patch(deleteFriendRequest);
router.route("/removeFriend/:friendId").patch(removeFriend);

router.use(restrictTo("admin"));

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
