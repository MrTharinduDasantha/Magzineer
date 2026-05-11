// Stripe SDK configuration — used for subscriptions and one-time issue purchases
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Stripe instance with the secret key from .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20", // Pin API version for stability
});

export default stripe;
