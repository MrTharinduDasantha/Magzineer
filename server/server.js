// Magzineer — Magazine Management System
// Server entry point — Express app bootstrap, middleware wiring, route mounting

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import connectMongoDB from "./configs/connectMongoDB.config.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";

// ─────────────── Route imports ───────────────
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import magazineRoutes from "./routes/magazine.route.js";
import issueRoutes from "./routes/issue.route.js";
import articleRoutes from "./routes/article.route.js";
import categoryRoutes from "./routes/category.route.js";
import searchRoutes from "./routes/search.route.js";
import subscriptionPlanRoutes from "./routes/subscriptionPlan.route.js";
import subscriptionRoutes from "./routes/subscription.route.js";
import purchaseRoutes from "./routes/purchase.route.js";
import paymentRoutes from "./routes/payment.route.js";
import stripeWebhookRoutes from "./routes/stripeWebhook.route.js";
import bookmarkRoutes from "./routes/bookmark.route.js";
import readingHistoryRoutes from "./routes/readingHistory.route.js";
import adminRoutes from "./routes/admin.route.js";
import settingsRoutes from "./routes/settings.route.js";
import reportRoutes from "./routes/report.route.js";
import contactRoutes from "./routes/contact.route.js";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────────────────────────
// Security middleware
// ─────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// CORS — allow the client to send cookies (credentials: true)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

// Request logging in development
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ─────────────────────────────────────────────────────────────
// Stripe Webhook (MUST be mounted BEFORE express.json() so that
// the raw body is available for Stripe signature verification)
// ─────────────────────────────────────────────────────────────
app.use(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookRoutes,
);

// ─────────────────────────────────────────────────────────────
// Body parsers + cookie parser — applied AFTER the webhook route
// ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ─────────────────────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Magzineer API is running.",
    version: "1.0.0",
  });
});

// ─────────────────────────────────────────────────────────────
// API routes
// ─────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/magazines", magazineRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/plans", subscriptionPlanRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/history", readingHistoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/contact", contactRoutes);

// ─────────────────────────────────────────────────────────────
// 404 handler — for any unmatched route
// ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─────────────────────────────────────────────────────────────
// Centralized error handler (must be the LAST middleware)
// ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─────────────────────────────────────────────────────────────
// Boot the server only after MongoDB is connected
// ─────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    await connectMongoDB();
    app.listen(PORT, () => {
      console.log(`🚀 Magzineer server running on http://localhost:${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown — close cleanly on Ctrl+C / kill signals
process.on("SIGTERM", () => {
  console.log("SIGTERM received — shutting down gracefully.");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("SIGINT received — shutting down gracefully.");
  process.exit(0);
});
