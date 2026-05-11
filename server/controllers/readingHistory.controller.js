// Reading-history controller — last viewed articles per user
import ReadingHistory from "../models/readingHistory.model.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

// POST /api/history/record/:articleId — explicit record endpoint
// (Note: article.controller.js's getArticleById ALSO upserts history; this endpoint is a fallback for explicit client-side calls.)
export const recordReading = async (req, res) => {
  try {
    const { articleId } = req.params;
    await ReadingHistory.findOneAndUpdate(
      { user: req.user._id, article: articleId },
      { $set: { lastReadAt: new Date() } },
      { upsert: true, new: true },
    );
    return successResponse(res, 200, "Reading history updated.");
  } catch (error) {
    return errorResponse(res, 500, "Failed to update history.", error.message);
  }
};

// GET /api/history/me — current user's reading history (most recent first)
export const getMyHistory = async (req, res) => {
  try {
    const history = await ReadingHistory.find({ user: req.user._id })
      .populate({
        path: "article",
        select:
          "title slug excerpt featuredImage author readingTime accessLevel magazine",
        populate: { path: "magazine", select: "title slug" },
      })
      .sort("-lastReadAt")
      .limit(50);

    return successResponse(res, 200, "Reading history fetched.", { history });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch history.", error.message);
  }
};

// DELETE /api/history/clear — clear all reading history for the current user
export const clearHistory = async (req, res) => {
  try {
    await ReadingHistory.deleteMany({ user: req.user._id });
    return successResponse(res, 200, "Reading history cleared.");
  } catch (error) {
    return errorResponse(res, 500, "Failed to clear history.", error.message);
  }
};
