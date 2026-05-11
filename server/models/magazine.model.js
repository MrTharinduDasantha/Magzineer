// Magazine model — top-level publication that contains issues
import mongoose from "mongoose";

const magazineSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Magazine title is required."],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
    },
    cover: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    // Featured flag — used on the homepage "Featured magazines" section
    isFeatured: {
      type: Boolean,
      default: false,
    },
    // active / inactive status — inactive magazines are hidden from the public site
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

// Text index for global search
magazineSchema.index({ title: "text", description: "text" });

const Magazine = mongoose.model("Magazine", magazineSchema);
export default Magazine;
