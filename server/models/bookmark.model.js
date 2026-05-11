// Bookmark model — saved articles for a logged-in user
import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
  },
  { timestamps: true },
);

// A user can only bookmark a given article once
bookmarkSchema.index({ user: 1, article: 1 }, { unique: true });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
export default Bookmark;
