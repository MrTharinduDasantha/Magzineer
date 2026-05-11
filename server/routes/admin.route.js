// Admin routes — dashboard stats + user management
import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  getUserDetail,
  toggleBlockUser,
} from "../controllers/admin.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminAuthMiddleware from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// Every admin route requires authentication AND admin role
router.use(authMiddleware, adminAuthMiddleware);

router.get("/dashboard", getDashboardStats); // GET   /api/admin/dashboard
router.get("/users", getAllUsers); // GET   /api/admin/users
router.get("/users/:id", getUserDetail); // GET   /api/admin/users/:id
router.patch("/users/:id/toggle-block", toggleBlockUser); // PATCH /api/admin/users/:id/toggle-block

export default router;
