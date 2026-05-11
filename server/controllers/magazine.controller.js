// Magazine controller — public listing/detail + admin CRUD
import Magazine from "../models/magazine.model.js";
import Issue from "../models/issue.model.js";
import Article from "../models/article.model.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.util.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

// Simple slug helper — lowercases, replaces spaces and non-word chars with hyphens
const slugify = (str) =>
  String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// ─────────────────────────── PUBLIC ───────────────────────────

// GET /api/magazines — list active magazines (with optional search/sort)
export const getAllMagazines = async (req, res) => {
  try {
    const { search, sort = "-createdAt" } = req.query;
    const query = { status: "active" };
    if (search) query.title = { $regex: search, $options: "i" };

    const magazines = await Magazine.find(query).sort(sort);
    return successResponse(res, 200, "Magazines fetched.", { magazines });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch magazines.", error.message);
  }
};

// GET /api/magazines/featured — homepage featured strip
export const getFeaturedMagazines = async (req, res) => {
  try {
    const magazines = await Magazine.find({
      status: "active",
      isFeatured: true,
    })
      .sort("-createdAt")
      .limit(6);
    return successResponse(res, 200, "Featured magazines fetched.", {
      magazines,
    });
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Failed to fetch featured magazines.",
      error.message,
    );
  }
};

// GET /api/magazines/:id — magazine detail with latest issue + all issues
export const getMagazineById = async (req, res) => {
  try {
    const magazine = await Magazine.findById(req.params.id);
    if (!magazine || magazine.status !== "active") {
      return errorResponse(res, 404, "Magazine not found.");
    }

    // Latest published issue (most recent by publicationDate)
    const latestIssue = await Issue.findOne({
      magazine: magazine._id,
      status: "published",
    }).sort("-publicationDate");

    // All published issues
    const issues = await Issue.find({
      magazine: magazine._id,
      status: "published",
    }).sort("-publicationDate");

    return successResponse(res, 200, "Magazine detail fetched.", {
      magazine,
      latestIssue,
      issues,
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch magazine.", error.message);
  }
};

// ─────────────────────────── ADMIN ────────────────────────────

// GET /api/magazines/admin/all
export const adminGetAllMagazines = async (req, res) => {
  try {
    const { search, sort = "-createdAt" } = req.query;
    const query = {};
    if (search) query.title = { $regex: search, $options: "i" };
    const magazines = await Magazine.find(query).sort(sort);
    return successResponse(res, 200, "All magazines fetched.", { magazines });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch magazines.", error.message);
  }
};

// POST /api/magazines — create
export const createMagazine = async (req, res) => {
  try {
    const { title, description, isFeatured } = req.body;

    if (!title || !description) {
      return errorResponse(res, 400, "Title and description are required.");
    }
    if (!req.file) return errorResponse(res, 400, "Cover image is required.");

    const cover = await uploadToCloudinary(
      req.file.buffer,
      "magzineer/magazines",
    );

    const magazine = await Magazine.create({
      title,
      slug: slugify(title),
      description,
      cover,
      isFeatured: isFeatured === "true" || isFeatured === true,
    });

    return successResponse(res, 201, "Magazine created.", { magazine });
  } catch (error) {
    return errorResponse(res, 500, "Failed to create magazine.", error.message);
  }
};

// PUT /api/magazines/:id — update
export const updateMagazine = async (req, res) => {
  try {
    const { title, description, isFeatured, status } = req.body;
    const magazine = await Magazine.findById(req.params.id);
    if (!magazine) return errorResponse(res, 404, "Magazine not found.");

    if (title) {
      magazine.title = title;
      magazine.slug = slugify(title);
    }
    if (description) magazine.description = description;
    if (isFeatured !== undefined)
      magazine.isFeatured = isFeatured === "true" || isFeatured === true;
    if (status) magazine.status = status;

    // Replace cover image if a new one was uploaded
    if (req.file) {
      if (magazine.cover?.publicId)
        await deleteFromCloudinary(magazine.cover.publicId);
      magazine.cover = await uploadToCloudinary(
        req.file.buffer,
        "magzineer/magazines",
      );
    }

    await magazine.save();
    return successResponse(res, 200, "Magazine updated.", { magazine });
  } catch (error) {
    return errorResponse(res, 500, "Failed to update magazine.", error.message);
  }
};

// DELETE /api/magazines/:id
export const deleteMagazine = async (req, res) => {
  try {
    const magazine = await Magazine.findById(req.params.id);
    if (!magazine) return errorResponse(res, 404, "Magazine not found.");

    // Refuse deletion if there are issues/articles still attached
    const issueCount = await Issue.countDocuments({ magazine: magazine._id });
    const articleCount = await Article.countDocuments({
      magazine: magazine._id,
    });
    if (issueCount > 0 || articleCount > 0) {
      return errorResponse(
        res,
        400,
        "Cannot delete — this magazine has associated issues or articles. Please remove them first.",
      );
    }

    if (magazine.cover?.publicId)
      await deleteFromCloudinary(magazine.cover.publicId);
    await magazine.deleteOne();

    return successResponse(res, 200, "Magazine deleted.");
  } catch (error) {
    return errorResponse(res, 500, "Failed to delete magazine.", error.message);
  }
};

// PATCH /api/magazines/:id/toggle-status — flip active/inactive
export const toggleMagazineStatus = async (req, res) => {
  try {
    const magazine = await Magazine.findById(req.params.id);
    if (!magazine) return errorResponse(res, 404, "Magazine not found.");

    magazine.status = magazine.status === "active" ? "inactive" : "active";
    await magazine.save();

    return successResponse(res, 200, `Magazine ${magazine.status}.`, {
      magazine,
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to toggle status.", error.message);
  }
};
