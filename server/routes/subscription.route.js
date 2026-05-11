// Subscription routes — checkout, view, cancel, upgrade/downgrade
import express from "express";
import {
  createSubscriptionCheckout,
  getMySubscription,
  cancelSubscription,
  changeSubscription,
} from "../controllers/subscription.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// All subscription routes require an authenticated user
router.use(authMiddleware);

router.post("/checkout", createSubscriptionCheckout); // POST /api/subscriptions/checkout
router.get("/me", getMySubscription); // GET  /api/subscriptions/me
router.post("/cancel", cancelSubscription); // POST /api/subscriptions/cancel
router.post("/change", changeSubscription); // POST /api/subscriptions/change

export default router;
