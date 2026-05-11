// Single-issue purchase routes
import express from "express";
import {
  createPurchaseCheckout,
  getMyPurchases,
} from "../controllers/purchase.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Authenticated users only
router.use(authMiddleware);

router.post("/checkout", createPurchaseCheckout); // POST /api/purchases/checkout
router.get("/me", getMyPurchases); // GET  /api/purchases/me

export default router;
