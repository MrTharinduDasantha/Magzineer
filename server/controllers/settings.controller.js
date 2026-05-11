// Settings controller — singleton site settings (logo, address, phone, email, social links)
import Settings from "../models/settings.model.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.util.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

// Helper — fetch the singleton, creating it if it doesn't exist
const getOrCreateSettings = async () => {
  let settings = await Settings.findOne({ singleton: "main" });
  if (!settings) {
    settings = await Settings.create({ singleton: "main" });
  }
  return settings;
};

// GET /api/settings — public (footer + general info)
export const getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    return successResponse(res, 200, "Settings fetched.", { settings });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch settings.", error.message);
  }
};

// PUT /api/settings — admin update
export const updateSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    const {
      siteName,
      address,
      phone,
      email,
      facebook,
      twitter,
      instagram,
      linkedin,
      youtube,
    } = req.body;

    if (siteName !== undefined) settings.siteName = siteName;
    if (address !== undefined) settings.address = address;
    if (phone !== undefined) settings.phone = phone;
    if (email !== undefined) settings.email = email;

    // Social links — only overwrite the keys that are present in the payload
    settings.socialLinks = {
      facebook:
        facebook !== undefined ? facebook : settings.socialLinks.facebook,
      twitter: twitter !== undefined ? twitter : settings.socialLinks.twitter,
      instagram:
        instagram !== undefined ? instagram : settings.socialLinks.instagram,
      linkedin:
        linkedin !== undefined ? linkedin : settings.socialLinks.linkedin,
      youtube: youtube !== undefined ? youtube : settings.socialLinks.youtube,
    };

    // Logo replacement
    if (req.file) {
      if (settings.logo?.publicId)
        await deleteFromCloudinary(settings.logo.publicId);
      settings.logo = await uploadToCloudinary(
        req.file.buffer,
        "magzineer/settings",
      );
    }

    await settings.save();
    return successResponse(res, 200, "Settings updated.", { settings });
  } catch (error) {
    return errorResponse(res, 500, "Failed to update settings.", error.message);
  }
};
