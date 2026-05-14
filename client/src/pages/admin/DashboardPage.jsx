// Admin dashboard — summary cards + charts + recent orders
import { useEffect, useState } from "react";
import {
  IoNewspaperOutline,
  IoDocumentTextOutline,
  IoPeopleOutline,
  IoCardOutline,
  IoCashOutline,
} from "react-icons/io5";
import { getDashboardStatsApi } from "../../api/admin.api.js";
import StatsCard from "../../components/admin/StatsCard.jsx";
import RevenueChart from "../../components/admin/RevenueChart.jsx";
import SubscribersChart from "../../components/admin/SubscribersChart.jsx";
import RecentOrdersTable from "../../components/admin/RecentOrdersTable.jsx";
import Loader from "../../components/common/Loader.jsx";
import { formatCurrency } from "../../utils/formatCurrency.js";

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getDashboardStatsApi();
        setData(data.data);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;
  if (!data) return <p className="text-muted">Failed to load dashboard.</p>;

  const { summary, recentOrders, subscriberGrowth, revenueTrend } = data;

  return (
    <div>
      <header className="mb-8">
        <p className="eyebrow mb-2">Overview</p>
        <h1 className="font-display text-3xl lg:text-4xl text-charcoal">
          Dashboard
        </h1>
        <p className="text-sm text-muted mt-1">
          Welcome back — here's how Magzineer is performing.
        </p>
      </header>

      {/* Summary cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-5 mb-8">
        <StatsCard
          icon={<IoNewspaperOutline />}
          label="Magazines"
          value={summary.totalMagazines}
          accentColor="charcoal"
          index={0}
        />
        <StatsCard
          icon={<IoDocumentTextOutline />}
          label="Articles"
          value={summary.totalArticles}
          accentColor="crimson"
          index={1}
        />
        <StatsCard
          icon={<IoPeopleOutline />}
          label="Total Readers"
          value={summary.totalUsers}
          accentColor="gold"
          index={2}
        />
        <StatsCard
          icon={<IoCardOutline />}
          label="Active Subscribers"
          value={summary.activeSubscribers}
          accentColor="green"
          index={3}
        />
        <StatsCard
          icon={<IoCashOutline />}
          label="Total Revenue"
          value={formatCurrency(summary.totalRevenue || 0)}
          accentColor="crimson"
          index={4}
        />
      </section>

      {/* Revenue breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <RevenueChart data={revenueTrend} />
        <SubscribersChart data={subscriberGrowth} />
      </section>

      {/* Revenue split */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <div className="card-mz p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-lg bg-crimson/10 text-crimson flex items-center justify-center text-2xl">
            <IoCardOutline />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted">
              Subscription Revenue
            </p>
            <p className="font-display text-2xl text-charcoal mt-1">
              {formatCurrency(summary.subscriptionRevenue || 0)}
            </p>
          </div>
        </div>
        <div className="card-mz p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-lg bg-gold/15 text-gold flex items-center justify-center text-2xl">
            <IoCashOutline />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted">
              Single-Issue Revenue
            </p>
            <p className="font-display text-2xl text-charcoal mt-1">
              {formatCurrency(summary.purchaseRevenue || 0)}
            </p>
          </div>
        </div>
      </section>

      {/* Recent orders */}
      <section>
        <RecentOrdersTable orders={recentOrders || []} />
      </section>
    </div>
  );
};

export default DashboardPage;
