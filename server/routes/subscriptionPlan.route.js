// Subscription Plan routes — public list + admin CRUD
import express from "express";
import {
  getActivePlans,
  getDefaultPlan,
  adminGetAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
  togglePlanStatus,
  setDefaultPlan,
} from "../controllers/subscriptionPlan.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminAuthMiddleware from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// ─────────────── Public ───────────────
router.get("/", getActivePlans);
router.get("/default", getDefaultPlan);

// ─────────────── Admin ───────────────
router.get("/admin/all", authMiddleware, adminAuthMiddleware, adminGetAllPlans);
router.post("/", authMiddleware, adminAuthMiddleware, createPlan);
router.put("/:id", authMiddleware, adminAuthMiddleware, updatePlan);
router.delete("/:id", authMiddleware, adminAuthMiddleware, deletePlan);
router.patch(
  "/:id/toggle-status",
  authMiddleware,
  adminAuthMiddleware,
  togglePlanStatus,
);
router.patch(
  "/:id/set-default",
  authMiddleware,
  adminAuthMiddleware,
  setDefaultPlan,
);

export default router;
