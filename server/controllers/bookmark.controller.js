// Bookmark controller — save/remove articles, list user's bookmarks
import Bookmark from "../models/bookmark.model.js";
import Article from "../models/article.model.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

// POST /api/bookmarks/toggle/:articleId — toggle bookmark on/off
export const toggleBookmark = async (req, res) => {
  try {
    const { articleId } = req.params;
    const article = await Article.findById(articleId);
    if (!article) return errorResponse(res, 404, "Article not found.");

    const existing = await Bookmark.findOne({
      user: req.user._id,
      article: articleId,
    });

    if (existing) {
      await existing.deleteOne();
      return successResponse(res, 200, "Bookmark removed.", {
        bookmarked: false,
      });
    }

    await Bookmark.create({ user: req.user._id, article: articleId });
    return successResponse(res, 201, "Article bookmarked.", {
      bookmarked: true,
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to toggle bookmark.", error.message);
  }
};

// GET /api/bookmarks/me — current user's bookmarks
export const getMyBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate({
        path: "article",
        select:
          "title slug excerpt featuredImage author readingTime accessLevel magazine category",
        populate: [
          { path: "magazine", select: "title slug" },
          { path: "category", select: "name slug" },
        ],
      })
      .sort("-createdAt");

    return successResponse(res, 200, "Bookmarks fetched.", { bookmarks });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch bookmarks.", error.message);
  }
};

// DELETE /api/bookmarks/:id — remove a specific bookmark
export const removeBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id, // ensure ownership
    });
    if (!bookmark) return errorResponse(res, 404, "Bookmark not found.");
    return successResponse(res, 200, "Bookmark removed.");
  } catch (error) {
    return errorResponse(res, 500, "Failed to remove bookmark.", error.message);
  }
};

// GET /api/bookmarks/check/:articleId — quick yes/no used by the UI heart button
export const checkBookmark = async (req, res) => {
  try {
    const exists = await Bookmark.exists({
      user: req.user._id,
      article: req.params.articleId,
    });
    return successResponse(res, 200, "Status checked.", {
      bookmarked: !!exists,
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to check bookmark.", error.message);
  }
};
