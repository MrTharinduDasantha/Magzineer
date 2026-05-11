// Subscription controller — checkout session creation + cancel + upgrade/downgrade
import Subscription from "../models/subscription.model.js";
import SubscriptionPlan from "../models/subscriptionPlan.model.js";
import User from "../models/user.model.js";
import stripe from "../configs/stripe.config.js";
import { sendSubscriptionCancellation } from "../utils/email.util.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

// POST /api/subscriptions/checkout — create a Stripe Checkout Session in subscription mode
// Body: { planId }
export const createSubscriptionCheckout = async (req, res) => {
  try {
    const { planId } = req.body;
    const user = req.user;

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan || !plan.isActive) {
      return errorResponse(res, 404, "Plan not found or inactive.");
    }

    // Reuse existing Stripe customer id, or create a new one for this user
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

    // Create the Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: {
        type: "subscription",
        userId: String(user._id),
        planId: String(plan._id),
      },
    });

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

// GET /api/subscriptions/me — current user's active/most-recent subscription
export const getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id })
      .populate("plan")
      .sort("-createdAt");

    return successResponse(res, 200, "Subscription fetched.", { subscription });
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Failed to fetch subscription.",
      error.message,
    );
  }
};

// POST /api/subscriptions/cancel — schedule cancellation at period end
export const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: "active",
    });

    if (!subscription)
      return errorResponse(res, 404, "No active subscription found.");

    // Tell Stripe to cancel at the end of the current billing period
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    subscription.cancelAtPeriodEnd = true;
    await subscription.save();

    // Notify the user
    sendSubscriptionCancellation(
      req.user.email,
      req.user.name,
      subscription.endDate,
    );

    return successResponse(
      res,
      200,
      "Subscription will be cancelled at the end of the current billing period.",
      { subscription },
    );
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Failed to cancel subscription.",
      error.message,
    );
  }
};

// POST /api/subscriptions/change — upgrade or downgrade
// Body: { planId } — switches the existing Stripe subscription to a new price (prorated)
export const changeSubscription = async (req, res) => {
  try {
    const { planId } = req.body;

    const [subscription, newPlan] = await Promise.all([
      Subscription.findOne({ user: req.user._id, status: "active" }),
      SubscriptionPlan.findById(planId),
    ]);

    if (!subscription)
      return errorResponse(res, 404, "No active subscription found.");
    if (!newPlan || !newPlan.isActive)
      return errorResponse(res, 404, "Plan not found or inactive.");

    // Retrieve the current Stripe subscription to find its first item id
    const stripeSub = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId,
    );
    const itemId = stripeSub.items.data[0].id;

    // Update the subscription item to point to the new price (with proration)
    const updated = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        items: [{ id: itemId, price: newPlan.stripePriceId }],
        proration_behavior: "create_prorations",
        cancel_at_period_end: false,
      },
    );

    subscription.plan = newPlan._id;
    subscription.cancelAtPeriodEnd = false;
    subscription.endDate = new Date(updated.current_period_end * 1000);
    await subscription.save();

    return successResponse(res, 200, "Subscription updated.", { subscription });
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Failed to change subscription.",
      error.message,
    );
  }
};
