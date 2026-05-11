// Article model — the actual content unit. Can be free or premium (paywalled).
import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Article title is required."],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required."],
      trim: true,
    },
    // Rich HTML content produced by the admin React Quill editor
    content: {
      type: String,
      required: [true, "Content is required."],
    },
    featuredImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    author: {
      type: String,
      required: [true, "Author name is required."],
      trim: true,
    },
    magazine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Magazine",
      required: true,
      index: true,
    },
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      default: null, // Articles can exist unassigned (drag-and-drop later)
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    // Estimated reading time in minutes — auto-computed from content (~200 wpm)
    readingTime: {
      type: Number,
      default: 1,
      min: 1,
    },
    // free   → entire content is visible to everyone
    // premium → only excerpt visible unless user has subscription OR has bought the issue
    accessLevel: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
    status: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "draft",
    },
    // For "scheduled" status — the moment at which the article goes live
    scheduledAt: {
      type: Date,
      default: null,
    },
    // Total view count for trending-articles logic
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Text index for global search across articles
articleSchema.index({ title: "text", excerpt: "text", author: "text" });

const Article = mongoose.model("Article", articleSchema);
export default Article;
