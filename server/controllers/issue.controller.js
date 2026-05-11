// Issue controller — CRUD, bulk publish/unpublish, drag-and-drop article assignment
import Issue from "../models/issue.model.js";
import Article from "../models/article.model.js";
import Magazine from "../models/magazine.model.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.util.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

// ─────────────────────────── PUBLIC ───────────────────────────

// GET /api/issues/latest — most recent published issues across ALL magazines (homepage grid)
export const getLatestIssues = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 12;
    const issues = await Issue.find({ status: "published" })
      .populate("magazine", "title slug")
      .sort("-publicationDate")
      .limit(limit);
    return successResponse(res, 200, "Latest issues fetched.", { issues });
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Failed to fetch latest issues.",
      error.message,
    );
  }
};

// GET /api/issues/magazine/:magazineId — issues for a given magazine
export const getIssuesByMagazine = async (req, res) => {
  try {
    const issues = await Issue.find({
      magazine: req.params.magazineId,
      status: "published",
    }).sort("-publicationDate");
    return successResponse(res, 200, "Issues fetched.", { issues });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch issues.", error.message);
  }
};

// GET /api/issues/:id — issue detail with its articles
export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate(
      "magazine",
      "title slug",
    );
    if (!issue || issue.status !== "published") {
      return errorResponse(res, 404, "Issue not found.");
    }

    // Pull all PUBLISHED articles belonging to this issue
    const articles = await Article.find({
      issue: issue._id,
      status: "published",
    })
      .populate("category", "name slug")
      .select(
        "title slug excerpt featuredImage author readingTime accessLevel views createdAt",
      );

    return successResponse(res, 200, "Issue detail fetched.", {
      issue,
      articles,
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch issue.", error.message);
  }
};

// ─────────────────────────── ADMIN ────────────────────────────

// GET /api/issues/admin/all — every issue, with optional magazine filter
export const adminGetAllIssues = async (req, res) => {
  try {
    const { magazine, status } = req.query;
    const query = {};
    if (magazine) query.magazine = magazine;
    if (status) query.status = status;

    const issues = await Issue.find(query)
      .populate("magazine", "title")
      .sort("-publicationDate");
    return successResponse(res, 200, "All issues fetched.", { issues });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch issues.", error.message);
  }
};

// POST /api/issues
export const createIssue = async (req, res) => {
  try {
    const { magazine, issueNumber, title, publicationDate, price, status } =
      req.body;

    if (!magazine || !issueNumber || !publicationDate) {
      return errorResponse(
        res,
        400,
        "Magazine, issue number, and publication date are required.",
      );
    }

    // Ensure the parent magazine exists
    const mag = await Magazine.findById(magazine);
    if (!mag) return errorResponse(res, 404, "Parent magazine not found.");

    if (!req.file) return errorResponse(res, 400, "Cover image is required.");
    const cover = await uploadToCloudinary(req.file.buffer, "magzineer/issues");

    const issue = await Issue.create({
      magazine,
      issueNumber,
      title: title || "",
      publicationDate,
      cover,
      price: Number(price) || 0,
      status: status || "unpublished",
    });

    return successResponse(res, 201, "Issue created.", { issue });
  } catch (error) {
    return errorResponse(res, 500, "Failed to create issue.", error.message);
  }
};

// PUT /api/issues/:id
export const updateIssue = async (req, res) => {
  try {
    const { issueNumber, title, publicationDate, price, status } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return errorResponse(res, 404, "Issue not found.");

    if (issueNumber) issue.issueNumber = issueNumber;
    if (title !== undefined) issue.title = title;
    if (publicationDate) issue.publicationDate = publicationDate;
    if (price !== undefined) issue.price = Number(price);
    if (status) issue.status = status;

    if (req.file) {
      if (issue.cover?.publicId)
        await deleteFromCloudinary(issue.cover.publicId);
      issue.cover = await uploadToCloudinary(
        req.file.buffer,
        "magzineer/issues",
      );
    }

    await issue.save();
    return successResponse(res, 200, "Issue updated.", { issue });
  } catch (error) {
    return errorResponse(res, 500, "Failed to update issue.", error.message);
  }
};

// DELETE /api/issues/:id
export const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return errorResponse(res, 404, "Issue not found.");

    // Detach all articles belonging to this issue (rather than delete them)
    await Article.updateMany({ issue: issue._id }, { $set: { issue: null } });

    if (issue.cover?.publicId) await deleteFromCloudinary(issue.cover.publicId);
    await issue.deleteOne();

    return successResponse(res, 200, "Issue deleted.");
  } catch (error) {
    return errorResponse(res, 500, "Failed to delete issue.", error.message);
  }
};

// PATCH /api/issues/bulk-status — bulk publish/unpublish
// Body: { issueIds: [...], status: "published" | "unpublished" }
export const bulkUpdateStatus = async (req, res) => {
  try {
    const { issueIds, status } = req.body;
    if (
      !Array.isArray(issueIds) ||
      !["published", "unpublished"].includes(status)
    ) {
      return errorResponse(res, 400, "Invalid payload.");
    }

    const result = await Issue.updateMany(
      { _id: { $in: issueIds } },
      { $set: { status } },
    );

    return successResponse(
      res,
      200,
      `${result.modifiedCount} issues updated.`,
      { result },
    );
  } catch (error) {
    return errorResponse(res, 500, "Bulk update failed.", error.message);
  }
};

// PATCH /api/issues/:id/assign-articles — drag-and-drop article assignment
// Body: { articleIds: [...] } — sets the `issue` field on every listed article
export const assignArticles = async (req, res) => {
  try {
    const { articleIds } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return errorResponse(res, 404, "Issue not found.");

    if (!Array.isArray(articleIds)) {
      return errorResponse(res, 400, "articleIds must be an array.");
    }

    // Assign these articles to the issue (and force their magazine ref to match)
    await Article.updateMany(
      { _id: { $in: articleIds } },
      { $set: { issue: issue._id, magazine: issue.magazine } },
    );

    return successResponse(res, 200, "Articles assigned to issue.");
  } catch (error) {
    return errorResponse(res, 500, "Failed to assign articles.", error.message);
  }
};

// PATCH /api/issues/:id/unassign-article/:articleId — remove a single article from an issue
export const unassignArticle = async (req, res) => {
  try {
    await Article.findByIdAndUpdate(req.params.articleId, {
      $set: { issue: null },
    });
    return successResponse(res, 200, "Article unassigned from issue.");
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Failed to unassign article.",
      error.message,
    );
  }
};
