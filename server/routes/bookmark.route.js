// Bookmark routes — save/check/list/remove articles
import express from "express";
import {
  toggleBookmark,
  getMyBookmarks,
  removeBookmark,
  checkBookmark,
} from "../controllers/bookmark.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// All bookmark routes require authentication
router.use(authMiddleware);

router.post("/toggle/:articleId", toggleBookmark); // POST   /api/bookmarks/toggle/:articleId
router.get("/me", getMyBookmarks); // GET    /api/bookmarks/me
router.get("/check/:articleId", checkBookmark); // GET    /api/bookmarks/check/:articleId
router.delete("/:id", removeBookmark); // DELETE /api/bookmarks/:id

export default router;
