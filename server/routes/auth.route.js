// Authentication routes — register, login (reader + admin), logout, get current user
import express from "express";
import {
  register,
  login,
  adminLogin,
  logout,
  getMe,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { uploadSingleImage } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Public — register with optional profile photo upload
router.post("/register", uploadSingleImage("profilePhoto"), register);

// Public — reader login
router.post("/login", login);

// Public — admin login (credentials checked against .env)
router.post("/admin-login", adminLogin);

// Public — logout (clears auth cookie)
router.post("/logout", logout);

// Protected — fetch the currently authenticated user
router.get("/me", authMiddleware, getMe);

export default router;
