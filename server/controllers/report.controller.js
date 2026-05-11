// Report controller — admin analytics endpoints + PDF export
import Article from "../models/article.model.js";
import Subscription from "../models/subscription.model.js";
import Payment from "../models/payment.model.js";
import { generateRevenuePDF } from "../utils/pdf.util.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

// GET /api/reports/most-read?limit=10
export const getMostReadArticles = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const articles = await Article.find({ status: "published" })
      .populate("magazine", "title")
      .populate("category", "name")
      .sort("-views")
      .limit(limit)
      .select("title author views magazine category readingTime createdAt");

    return successResponse(res, 200, "Most-read articles fetched.", {
      articles,
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch report.", error.message);
  }
};

// GET /api/reports/top-subscribers?limit=10
// Returns users ranked by total amount spent on subscriptions + purchases.
export const getTopSubscribers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;

    const topSpenders = await Payment.aggregate([
      { $match: { status: "succeeded" } },
      {
        $group: {
          _id: "$user",
          totalSpent: { $sum: "$amount" },
          paymentsCount: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          email: "$user.email",
          profilePhoto: "$user.profilePhoto",
          totalSpent: 1,
          paymentsCount: 1,
        },
      },
    ]);

    return successResponse(res, 200, "Top subscribers fetched.", {
      topSpenders,
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch report.", error.message);
  }
};

// GET /api/reports/revenue?period=daily|weekly|monthly&from=&to=
export const getRevenueReport = async (req, res) => {
  try {
    const { period = "daily", from, to } = req.query;

    // Default range: last 30 days
    const endDate = to ? new Date(to) : new Date();
    const startDate = from
      ? new Date(from)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Date-group format string for the requested period
    const formatMap = {
      daily: "%Y-%m-%d",
      weekly: "%Y-W%V",
      monthly: "%Y-%m",
    };
    const dateFormat = formatMap[period] || "%Y-%m-%d";

    const revenueByPeriod = await Payment.aggregate([
      {
        $match: {
          status: "succeeded",
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            period: {
              $dateToString: { format: dateFormat, date: "$createdAt" },
            },
            type: "$type",
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.period": 1 } },
    ]);

    // Aggregate totals
    const totals = await Payment.aggregate([
      {
        $match: {
          status: "succeeded",
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const subscriptionTotal =
      totals.find((t) => t._id === "subscription")?.total || 0;
    const purchaseTotal = totals.find((t) => t._id === "purchase")?.total || 0;

    return successResponse(res, 200, "Revenue report fetched.", {
      period,
      from: startDate,
      to: endDate,
      totals: {
        subscription: subscriptionTotal,
        purchase: purchaseTotal,
        grandTotal: subscriptionTotal + purchaseTotal,
      },
      revenueByPeriod,
    });
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Failed to fetch revenue report.",
      error.message,
    );
  }
};

// GET /api/reports/revenue/export?from=&to=
// Streams a branded PDF directly to the response
export const exportRevenuePDF = async (req, res) => {
  try {
    const { from, to } = req.query;
    const endDate = to ? new Date(to) : new Date();
    const startDate = from
      ? new Date(from)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Fetch all succeeded payments in the range
    const payments = await Payment.find({
      status: "succeeded",
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .populate("user", "name email")
      .sort("-createdAt");

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const subscriptionRevenue = payments
      .filter((p) => p.type === "subscription")
      .reduce((sum, p) => sum + p.amount, 0);
    const purchaseRevenue = totalRevenue - subscriptionRevenue;

    // Map payments to PDF rows
    const rows = payments.map((p) => ({
      date: new Date(p.createdAt).toLocaleDateString(),
      type: p.type,
      user: p.user?.name || p.user?.email || "Unknown",
      amount: p.amount,
      status: p.status,
    }));

    generateRevenuePDF(res, {
      title: "Revenue Report",
      period: `${startDate.toLocaleDateString()} – ${endDate.toLocaleDateString()}`,
      totalRevenue,
      subscriptionRevenue,
      purchaseRevenue,
      totalOrders: payments.length,
      rows,
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to export PDF.", error.message);
  }
};
