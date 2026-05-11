// Authentication controller — handles reader register/login, admin login (from .env), and logout
import User from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/password.util.js";
import {
  generateToken,
  setTokenCookie,
  clearTokenCookie,
} from "../utils/token.util.js";
import { uploadToCloudinary } from "../utils/cloudinary.util.js";
import { sendWelcomeEmail } from "../utils/email.util.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

// ─────────────────────────────────────────────────────────────
// POST /api/auth/register — Reader registration
// ─────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 400, "Name, email, and password are required.");
    }

    // Check for an existing user with this email
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return errorResponse(
        res,
        409,
        "An account with this email already exists.",
      );
    }

    // Upload profile photo to Cloudinary (optional)
    let profilePhoto = { url: "", publicId: "" };
    if (req.file) {
      profilePhoto = await uploadToCloudinary(
        req.file.buffer,
        "magzineer/profiles",
      );
    }

    // Hash the password and create the user
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      profilePhoto,
      role: "reader",
    });

    // Sign a JWT and attach it as an HTTP-only cookie
    const token = generateToken({ id: user._id, role: user.role });
    setTokenCookie(res, token);

    // Fire-and-forget welcome email (we don't block the response)
    sendWelcomeEmail(user.email, user.name);

    // Strip the password field before returning the user
    const userObj = user.toObject();
    delete userObj.password;

    return successResponse(res, 201, "Registration successful.", {
      user: userObj,
    });
  } catch (error) {
    return errorResponse(res, 500, "Registration failed.", error.message);
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/auth/login — Reader login
// ─────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, "Email and password are required.");
    }

    // Pull the password explicitly (it's `select: false` in the schema)
    const user = await User.findOne({
      email: email.toLowerCase(),
      role: "reader",
    }).select("+password");

    if (!user) return errorResponse(res, 401, "Invalid credentials.");

    if (user.blocked) {
      return errorResponse(
        res,
        403,
        "Your account has been blocked. Please contact support.",
      );
    }

    const match = await comparePassword(password, user.password);
    if (!match) return errorResponse(res, 401, "Invalid credentials.");

    const token = generateToken({ id: user._id, role: user.role });
    setTokenCookie(res, token);

    const userObj = user.toObject();
    delete userObj.password;

    return successResponse(res, 200, "Login successful.", { user: userObj });
  } catch (error) {
    return errorResponse(res, 500, "Login failed.", error.message);
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/auth/admin-login — Admin login
// Credentials live in .env (ADMIN_EMAIL_LOGIN / ADMIN_PASSWORD_LOGIN).
// On first successful login, an admin user record is auto-created in the DB so the rest of the app can reference admin actions by user id.
// ─────────────────────────────────────────────────────────────
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, "Email and password are required.");
    }

    const envEmail = process.env.ADMIN_EMAIL_LOGIN;
    const envPassword = process.env.ADMIN_PASSWORD_LOGIN;

    // Compare against .env (case-insensitive on email)
    if (
      email.toLowerCase() !== (envEmail || "").toLowerCase() ||
      password !== envPassword
    ) {
      return errorResponse(res, 401, "Invalid admin credentials.");
    }

    // Find or create the admin user record in the database
    let admin = await User.findOne({
      email: envEmail.toLowerCase(),
      role: "admin",
    });

    if (!admin) {
      // We hash the env password for storage even though we authenticate via env
      const hashedPassword = await hashPassword(password);
      admin = await User.create({
        name: "Administrator",
        email: envEmail.toLowerCase(),
        password: hashedPassword,
        role: "admin",
      });
    }

    const token = generateToken({ id: admin._id, role: admin.role });
    setTokenCookie(res, token);

    const adminObj = admin.toObject();
    delete adminObj.password;

    return successResponse(res, 200, "Admin login successful.", {
      user: adminObj,
    });
  } catch (error) {
    return errorResponse(res, 500, "Admin login failed.", error.message);
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/auth/logout — clear the auth cookie
// ─────────────────────────────────────────────────────────────
export const logout = async (req, res) => {
  try {
    clearTokenCookie(res);
    return successResponse(res, 200, "Logged out successfully.");
  } catch (error) {
    return errorResponse(res, 500, "Logout failed.", error.message);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/auth/me — return the current authenticated user
// (requires authMiddleware)
// ─────────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    return successResponse(res, 200, "Current user fetched.", {
      user: req.user,
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch user.", error.message);
  }
};
