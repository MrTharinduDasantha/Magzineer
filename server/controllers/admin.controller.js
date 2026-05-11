// Admin controller — dashboard stats + user management
import User from "../models/user.model.js";
import Magazine from "../models/magazine.model.js";
import Article from "../models/article.model.js";
import Issue from "../models/issue.model.js";
import Subscription from "../models/subscription.model.js";
import Purchase from "../models/purchase.model.js";
import Payment from "../models/payment.model.js";
import Bookmark from "../models/bookmark.model.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

// GET /api/admin/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    // ── Summary counts ───────────────────────────────────────
    const [
      totalMagazines,
      totalArticles,
      totalUsers,
      activeSubscribers,
      totalIssues,
    ] = await Promise.all([
      Magazine.countDocuments(),
      Article.countDocuments(),
      User.countDocuments({ role: "reader" }),
      Subscription.countDocuments({
        status: "active",
        endDate: { $gt: new Date() },
      }),
      Issue.countDocuments(),
    ]);

    // ── Revenue totals ───────────────────────────────────────
    const revenueAgg = await Payment.aggregate([
      { $match: { status: "succeeded" } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const subscriptionRevenue =
      revenueAgg.find((r) => r._id === "subscription")?.total || 0;
    const purchaseRevenue =
      revenueAgg.find((r) => r._id === "purchase")?.total || 0;
    const totalRevenue = subscriptionRevenue + purchaseRevenue;

    // ── Recent orders (last 10 payments) ─────────────────────
    const recentOrders = await Payment.find({ status: "succeeded" })
      .populate("user", "name email")
      .sort("-createdAt")
      .limit(10);

    // ── Subscriber growth over last 14 days ──────────────────
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const subscriberGrowth = await Subscription.aggregate([
      { $match: { createdAt: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // ── Revenue trend over last 14 days ──────────────────────
    const revenueTrend = await Payment.aggregate([
      {
        $match: {
          status: "succeeded",
          createdAt: { $gte: fourteenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return successResponse(res, 200, "Dashboard stats fetched.", {
      summary: {
        totalMagazines,
        totalIssues,
        totalArticles,
        totalUsers,
        activeSubscribers,
        totalRevenue,
        subscriptionRevenue,
        purchaseRevenue,
      },
      recentOrders,
      subscriberGrowth,
      revenueTrend,
    });
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Failed to fetch dashboard stats.",
      error.message,
    );
  }
};

// GET /api/admin/users — search + paginate
export const getAllUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = { role: "reader" };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(query).sort("-createdAt").skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);

    return successResponse(res, 200, "Users fetched.", {
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch users.", error.message);
  }
};

// GET /api/admin/users/:id — user detail with subscription/purchases/bookmark count
export const getUserDetail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 404, "User not found.");

    const [subscription, purchases, bookmarksCount] = await Promise.all([
      Subscription.findOne({ user: user._id })
        .populate("plan")
        .sort("-createdAt"),
      Purchase.find({ user: user._id, status: "completed" })
        .populate({
          path: "issue",
          select: "issueNumber title cover magazine",
          populate: { path: "magazine", select: "title" },
        })
        .sort("-createdAt"),
      Bookmark.countDocuments({ user: user._id }),
    ]);

    return successResponse(res, 200, "User detail fetched.", {
      user,
      subscription,
      purchases,
      bookmarksCount,
    });
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Failed to fetch user detail.",
      error.message,
    );
  }
};

// PATCH /api/admin/users/:id/toggle-block — block or unblock a reader
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 404, "User not found.");
    if (user.role === "admin") {
      return errorResponse(res, 400, "Cannot block an admin account.");
    }

    user.blocked = !user.blocked;
    await user.save();

    return successResponse(
      res,
      200,
      user.blocked ? "User blocked." : "User unblocked.",
      { user },
    );
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Failed to toggle block status.",
      error.message,
    );
  }
};
