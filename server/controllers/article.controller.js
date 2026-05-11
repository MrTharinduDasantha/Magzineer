// Article controller — public reading (with access gating) + admin CRUD + view tracking
import jwt from "jsonwebtoken";
import Article from "../models/article.model.js";
import Magazine from "../models/magazine.model.js";
import Category from "../models/category.model.js";
import User from "../models/user.model.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.util.js";
import { calculateReadingTime } from "../utils/readingTime.util.js";
import { canAccessArticle } from "../utils/subscription.util.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

// Slug helper
const slugify = (str) =>
  String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Inline optional-auth — decode the JWT cookie if present so we can identify the reader on public routes (used by access-gated article detail).
// Returns the User document, or null if not logged in / token invalid.
const getOptionalUser = async (req) => {
  try {
    const token = req.cookies?.token;
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    return user && !user.blocked ? user : null;
  } catch {
    return null;
  }
};

// ─────────────────────────── PUBLIC ───────────────────────────

// GET /api/articles — list published articles with filters + pagination
export const getArticles = async (req, res) => {
  try {
    const {
      magazine,
      issue,
      category,
      page = 1,
      limit = 12,
      sort = "-createdAt",
    } = req.query;

    const query = { status: "published" };
    if (magazine) query.magazine = magazine;
    if (issue) query.issue = issue;
    if (category) query.category = category;

    const skip = (Number(page) - 1) * Number(limit);

    const [articles, total] = await Promise.all([
      Article.find(query)
        .populate("magazine", "title slug")
        .populate("issue", "issueNumber publicationDate")
        .populate("category", "name slug")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .select("-content"), // never include heavy HTML in list view
      Article.countDocuments(query),
    ]);

    return successResponse(res, 200, "Articles fetched.", {
      articles,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch articles.", error.message);
  }
};

// GET /api/articles/trending — top viewed articles (homepage)
export const getTrendingArticles = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;
    const articles = await Article.find({ status: "published" })
      .populate("magazine", "title slug")
      .populate("category", "name slug")
      .sort("-views")
      .limit(limit)
      .select("-content");
    return successResponse(res, 200, "Trending articles fetched.", {
      articles,
    });
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Failed to fetch trending articles.",
      error.message,
    );
  }
};

// GET /api/articles/:id — article detail with access gating
// • Free articles: full content for everyone
// • Premium articles: full content only if user has active subscription OR
//   has purchased the issue this article belongs to. Otherwise excerpt only.
// • Also increments the view counter and writes to reading history (if logged in).
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate("magazine", "title slug")
      .populate("issue", "issueNumber publicationDate price")
      .populate("category", "name slug");

    if (!article || article.status !== "published") {
      return errorResponse(res, 404, "Article not found.");
    }

    // Increment view count (fire and forget, don't block response)
    Article.updateOne({ _id: article._id }, { $inc: { views: 1 } }).catch(
      () => {},
    );

    const user = await getOptionalUser(req);

    // Record reading history for logged-in users (upsert)
    if (user) {
      const ReadingHistory = (await import("../models/readingHistory.model.js"))
        .default;
      ReadingHistory.findOneAndUpdate(
        { user: user._id, article: article._id },
        { $set: { lastReadAt: new Date() } },
        { upsert: true, new: true },
      ).catch(() => {});
    }

    // Determine if the requester can read full content
    const hasAccess = await canAccessArticle(user?._id, article);

    // If no access, return article WITHOUT the content field
    const articleObj = article.toObject();
    if (!hasAccess) {
      delete articleObj.content;
    }
    articleObj.hasAccess = hasAccess;
    articleObj.isLocked = !hasAccess;

    return successResponse(res, 200, "Article fetched.", {
      article: articleObj,
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch article.", error.message);
  }
};

// GET /api/articles/:id/related — related articles from the same magazine
export const getRelatedArticles = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return errorResponse(res, 404, "Article not found.");

    const limit = parseInt(req.query.limit, 10) || 4;
    const related = await Article.find({
      magazine: article.magazine,
      _id: { $ne: article._id },
      status: "published",
    })
      .populate("category", "name slug")
      .sort("-views")
      .limit(limit)
      .select("-content");

    return successResponse(res, 200, "Related articles fetched.", {
      articles: related,
    });
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Failed to fetch related articles.",
      error.message,
    );
  }
};

// ─────────────────────────── ADMIN ────────────────────────────

// GET /api/articles/admin/all — every article, with filters
export const adminGetAllArticles = async (req, res) => {
  try {
    const {
      magazine,
      issue,
      status,
      author,
      search,
      page = 1,
      limit = 20,
    } = req.query;
    const query = {};
    if (magazine) query.magazine = magazine;
    if (issue) query.issue = issue;
    if (status) query.status = status;
    if (author) query.author = { $regex: author, $options: "i" };
    if (search) query.title = { $regex: search, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);

    const [articles, total] = await Promise.all([
      Article.find(query)
        .populate("magazine", "title")
        .populate("issue", "issueNumber")
        .populate("category", "name")
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit))
        .select("-content"),
      Article.countDocuments(query),
    ]);

    return successResponse(res, 200, "All articles fetched.", {
      articles,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch articles.", error.message);
  }
};

// GET /api/articles/admin/:id — full article for preview/edit
export const adminGetArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate("magazine", "title")
      .populate("issue", "issueNumber")
      .populate("category", "name");
    if (!article) return errorResponse(res, 404, "Article not found.");
    return successResponse(res, 200, "Article fetched.", { article });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch article.", error.message);
  }
};

// POST /api/articles
export const createArticle = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      author,
      magazine,
      issue,
      category,
      accessLevel,
      status,
      scheduledAt,
      readingTime,
    } = req.body;

    if (!title || !excerpt || !content || !author || !magazine || !category) {
      return errorResponse(res, 400, "Required fields are missing.");
    }

    // Verify references exist
    const [mag, cat] = await Promise.all([
      Magazine.findById(magazine),
      Category.findById(category),
    ]);
    if (!mag) return errorResponse(res, 404, "Magazine not found.");
    if (!cat) return errorResponse(res, 404, "Category not found.");

    // Featured image is required at creation
    if (!req.file)
      return errorResponse(res, 400, "Featured image is required.");
    const featuredImage = await uploadToCloudinary(
      req.file.buffer,
      "magzineer/articles",
    );

    // Use admin-supplied reading time if given, else auto-calculate from HTML content
    const computedReadingTime = readingTime
      ? Number(readingTime)
      : calculateReadingTime(content);

    const article = await Article.create({
      title,
      slug: slugify(title) + "-" + Date.now().toString(36), // append timestamp suffix to keep unique
      excerpt,
      content,
      author,
      magazine,
      issue: issue || null,
      category,
      featuredImage,
      readingTime: computedReadingTime,
      accessLevel: accessLevel || "free",
      status: status || "draft",
      scheduledAt: status === "scheduled" ? scheduledAt : null,
    });

    return successResponse(res, 201, "Article created.", { article });
  } catch (error) {
    return errorResponse(res, 500, "Failed to create article.", error.message);
  }
};

// PUT /api/articles/:id
export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return errorResponse(res, 404, "Article not found.");

    const {
      title,
      excerpt,
      content,
      author,
      magazine,
      issue,
      category,
      accessLevel,
      status,
      scheduledAt,
      readingTime,
    } = req.body;

    if (title) article.title = title;
    if (excerpt) article.excerpt = excerpt;

    if (content) {
      article.content = content;
      // Re-compute reading time when content changes (unless admin overrides)
      article.readingTime = readingTime
        ? Number(readingTime)
        : calculateReadingTime(content);
    } else if (readingTime) {
      article.readingTime = Number(readingTime);
    }

    if (author) article.author = author;
    if (magazine) article.magazine = magazine;
    if (issue !== undefined) article.issue = issue || null;
    if (category) article.category = category;
    if (accessLevel) article.accessLevel = accessLevel;
    if (status) article.status = status;
    article.scheduledAt = status === "scheduled" ? scheduledAt || null : null;

    // Replace featured image if new one uploaded
    if (req.file) {
      if (article.featuredImage?.publicId) {
        await deleteFromCloudinary(article.featuredImage.publicId);
      }
      article.featuredImage = await uploadToCloudinary(
        req.file.buffer,
        "magzineer/articles",
      );
    }

    await article.save();
    return successResponse(res, 200, "Article updated.", { article });
  } catch (error) {
    return errorResponse(res, 500, "Failed to update article.", error.message);
  }
};

// DELETE /api/articles/:id
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return errorResponse(res, 404, "Article not found.");

    if (article.featuredImage?.publicId) {
      await deleteFromCloudinary(article.featuredImage.publicId);
    }
    await article.deleteOne();
    return successResponse(res, 200, "Article deleted.");
  } catch (error) {
    return errorResponse(res, 500, "Failed to delete article.", error.message);
  }
};
