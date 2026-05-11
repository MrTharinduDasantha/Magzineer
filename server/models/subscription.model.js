// Subscription model — represents a user's relationship to a plan over time
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired", "pending"],
      default: "pending",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    // Date at which the current billing period ends — used to gate access
    endDate: {
      type: Date,
      required: true,
    },
    // Stripe references — populated/updated by webhook events
    stripeSubscriptionId: {
      type: String,
      default: "",
    },
    stripeCustomerId: {
      type: String,
      default: "",
    },
    // True if the user has cancelled but the period hasn't ended yet
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
