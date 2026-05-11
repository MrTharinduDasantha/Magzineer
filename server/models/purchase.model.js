// Purchase model — records a one-time single-issue purchase
import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    // Stripe Checkout Session ID — used to reconcile webhook events
    stripeSessionId: {
      type: String,
      default: "",
    },
    // Custom human-readable order ID (e.g. "MZ-A1B2C3")
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

// One user can only purchase a given issue once (deduplicate at the DB level)
purchaseSchema.index(
  { user: 1, issue: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "completed" },
  },
);

const Purchase = mongoose.model("Purchase", purchaseSchema);
export default Purchase;
