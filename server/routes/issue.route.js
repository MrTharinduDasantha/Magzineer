// Issue routes — public listings + admin CRUD + drag-and-drop article assignment
import express from "express";
import {
  getLatestIssues,
  getIssuesByMagazine,
  getIssueById,
  adminGetAllIssues,
  createIssue,
  updateIssue,
  deleteIssue,
  bulkUpdateStatus,
  assignArticles,
  unassignArticle,
} from "../controllers/issue.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminAuthMiddleware from "../middlewares/adminAuth.middleware.js";
import { uploadSingleImage } from "../middlewares/upload.middleware.js";

const router = express.Router();

// ─────────────── Public ───────────────
router.get("/latest", getLatestIssues);
router.get("/magazine/:magazineId", getIssuesByMagazine);

// ─────────────── Admin ───────────────
router.get(
  "/admin/all",
  authMiddleware,
  adminAuthMiddleware,
  adminGetAllIssues,
);

router.post(
  "/",
  authMiddleware,
  adminAuthMiddleware,
  uploadSingleImage("cover"),
  createIssue,
);

router.put(
  "/:id",
  authMiddleware,
  adminAuthMiddleware,
  uploadSingleImage("cover"),
  updateIssue,
);

router.delete("/:id", authMiddleware, adminAuthMiddleware, deleteIssue);

// Bulk publish/unpublish
router.patch(
  "/bulk-status",
  authMiddleware,
  adminAuthMiddleware,
  bulkUpdateStatus,
);

// Drag-and-drop article assignment
router.patch(
  "/:id/assign-articles",
  authMiddleware,
  adminAuthMiddleware,
  assignArticles,
);
router.patch(
  "/:id/unassign-article/:articleId",
  authMiddleware,
  adminAuthMiddleware,
  unassignArticle,
);

// Public — keep last
router.get("/:id", getIssueById);

export default router;
