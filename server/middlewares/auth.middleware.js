// Authentication middleware — verifies JWT and ensures the user is not blocked
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorResponse } from "../utils/response.util.js";

const authMiddleware = async (req, res, next) => {
  try {
    // Extract the JWT from HTTP-only cookies
    const token = req.cookies?.token;

    if (!token) {
      return errorResponse(res, 401, "Not authenticated. Please log in.");
    }

    // Verify the token using the JWT secret from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database (excluding the password field)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return errorResponse(
        res,
        401,
        "User no longer exists. Please log in again.",
      );
    }

    // Reject the request if the user has been blocked by an admin
    if (user.blocked) {
      return errorResponse(
        res,
        403,
        "Your account has been blocked. Please contact support.",
      );
    }

    // Attach the user object to the request for downstream handlers
    req.user = user;
    next();
  } catch (error) {
    // Handle expired or malformed tokens
    if (error.name === "TokenExpiredError") {
      return errorResponse(res, 401, "Session expired. Please log in again.");
    }
    if (error.name === "JsonWebTokenError") {
      return errorResponse(res, 401, "Invalid token. Please log in again.");
    }
    return errorResponse(res, 500, "Authentication failed.", error.message);
  }
};

export default authMiddleware;
