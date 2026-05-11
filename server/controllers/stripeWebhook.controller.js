// Stripe webhook controller — verifies signature and routes events
// Mounted with express.raw({ type: "application/json" }) so the raw body is available for signature verification.
import stripe from "../configs/stripe.config.js";
import Subscription from "../models/subscription.model.js";
import SubscriptionPlan from "../models/subscriptionPlan.model.js";
import Purchase from "../models/purchase.model.js";
import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import Issue from "../models/issue.model.js";
import { generateOrderId } from "../utils/orderId.util.js";
import {
  sendSubscriptionConfirmation,
  sendPurchaseReceipt,
} from "../utils/email.util.js";

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    // Verify the event came from Stripe using our webhook secret
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error(
      "⚠️  Stripe webhook signature verification failed:",
      err.message,
    );
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      // ─────────────────────────────────────────────────────────
      // Initial checkout completion (subscription OR purchase)
      // ─────────────────────────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object;
        const { type, userId, planId, issueId, purchaseId, orderId } =
          session.metadata || {};

        if (type === "subscription") {
          await handleSubscriptionCheckout(session, userId, planId);
        } else if (type === "purchase") {
          await handlePurchaseCheckout(
            session,
            userId,
            issueId,
            purchaseId,
            orderId,
          );
        }
        break;
      }

      // ─────────────────────────────────────────────────────────
      // Subscription renewal — invoice was paid
      // ─────────────────────────────────────────────────────────
      case "invoice.paid": {
        const invoice = event.data.object;
        await handleInvoicePaid(invoice);
        break;
      }

      // ─────────────────────────────────────────────────────────
      // Subscription updated (plan change, status change)
      // ─────────────────────────────────────────────────────────
      case "customer.subscription.updated": {
        const sub = event.data.object;
        await handleSubscriptionUpdated(sub);
        break;
      }

      // ─────────────────────────────────────────────────────────
      // Subscription cancelled (period ended)
      // ─────────────────────────────────────────────────────────
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: sub.id },
          { $set: { status: "cancelled", cancelAtPeriodEnd: false } },
        );
        break;
      }

      // ─────────────────────────────────────────────────────────
      // Failed payment
      // ─────────────────────────────────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          await Subscription.findOneAndUpdate(
            { stripeSubscriptionId: invoice.subscription },
            { $set: { status: "expired" } },
          );
        }
        break;
      }

      default:
        // Ignored events
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    res.status(500).json({ error: "Webhook handler failed." });
  }
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const handleSubscriptionCheckout = async (session, userId, planId) => {
  if (!session.subscription) return;

  // Retrieve the full Stripe subscription to read its period dates
  const stripeSub = await stripe.subscriptions.retrieve(session.subscription);
  const plan = await SubscriptionPlan.findById(planId);
  const user = await User.findById(userId);
  if (!plan || !user) return;

  // Upsert the Subscription record (idempotent — re-runs do nothing harmful)
  const subscription = await Subscription.findOneAndUpdate(
    { stripeSubscriptionId: stripeSub.id },
    {
      $set: {
        user: user._id,
        plan: plan._id,
        status: "active",
        startDate: new Date(stripeSub.current_period_start * 1000),
        endDate: new Date(stripeSub.current_period_end * 1000),
        stripeSubscriptionId: stripeSub.id,
        stripeCustomerId: stripeSub.customer,
        cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
      },
    },
    { upsert: true, new: true },
  );

  // Create a Payment ledger entry
  await Payment.create({
    user: user._id,
    type: "subscription",
    relatedId: subscription._id,
    amount: plan.price,
    currency: "usd",
    status: "succeeded",
    stripeRef: session.payment_intent || session.id,
    orderId: generateOrderId(),
    paidAt: new Date(),
  });

  // Email the user
  sendSubscriptionConfirmation(
    user.email,
    user.name,
    plan.name,
    subscription.endDate,
  );
};

const handlePurchaseCheckout = async (
  session,
  userId,
  issueId,
  purchaseId,
  orderId,
) => {
  // Mark the pending Purchase record as completed
  const purchase = await Purchase.findByIdAndUpdate(
    purchaseId,
    {
      $set: {
        status: "completed",
        stripeSessionId: session.id,
      },
    },
    { new: true },
  );
  if (!purchase) return;

  // Create the Payment ledger entry
  await Payment.create({
    user: userId,
    type: "purchase",
    relatedId: purchase._id,
    amount: purchase.amount,
    currency: "usd",
    status: "succeeded",
    stripeRef: session.payment_intent || session.id,
    orderId: purchase.orderId || orderId,
    paidAt: new Date(),
  });

  // Email a receipt
  const [user, issue] = await Promise.all([
    User.findById(userId),
    Issue.findById(issueId).populate("magazine", "title"),
  ]);
  if (user && issue) {
    const title = `${issue.magazine.title} — Issue ${issue.issueNumber}`;
    sendPurchaseReceipt(
      user.email,
      user.name,
      title,
      purchase.amount,
      purchase.orderId,
    );
  }
};

const handleInvoicePaid = async (invoice) => {
  if (!invoice.subscription) return;

  // Extend the subscription's endDate to the new period_end
  const stripeSub = await stripe.subscriptions.retrieve(invoice.subscription);
  const subscription = await Subscription.findOneAndUpdate(
    { stripeSubscriptionId: stripeSub.id },
    {
      $set: {
        status: "active",
        endDate: new Date(stripeSub.current_period_end * 1000),
        cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
      },
    },
    { new: true },
  );
  if (!subscription) return;

  // Skip ledger entry for the FIRST invoice (already created at checkout)
  // — Stripe sends `invoice.paid` for both the initial and renewal invoices.
  const existing = await Payment.findOne({ stripeRef: invoice.payment_intent });
  if (existing) return;

  await Payment.create({
    user: subscription.user,
    type: "subscription",
    relatedId: subscription._id,
    amount: invoice.amount_paid / 100,
    currency: invoice.currency,
    status: "succeeded",
    stripeRef: invoice.payment_intent || invoice.id,
    orderId: generateOrderId(),
    paidAt: new Date(),
  });
};

const handleSubscriptionUpdated = async (sub) => {
  // Map Stripe status to our internal status
  const statusMap = {
    active: "active",
    trialing: "active",
    past_due: "active",
    canceled: "cancelled",
    unpaid: "expired",
    incomplete: "pending",
    incomplete_expired: "expired",
  };

  await Subscription.findOneAndUpdate(
    { stripeSubscriptionId: sub.id },
    {
      $set: {
        status: statusMap[sub.status] || "pending",
        endDate: new Date(sub.current_period_end * 1000),
        cancelAtPeriodEnd: sub.cancel_at_period_end,
      },
    },
  );
};
