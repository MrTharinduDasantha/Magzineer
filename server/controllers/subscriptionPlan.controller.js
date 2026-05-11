// Subscription Plan controller — admin CRUD that also syncs with Stripe Products/Prices
import SubscriptionPlan from "../models/subscriptionPlan.model.js";
import stripe from "../configs/stripe.config.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

// ─────────────────────────── PUBLIC ───────────────────────────

// GET /api/plans — active plans only (for the public plans comparison page)
export const getActivePlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ isActive: true }).sort("price");
    return successResponse(res, 200, "Plans fetched.", { plans });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch plans.", error.message);
  }
};

// GET /api/plans/default — the plan suggested to new users
export const getDefaultPlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findOne({
      isActive: true,
      isDefault: true,
    });
    return successResponse(res, 200, "Default plan fetched.", { plan });
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Failed to fetch default plan.",
      error.message,
    );
  }
};

// ─────────────────────────── ADMIN ────────────────────────────

// GET /api/plans/admin/all
export const adminGetAllPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find().sort("-createdAt");
    return successResponse(res, 200, "All plans fetched.", { plans });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch plans.", error.message);
  }
};

// POST /api/plans — create plan AND its corresponding Stripe Product+Price
export const createPlan = async (req, res) => {
  try {
    const {
      name,
      description,
      durationMonths,
      price,
      features,
      isActive,
      isDefault,
    } = req.body;

    if (!name || !durationMonths || price === undefined) {
      return errorResponse(res, 400, "Name, duration, and price are required.");
    }

    // Stripe expects recurring intervals — we map durationMonths to month-count
    const stripeProduct = await stripe.products.create({
      name,
      description: description || "",
    });

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(Number(price) * 100), // dollars → cents
      currency: "usd",
      recurring: {
        interval: "month",
        interval_count: Number(durationMonths),
      },
    });

    const plan = await SubscriptionPlan.create({
      name,
      description: description || "",
      durationMonths: Number(durationMonths),
      price: Number(price),
      features: Array.isArray(features)
        ? features
        : features
          ? JSON.parse(features)
          : [],
      isActive: isActive !== undefined ? isActive : true,
      isDefault: isDefault === true || isDefault === "true",
      stripePriceId: stripePrice.id,
    });

    return successResponse(res, 201, "Plan created.", { plan });
  } catch (error) {
    return errorResponse(res, 500, "Failed to create plan.", error.message);
  }
};

// PUT /api/plans/:id — update plan
// Note: Stripe doesn't allow editing an existing Price — if the price changes
// we create a new Stripe Price and store the new id (the old one stays active for any existing subscriptions until they renew/change).
export const updatePlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) return errorResponse(res, 404, "Plan not found.");

    const {
      name,
      description,
      durationMonths,
      price,
      features,
      isActive,
      isDefault,
    } = req.body;

    if (name) plan.name = name;
    if (description !== undefined) plan.description = description;
    if (features !== undefined) {
      plan.features = Array.isArray(features) ? features : JSON.parse(features);
    }
    if (isActive !== undefined)
      plan.isActive = isActive === true || isActive === "true";
    if (isDefault !== undefined)
      plan.isDefault = isDefault === true || isDefault === "true";

    // If price OR duration changed, create a new Stripe Price
    const priceChanged = price !== undefined && Number(price) !== plan.price;
    const durationChanged =
      durationMonths !== undefined &&
      Number(durationMonths) !== plan.durationMonths;

    if (priceChanged || durationChanged) {
      const newStripePrice = await stripe.prices.create({
        product: (await stripe.prices.retrieve(plan.stripePriceId)).product,
        unit_amount: Math.round(Number(price ?? plan.price) * 100),
        currency: "usd",
        recurring: {
          interval: "month",
          interval_count: Number(durationMonths ?? plan.durationMonths),
        },
      });
      plan.stripePriceId = newStripePrice.id;
      if (priceChanged) plan.price = Number(price);
      if (durationChanged) plan.durationMonths = Number(durationMonths);
    }

    await plan.save();
    return successResponse(res, 200, "Plan updated.", { plan });
  } catch (error) {
    return errorResponse(res, 500, "Failed to update plan.", error.message);
  }
};

// DELETE /api/plans/:id — archive on Stripe and remove from DB
export const deletePlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) return errorResponse(res, 404, "Plan not found.");

    // Archive the Stripe Price (Stripe doesn't allow true delete)
    try {
      await stripe.prices.update(plan.stripePriceId, { active: false });
    } catch (_) {
      // Ignore Stripe archive failure — proceed with DB delete
    }

    await plan.deleteOne();
    return successResponse(res, 200, "Plan deleted.");
  } catch (error) {
    return errorResponse(res, 500, "Failed to delete plan.", error.message);
  }
};

// PATCH /api/plans/:id/toggle-status
export const togglePlanStatus = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) return errorResponse(res, 404, "Plan not found.");
    plan.isActive = !plan.isActive;
    await plan.save();
    return successResponse(
      res,
      200,
      `Plan ${plan.isActive ? "activated" : "deactivated"}.`,
      { plan },
    );
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Failed to toggle plan status.",
      error.message,
    );
  }
};

// PATCH /api/plans/:id/set-default — set as the default plan
export const setDefaultPlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) return errorResponse(res, 404, "Plan not found.");
    plan.isDefault = true;
    await plan.save(); // pre-save hook unsets isDefault on every other plan
    return successResponse(res, 200, "Default plan updated.", { plan });
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Failed to set default plan.",
      error.message,
    );
  }
};
