// Analytics page — most-read articles, top spenders, revenue report with PDF export
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoTrophyOutline, IoTrendingUpOutline } from "react-icons/io5";
import {
  getMostReadArticlesApi,
  getTopSubscribersApi,
  getRevenueReportApi,
} from "../../api/report.api.js";
import TopArticlesChart from "../../components/admin/TopArticlesChart.jsx";
import ReportExportBtn from "../../components/admin/ReportExportBtn.jsx";
import Loader from "../../components/common/Loader.jsx";
import { formatCurrency } from "../../utils/formatCurrency.js";

const AdminAnalyticsPage = () => {
  const [period, setPeriod] = useState("daily");
  const [range, setRange] = useState({ from: "", to: "" });
  const [mostRead, setMostRead] = useState([]);
  const [topSpenders, setTopSpenders] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [mrRes, tsRes, revRes] = await Promise.all([
          getMostReadArticlesApi(10),
          getTopSubscribersApi(10),
          getRevenueReportApi({ period, from: range.from, to: range.to }),
        ]);
        setMostRead(mrRes.data.data.articles || []);
        setTopSpenders(tsRes.data.data.topSpenders || []);
        setRevenue(revRes.data.data);
      } finally {
        setLoading(false);
      }
    })();
  }, [period, range]);

  if (loading && !revenue) return <Loader />;

  return (
    <div>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-end justify-between gap-3 mb-8"
      >
        <div>
          <p className="eyebrow mb-2">Insights</p>
          <h1 className="font-display text-3xl lg:text-4xl text-charcoal">
            Analytics
          </h1>
        </div>
        <ReportExportBtn from={range.from} to={range.to} />
      </motion.header>

      {/* Period + date range controls */}
      <div className="card-mz p-4 mb-6 flex flex-wrap items-center gap-3">
        <span className="text-xs uppercase tracking-widest text-muted font-medium">
          Period:
        </span>
        {["daily", "weekly", "monthly"].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`text-xs px-3 py-1.5 rounded transition-colors ${
              period === p
                ? "bg-charcoal text-ivory"
                : "bg-cream text-charcoal hover:bg-charcoal/10"
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
        <span className="text-xs text-muted ml-3">From</span>
        <input
          type="date"
          value={range.from}
          onChange={(e) => setRange({ ...range, from: e.target.value })}
          className="px-3 py-1.5 bg-cream border border-line rounded text-sm"
        />
        <span className="text-xs text-muted">To</span>
        <input
          type="date"
          value={range.to}
          onChange={(e) => setRange({ ...range, to: e.target.value })}
          className="px-3 py-1.5 bg-cream border border-line rounded text-sm"
        />
      </div>

      {/* Revenue totals */}
      {revenue && (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <RevenueTotal
            label="Subscription Revenue"
            value={revenue.totals?.subscription || 0}
            accent="crimson"
          />
          <RevenueTotal
            label="Single-Issue Revenue"
            value={revenue.totals?.purchase || 0}
            accent="gold"
          />
          <RevenueTotal
            label="Grand Total"
            value={revenue.totals?.grandTotal || 0}
            accent="charcoal"
            highlight
          />
        </section>
      )}

      {/* Most read articles chart */}
      <section className="mb-8">
        <TopArticlesChart data={mostRead} />
      </section>

      {/* Top spenders */}
      <section className="card-mz overflow-hidden">
        <div className="px-5 py-4 border-b border-line flex items-center gap-3">
          <IoTrophyOutline size={20} className="text-gold" />
          <h3 className="font-display text-lg text-charcoal">Top Spenders</h3>
        </div>

        {topSpenders.length === 0 ? (
          <p className="text-muted text-sm p-6 text-center">No data yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {topSpenders.map((u, idx) => (
              <motion.li
                key={u.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="flex items-center gap-4 px-5 py-3"
              >
                <span className="w-7 h-7 rounded-full bg-cream flex items-center justify-center text-xs font-medium text-charcoal">
                  {idx + 1}
                </span>
                {u.profilePhoto?.url ? (
                  <img
                    src={u.profilePhoto.url}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-charcoal text-ivory flex items-center justify-center font-display text-sm">
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-charcoal text-sm truncate">
                    {u.name}
                  </p>
                  <p className="text-xs text-muted truncate">{u.email}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display text-lg text-charcoal">
                    {formatCurrency(u.totalSpent)}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-muted">
                    {u.paymentsCount} payments
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

const RevenueTotal = ({ label, value, accent, highlight }) => {
  const palette = {
    crimson: "bg-crimson/10 text-crimson",
    gold: "bg-gold/15 text-gold",
    charcoal: "bg-charcoal text-ivory",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-lg ${highlight ? "bg-charcoal text-ivory" : "card-mz"}`}
    >
      <div
        className={`w-10 h-10 rounded-full ${
          highlight ? "bg-gold text-charcoal" : palette[accent]
        } flex items-center justify-center mb-3`}
      >
        <IoTrendingUpOutline size={18} />
      </div>
      <p
        className={`text-xs uppercase tracking-widest mb-1 ${highlight ? "text-ivory/70" : "text-muted"}`}
      >
        {label}
      </p>
      <p
        className={`font-display text-3xl ${highlight ? "text-ivory" : "text-charcoal"}`}
      >
        {formatCurrency(value)}
      </p>
    </motion.div>
  );
};

export default AdminAnalyticsPage;
