import express from "express";

import {
  signup,
  verifyEmail,
  login,
  authMiddleware,
  roleMiddleware,
  forgotPassword,
  resetPassword,
  updatePassword,
} from "../controllers/authController.js";
import {
  getMe,
  getUserImages,
  uploadProfilePhoto,
  uploadCoverPhoto,
  updateMe,
  updateMyDetails,
  deleteMe,
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

router.use(authMiddleware);

router.get("/me", getMe, getUser);
router.patch(
  "/updateMe",
  getUserImages,
  uploadProfilePhoto,
  uploadCoverPhoto,
  updateMe
);
router.patch("/updateMyPassword", updatePassword);
router.patch("/updateMyDetails", updateMyDetails);
router.delete("/deleteMe", deleteMe, deleteUser);

router.use(roleMiddleware("admin"));

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
