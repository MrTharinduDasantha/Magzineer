// Global search controller — searches magazines AND articles with filters + pagination
import Magazine from "../models/magazine.model.js";
import Article from "../models/article.model.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

// GET /api/search?q=...&magazine=...&issue=...&category=...&from=...&to=...&page=1&limit=12
export const globalSearch = async (req, res) => {
  try {
    const {
      q = "",
      magazine,
      issue,
      category,
      from,
      to,
      page = 1,
      limit = 12,
    } = req.query;

    if (!q.trim()) return errorResponse(res, 400, "Search query is required.");

    // Build the article search query
    const articleQuery = { status: "published" };
    if (magazine) articleQuery.magazine = magazine;
    if (issue) articleQuery.issue = issue;
    if (category) articleQuery.category = category;
    if (from || to) {
      articleQuery.createdAt = {};
      if (from) articleQuery.createdAt.$gte = new Date(from);
      if (to) articleQuery.createdAt.$lte = new Date(to);
    }

    // Use regex on title/excerpt/author for fuzzy matching across all filters
    const regex = { $regex: q, $options: "i" };
    articleQuery.$or = [
      { title: regex },
      { excerpt: regex },
      { author: regex },
    ];

    const skip = (Number(page) - 1) * Number(limit);

    // Search articles (paginated) and magazines (top results) in parallel
    const [articles, articleTotal, magazines] = await Promise.all([
      Article.find(articleQuery)
        .populate("magazine", "title slug")
        .populate("category", "name slug")
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit))
        .select("-content"),
      Article.countDocuments(articleQuery),
      Magazine.find({
        status: "active",
        $or: [{ title: regex }, { description: regex }],
      }).limit(6),
    ]);

    return successResponse(res, 200, "Search results fetched.", {
      magazines,
      articles,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: articleTotal,
        totalPages: Math.ceil(articleTotal / Number(limit)),
      },
    });
  } catch (error) {
    return errorResponse(res, 500, "Search failed.", error.message);
  }
};
