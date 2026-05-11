// Issue model — a single edition belonging to a magazine
import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    magazine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Magazine",
      required: true,
      index: true,
    },
    issueNumber: {
      type: String, // String to support formats like "Vol 12, No 4"
      required: [true, "Issue number is required."],
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    publicationDate: {
      type: Date,
      required: [true, "Publication date is required."],
    },
    cover: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    // Single-issue purchase price — set to 0 to make this issue free for everyone
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    // published / unpublished — only published issues are shown to readers
    status: {
      type: String,
      enum: ["published", "unpublished"],
      default: "unpublished",
    },
  },
  { timestamps: true },
);

// Compound unique index — an issue number must be unique within a magazine
issueSchema.index({ magazine: 1, issueNumber: 1 }, { unique: true });

const Issue = mongoose.model("Issue", issueSchema);
export default Issue;
