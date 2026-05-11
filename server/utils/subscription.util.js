// Access-control helpers — used by article.controller.js to determine whether a user can read the full content of a premium article
import Subscription from "../models/subscription.model.js";
import Purchase from "../models/purchase.model.js";

/**
 * Returns true if the user currently has an active subscription
 * (status === "active" AND endDate is in the future)
 */
export const hasActiveSubscription = async (userId) => {
  if (!userId) return false;

  const subscription = await Subscription.findOne({
    user: userId,
    status: "active",
    endDate: { $gt: new Date() },
  });

  return !!subscription;
};

/**
 * Returns true if the user has completed a purchase for the given issue
 */
export const hasPurchasedIssue = async (userId, issueId) => {
  if (!userId || !issueId) return false;

  const purchase = await Purchase.findOne({
    user: userId,
    issue: issueId,
    status: "completed",
  });

  return !!purchase;
};

/**
 * Convenience helper — given a user and an article, decide whether they can
 * read the full content. Returns true if:
 *   • the article is free, OR
 *   • the user has an active subscription, OR
 *   • the user has purchased the issue this article belongs to
 */
export const canAccessArticle = async (userId, article) => {
  if (!article) return false;
  if (article.accessLevel === "free") return true;
  if (!userId) return false;

  if (await hasActiveSubscription(userId)) return true;
  if (article.issue && (await hasPurchasedIssue(userId, article.issue)))
    return true;

  return false;
};
