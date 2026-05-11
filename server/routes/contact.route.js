// Contact routes — public submission + admin inbox management
import express from "express";
import {
  submitContact,
  adminGetAllMessages,
  adminUpdateMessageStatus,
  adminDeleteMessage,
} from "../controllers/contact.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminAuthMiddleware from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// ─────────────── Public ───────────────
router.post("/", submitContact); // POST /api/contact

// ─────────────── Admin ───────────────
router.get(
  "/admin/all",
  authMiddleware,
  adminAuthMiddleware,
  adminGetAllMessages,
);

router.patch(
  "/admin/:id/status",
  authMiddleware,
  adminAuthMiddleware,
  adminUpdateMessageStatus,
);

router.delete(
  "/admin/:id",
  authMiddleware,
  adminAuthMiddleware,
  adminDeleteMessage,
);

export default router;
