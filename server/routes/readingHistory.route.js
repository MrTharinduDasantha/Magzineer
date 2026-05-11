// Reading-history routes
import express from "express";
import {
  recordReading,
  getMyHistory,
  clearHistory,
} from "../controllers/readingHistory.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Authenticated users only
router.use(authMiddleware);

router.post("/record/:articleId", recordReading); // POST   /api/history/record/:articleId
router.get("/me", getMyHistory); // GET    /api/history/me
router.delete("/clear", clearHistory); // DELETE /api/history/clear

export default router;
