// Admin authorization middleware — must be used AFTER authMiddleware
// Ensures the authenticated user has the "admin" role
import { errorResponse } from "../utils/response.util.js";

const adminAuthMiddleware = (req, res, next) => {
  try {
    // req.user is set by authMiddleware
    if (!req.user) {
      return errorResponse(res, 401, "Not authenticated.");
    }

    // Reject any non-admin user
    if (req.user.role !== "admin") {
      return errorResponse(
        res,
        403,
        "Access denied. Admin privileges required.",
      );
    }

    next();
  } catch (error) {
    return errorResponse(res, 500, "Authorization failed.", error.message);
  }
};

export default adminAuthMiddleware;
