// Stripe webhook route
// IMPORTANT: this router exports BOTH the router and the raw-body parser config, because the route must receive the raw request body (NOT JSON-parsed) so that
// Stripe's signature verification can succeed. In server.js this route is mounted BEFORE express.json() with express.raw({ type: "application/json" }).
import express from "express";
import { handleStripeWebhook } from "../controllers/stripeWebhook.controller.js";

const router = express.Router();

// The raw body parser is applied at the mount point in server.js
router.post("/", handleStripeWebhook);

export default router;
