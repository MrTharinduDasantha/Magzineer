// SubscriptionPlan model — the catalog of plans an admin manages
import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plan name is required."],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    // Duration of one billing cycle in months (e.g. 1 = monthly, 12 = yearly)
    durationMonths: {
      type: Number,
      required: [true, "Duration in months is required."],
      min: 1,
    },
    price: {
      type: Number,
      required: [true, "Price is required."],
      min: 0,
    },
    // Bullet-point feature list shown on the plans comparison page
    features: {
      type: [String],
      default: [],
    },
    // Inactive plans are hidden from the public site
    isActive: {
      type: Boolean,
      default: true,
    },
    // The default plan suggested to new users (only ONE plan should be default)
    isDefault: {
      type: Boolean,
      default: false,
    },
    // The Stripe Price ID created when this plan was added — used in Checkout
    stripePriceId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// Ensure at most one default plan exists. Whenever a plan is saved with isDefault: true, unset isDefault on every other plan.
subscriptionPlanSchema.pre("save", async function () {
  if (this.isModified("isDefault") && this.isDefault) {
    await mongoose
      .model("SubscriptionPlan")
      .updateMany({ _id: { $ne: this._id } }, { $set: { isDefault: false } });
  }
});

const SubscriptionPlan = mongoose.model(
  "SubscriptionPlan",
  subscriptionPlanSchema,
);
export default SubscriptionPlan;
