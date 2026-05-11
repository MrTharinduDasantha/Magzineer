// Category routes — public list + admin CRUD
import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminAuthMiddleware from "../middlewares/adminAuth.middleware.js";
import { uploadSingleImage } from "../middlewares/upload.middleware.js";

const router = express.Router();

// ─────────────── Public ───────────────
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// ─────────────── Admin ───────────────
router.post(
  "/",
  authMiddleware,
  adminAuthMiddleware,
  uploadSingleImage("image"),
  createCategory,
);

router.put(
  "/:id",
  authMiddleware,
  adminAuthMiddleware,
  uploadSingleImage("image"),
  updateCategory,
);

router.delete("/:id", authMiddleware, adminAuthMiddleware, deleteCategory);

export default router;
