// User model — represents readers and admins
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: 6,
      select: false, // Exclude from queries by default
    },
    profilePhoto: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" }, // Cloudinary public_id for deletion
    },
    role: {
      type: String,
      enum: ["reader", "admin"],
      default: "reader",
    },
    blocked: {
      type: Boolean,
      default: false, // Blocked users cannot log in
    },
    // Stripe customer ID — created on first checkout and reused for future transactions
    stripeCustomerId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
