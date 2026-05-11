// ReadingHistory model — tracks each user's most recently viewed articles
import mongoose from "mongoose";

const readingHistorySchema = new mongoose.Schema(
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
    // The most recent time the user opened this article
    lastReadAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// A single user-article pair has exactly one history record — we update lastReadAt instead of creating duplicates
readingHistorySchema.index({ user: 1, article: 1 }, { unique: true });

// Optional TTL — auto-prune reading history entries older than 90 days.
// Comment out the next line if you'd rather keep history forever.
readingHistorySchema.index(
  { lastReadAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 90 },
);

const ReadingHistory = mongoose.model("ReadingHistory", readingHistorySchema);
export default ReadingHistory;
