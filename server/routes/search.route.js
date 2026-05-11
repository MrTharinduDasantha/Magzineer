// Global search route
import express from "express";
import { globalSearch } from "../controllers/search.controller.js";

const router = express.Router();

// Public — GET /api/search?q=...&magazine=...&issue=...&category=...&from=...&to=...
router.get("/", globalSearch);

export default router;
