// Report routes — analytics (admin only)
import express from "express";
import {
  getMostReadArticles,
  getTopSubscribers,
  getRevenueReport,
  exportRevenuePDF,
} from "../controllers/report.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminAuthMiddleware from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// All report routes are admin-only
router.use(authMiddleware, adminAuthMiddleware);

router.get("/most-read", getMostReadArticles); // GET /api/reports/most-read
router.get("/top-subscribers", getTopSubscribers); // GET /api/reports/top-subscribers
router.get("/revenue", getRevenueReport); // GET /api/reports/revenue
router.get("/revenue/export", exportRevenuePDF); // GET /api/reports/revenue/export (PDF)

export default router;
