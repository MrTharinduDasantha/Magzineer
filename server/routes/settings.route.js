// Settings routes — public read + admin update (singleton)
import express from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/settings.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminAuthMiddleware from "../middlewares/adminAuth.middleware.js";
import { uploadSingleImage } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Public — footer/general info
router.get("/", getSettings);

// Admin — update (with optional new logo upload)
router.put(
  "/",
  authMiddleware,
  adminAuthMiddleware,
  uploadSingleImage("logo"),
  updateSettings,
);

export default router;
