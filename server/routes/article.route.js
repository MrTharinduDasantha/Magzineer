// Article routes — public reading with access gating + admin CRUD
import express from "express";
import {
  getArticles,
  getTrendingArticles,
  getArticleById,
  getRelatedArticles,
  adminGetAllArticles,
  adminGetArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/article.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminAuthMiddleware from "../middlewares/adminAuth.middleware.js";
import { uploadSingleImage } from "../middlewares/upload.middleware.js";

const router = express.Router();

// ─────────────── Public ───────────────
router.get("/trending", getTrendingArticles);
router.get("/", getArticles);

// ─────────────── Admin ───────────────
router.get(
  "/admin/all",
  authMiddleware,
  adminAuthMiddleware,
  adminGetAllArticles,
);
router.get(
  "/admin/:id",
  authMiddleware,
  adminAuthMiddleware,
  adminGetArticleById,
);

router.post(
  "/",
  authMiddleware,
  adminAuthMiddleware,
  uploadSingleImage("featuredImage"),
  createArticle,
);

router.put(
  "/:id",
  authMiddleware,
  adminAuthMiddleware,
  uploadSingleImage("featuredImage"),
  updateArticle,
);

router.delete("/:id", authMiddleware, adminAuthMiddleware, deleteArticle);

// Public — keep these last (catch GET /:id and /:id/related)
router.get("/:id/related", getRelatedArticles);
router.get("/:id", getArticleById);

export default router;
