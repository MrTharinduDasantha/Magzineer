// Settings model — singleton document holding site-wide configuration
import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    // Marker that enforces singleton behavior (only one settings document)
    singleton: {
      type: String,
      default: "main",
      unique: true,
    },
    logo: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    siteName: {
      type: String,
      default: "Magzineer",
    },
    address: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    socialLinks: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
