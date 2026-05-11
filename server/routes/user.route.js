// User-profile routes — profile management + password change
import express from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { uploadSingleImage } from "../middlewares/upload.middleware.js";

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

// GET current profile
router.get("/profile", getProfile);

// PUT update profile (name, email, optional new profile photo)
router.put("/profile", uploadSingleImage("profilePhoto"), updateProfile);

// PUT change password
router.put("/change-password", changePassword);

export default router;
