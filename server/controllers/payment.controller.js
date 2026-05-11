// Payment ledger controller — user payment history + admin full list
import Payment from "../models/payment.model.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

// GET /api/payments/me — current user's payment history (subscriptions + purchases)
export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).sort(
      "-createdAt",
    );
    return successResponse(res, 200, "Payment history fetched.", { payments });
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Failed to fetch payment history.",
      error.message,
    );
  }
};

// GET /api/payments/admin/all — admin view with filters
// Query: ?type=subscription|purchase&status=...&user=...&from=...&to=...&page=&limit=
export const adminGetAllPayments = async (req, res) => {
  try {
    const { type, status, user, from, to, page = 1, limit = 20 } = req.query;
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (user) query.user = user;
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [payments, total] = await Promise.all([
      Payment.find(query)
        .populate("user", "name email")
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit)),
      Payment.countDocuments(query),
    ]);

    return successResponse(res, 200, "Payments fetched.", {
      payments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch payments.", error.message);
  }
};
