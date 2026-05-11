// Payment model — unified ledger entry for both subscription payments
// and single-issue purchases. Powers the admin "Payments" view and the
// user "Payment History" page.
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // What kind of payment this is
    type: {
      type: String,
      enum: ["subscription", "purchase"],
      required: true,
    },
    // Polymorphic reference — either a Subscription or a Purchase
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "type === 'subscription' ? 'Subscription' : 'Purchase'",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "usd",
    },
    status: {
      type: String,
      enum: ["succeeded", "pending", "failed", "refunded"],
      default: "pending",
    },
    // Stripe references — payment_intent id, invoice id, or checkout session id
    stripeRef: {
      type: String,
      default: "",
    },
    // Human-readable order ID for invoices/receipts
    orderId: {
      type: String,
      required: true,
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
