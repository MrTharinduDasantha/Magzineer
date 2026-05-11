// User-profile controller — profile edits and password changes
import User from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/password.util.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.util.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

// GET /api/users/profile
export const getProfile = async (req, res) => {
  try {
    return successResponse(res, 200, "Profile fetched.", { user: req.user });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch profile.", error.message);
  }
};

// PUT /api/users/profile — update name, email, profile photo
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return errorResponse(res, 404, "User not found.");

    // If email is being changed, make sure it's not already taken
    if (email && email.toLowerCase() !== user.email) {
      const taken = await User.findOne({ email: email.toLowerCase() });
      if (taken) return errorResponse(res, 409, "Email already in use.");
      user.email = email.toLowerCase();
    }

    if (name) user.name = name;

    // Handle new profile photo upload — delete old one if it exists
    if (req.file) {
      if (user.profilePhoto?.publicId) {
        await deleteFromCloudinary(user.profilePhoto.publicId);
      }
      user.profilePhoto = await uploadToCloudinary(
        req.file.buffer,
        "magzineer/profiles",
      );
    }

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    return successResponse(res, 200, "Profile updated successfully.", {
      user: userObj,
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to update profile.", error.message);
  }
};

// PUT /api/users/change-password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return errorResponse(res, 400, "Current and new passwords are required.");
    }
    if (newPassword.length < 6) {
      return errorResponse(res, 400, "Password must be at least 6 characters.");
    }

    // Fetch the user with password field explicitly included
    const user = await User.findById(req.user._id).select("+password");
    if (!user) return errorResponse(res, 404, "User not found.");

    const match = await comparePassword(currentPassword, user.password);
    if (!match)
      return errorResponse(res, 401, "Current password is incorrect.");

    user.password = await hashPassword(newPassword);
    await user.save();

    return successResponse(res, 200, "Password changed successfully.");
  } catch (error) {
    return errorResponse(res, 500, "Failed to change password.", error.message);
  }
};
