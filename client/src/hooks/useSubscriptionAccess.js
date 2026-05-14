// Tells the UI whether the current user can read a given article.
// Reads the article's own `hasAccess` flag if the server has already evaluated it (the article detail endpoint does this), otherwise falls back to active subscription state.
import { useSelector } from "react-redux";

const useSubscriptionAccess = (article) => {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const { current: subscription } = useSelector((s) => s.subscription);

  if (!article) {
    return { hasAccess: false, reason: "no-article" };
  }

  // Free articles — always accessible
  if (article.accessLevel === "free") {
    return { hasAccess: true, reason: "free" };
  }

  // Server already determined access (article detail endpoint)
  if (article.hasAccess === true) {
    return { hasAccess: true, reason: "server" };
  }

  // Anonymous user on premium content
  if (!isAuthenticated) {
    return { hasAccess: false, reason: "not-authenticated" };
  }

  // Check active subscription locally
  const hasActiveSub =
    subscription?.status === "active" &&
    new Date(subscription.endDate).getTime() > Date.now();

  if (hasActiveSub) return { hasAccess: true, reason: "subscription" };

  return { hasAccess: false, reason: "no-access" };
};

export default useSubscriptionAccess;
