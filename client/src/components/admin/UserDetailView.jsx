// Detailed user view — personal info, subscription, purchases, bookmark count
import { motion } from "framer-motion";
import {
  IoMailOutline,
  IoCalendarOutline,
  IoBookmarkOutline,
} from "react-icons/io5";
import { formatDate, formatDateLong } from "../../utils/formatDate.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

const UserDetailView = ({
  user,
  subscription,
  purchases = [],
  bookmarksCount = 0,
}) => {
  if (!user) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-mz p-6 lg:col-span-1"
      >
        <div className="flex flex-col items-center text-center">
          {user.profilePhoto?.url ? (
            <img
              src={user.profilePhoto.url}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-cream mb-4"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-charcoal text-ivory flex items-center justify-center font-display text-3xl mb-4">
              {user.name?.[0]?.toUpperCase()}
            </div>
          )}
          <h3 className="font-display text-xl text-charcoal">{user.name}</h3>
          <span
            className={`mt-2 text-[10px] uppercase tracking-widest px-2 py-0.5 ${
              user.blocked
                ? "bg-crimson/10 text-crimson"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {user.blocked ? "Blocked" : "Active Reader"}
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-3 text-sm text-charcoal-soft border-t border-line pt-5">
          <p className="flex items-center gap-2">
            <IoMailOutline className="text-muted" /> {user.email}
          </p>
          <p className="flex items-center gap-2">
            <IoCalendarOutline className="text-muted" /> Joined{" "}
            {formatDate(user.createdAt)}
          </p>
          <p className="flex items-center gap-2">
            <IoBookmarkOutline className="text-muted" /> {bookmarksCount}{" "}
            bookmarks
          </p>
        </div>
      </motion.div>

      {/* Subscription + purchases */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-mz p-6"
        >
          <h4 className="font-display text-lg text-charcoal mb-4 heading-rule">
            Subscription
          </h4>
          {subscription ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <DetailItem label="Plan" value={subscription.plan?.name} />
              <DetailItem
                label="Status"
                value={
                  <span
                    className={`text-xs uppercase tracking-widest ${
                      subscription.status === "active"
                        ? "text-emerald-700"
                        : "text-crimson"
                    }`}
                  >
                    {subscription.status}
                  </span>
                }
              />
              <DetailItem
                label="Start"
                value={formatDateLong(subscription.startDate)}
              />
              <DetailItem
                label="Ends / Renews"
                value={formatDateLong(subscription.endDate)}
              />
              {subscription.cancelAtPeriodEnd && (
                <DetailItem label="Note" value="Set to cancel at period end" />
              )}
            </div>
          ) : (
            <p className="text-muted text-sm">No subscription yet.</p>
          )}
        </motion.div>

        {/* Purchases */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-mz p-6"
        >
          <h4 className="font-display text-lg text-charcoal mb-4 heading-rule">
            Purchased Issues
          </h4>
          {purchases.length === 0 ? (
            <p className="text-muted text-sm">No purchases yet.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {purchases.map((p) => (
                <li
                  key={p._id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  {p.issue?.cover?.url && (
                    <img
                      src={p.issue.cover.url}
                      alt=""
                      className="w-10 h-14 object-cover border border-line"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-charcoal text-sm line-clamp-1">
                      {p.issue?.magazine?.title} — {p.issue?.issueNumber}
                    </p>
                    <p className="text-xs text-muted">
                      {formatDate(p.createdAt)}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-charcoal">
                    {formatCurrency(p.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-[10px] uppercase tracking-widest text-muted font-medium mb-1">
      {label}
    </p>
    <p className="text-charcoal">{value || "—"}</p>
  </div>
);

export default UserDetailView;
