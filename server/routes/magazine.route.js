// Magazine routes — public discovery + admin CRUD
import express from "express";
import {
  getAllMagazines,
  getFeaturedMagazines,
  getMagazineById,
  adminGetAllMagazines,
  createMagazine,
  updateMagazine,
  deleteMagazine,
  toggleMagazineStatus,
} from "../controllers/magazine.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminAuthMiddleware from "../middlewares/adminAuth.middleware.js";
import { uploadSingleImage } from "../middlewares/upload.middleware.js";

const router = express.Router();

// ─────────────── Public ───────────────
router.get("/featured", getFeaturedMagazines);
router.get("/", getAllMagazines);

// ─────────────── Admin ───────────────
// Note: admin routes are declared BEFORE the :id route to avoid path conflicts
router.get(
  "/admin/all",
  authMiddleware,
  adminAuthMiddleware,
  adminGetAllMagazines,
);

router.post(
  "/",
  authMiddleware,
  adminAuthMiddleware,
  uploadSingleImage("cover"),
  createMagazine,
);

router.put(
  "/:id",
  authMiddleware,
  adminAuthMiddleware,
  uploadSingleImage("cover"),
  updateMagazine,
);

router.delete("/:id", authMiddleware, adminAuthMiddleware, deleteMagazine);

router.patch(
  "/:id/toggle-status",
  authMiddleware,
  adminAuthMiddleware,
  toggleMagazineStatus,
);

// Public — keep this last (catches GET /:id)
router.get("/:id", getMagazineById);

export default router;
