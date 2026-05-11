// Single-issue purchase controller — Stripe one-time Checkout sessions
import Purchase from "../models/purchase.model.js";
import Issue from "../models/issue.model.js";
import User from "../models/user.model.js";
import stripe from "../configs/stripe.config.js";
import { generateOrderId } from "../utils/orderId.util.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

// POST /api/purchases/checkout — start a one-time Checkout Session for an issue
// Body: { issueId }
export const createPurchaseCheckout = async (req, res) => {
  try {
    const { issueId } = req.body;
    const user = req.user;

    const issue = await Issue.findById(issueId).populate("magazine", "title");
    if (!issue || issue.status !== "published") {
      return errorResponse(res, 404, "Issue not found.");
    }
    if (issue.price <= 0) {
      return errorResponse(
        res,
        400,
        "This issue is free — no purchase required.",
      );
    }

    // Block duplicate purchase
    const existing = await Purchase.findOne({
      user: user._id,
      issue: issue._id,
      status: "completed",
    });
    if (existing) return errorResponse(res, 409, "You already own this issue.");

    // Reuse Stripe customer id if present
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: String(user._id) },
      });
      stripeCustomerId = customer.id;
      await User.findByIdAndUpdate(user._id, { stripeCustomerId });
    }

    const orderId = generateOrderId();

    // Create a pending Purchase record up front (status flipped by webhook)
    const purchase = await Purchase.create({
      user: user._id,
      issue: issue._id,
      amount: issue.price,
      status: "pending",
      orderId,
    });

    // One-time payment Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(issue.price * 100),
            product_data: {
              name: `${issue.magazine.title} — Issue ${issue.issueNumber}`,
              description: issue.title || "",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: {
        type: "purchase",
        userId: String(user._id),
        issueId: String(issue._id),
        purchaseId: String(purchase._id),
        orderId,
      },
    });

    // Save the session id for later webhook reconciliation
    purchase.stripeSessionId = session.id;
    await purchase.save();

    return successResponse(res, 200, "Checkout session created.", {
      url: session.url,
    });
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Failed to create checkout session.",
      error.message,
    );
  }
};

// GET /api/purchases/me — list current user's completed purchases
export const getMyPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({
      user: req.user._id,
      status: "completed",
    })
      .populate({
        path: "issue",
        select: "issueNumber title publicationDate cover magazine",
        populate: { path: "magazine", select: "title slug" },
      })
      .sort("-createdAt");

    return successResponse(res, 200, "Purchases fetched.", { purchases });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch purchases.", error.message);
  }
};
