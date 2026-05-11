// Payment routes — user payment history + admin ledger
import express from "express";
import {
  getMyPayments,
  adminGetAllPayments,
} from "../controllers/payment.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminAuthMiddleware from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// Authenticated user — current user's payment history
router.get("/me", authMiddleware, getMyPayments);

// Admin — full payment ledger with filters
router.get(
  "/admin/all",
  authMiddleware,
  adminAuthMiddleware,
  adminGetAllPayments,
);

export default router;
