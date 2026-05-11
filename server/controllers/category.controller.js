// Category controller — public list + admin CRUD
import Category from "../models/category.model.js";
import Article from "../models/article.model.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.util.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

const slugify = (str) =>
  String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// GET /api/categories — list all categories (public)
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort("name");
    return successResponse(res, 200, "Categories fetched.", { categories });
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Failed to fetch categories.",
      error.message,
    );
  }
};

// GET /api/categories/:id
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return errorResponse(res, 404, "Category not found.");
    return successResponse(res, 200, "Category fetched.", { category });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch category.", error.message);
  }
};

// POST /api/categories — admin
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return errorResponse(res, 400, "Category name is required.");

    let image = { url: "", publicId: "" };
    if (req.file) {
      image = await uploadToCloudinary(req.file.buffer, "magzineer/categories");
    }

    const category = await Category.create({
      name,
      slug: slugify(name),
      description: description || "",
      image,
    });

    return successResponse(res, 201, "Category created.", { category });
  } catch (error) {
    return errorResponse(res, 500, "Failed to create category.", error.message);
  }
};

// PUT /api/categories/:id — admin
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return errorResponse(res, 404, "Category not found.");

    const { name, description } = req.body;
    if (name) {
      category.name = name;
      category.slug = slugify(name);
    }
    if (description !== undefined) category.description = description;

    if (req.file) {
      if (category.image?.publicId)
        await deleteFromCloudinary(category.image.publicId);
      category.image = await uploadToCloudinary(
        req.file.buffer,
        "magzineer/categories",
      );
    }

    await category.save();
    return successResponse(res, 200, "Category updated.", { category });
  } catch (error) {
    return errorResponse(res, 500, "Failed to update category.", error.message);
  }
};

// DELETE /api/categories/:id — admin
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return errorResponse(res, 404, "Category not found.");

    // Block deletion if any articles still reference this category
    const inUse = await Article.countDocuments({ category: category._id });
    if (inUse > 0) {
      return errorResponse(
        res,
        400,
        `Cannot delete — ${inUse} article(s) reference this category.`,
      );
    }

    if (category.image?.publicId)
      await deleteFromCloudinary(category.image.publicId);
    await category.deleteOne();
    return successResponse(res, 200, "Category deleted.");
  } catch (error) {
    return errorResponse(res, 500, "Failed to delete category.", error.message);
  }
};
