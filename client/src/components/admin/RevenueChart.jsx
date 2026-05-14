// Revenue trend — Recharts area chart for the admin dashboard
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const RevenueChart = ({ data = [] }) => {
  // Expected data shape from /admin/dashboard: [{ _id: "2026-05-09", total: 245.5 }, ...]
  const chartData = data.map((d) => ({
    date: d._id,
    revenue: d.total,
  }));

  return (
    <div className="card-mz p-5 lg:p-7">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display text-lg text-charcoal">Revenue Trend</h3>
          <p className="text-xs text-muted mt-0.5">Last 14 days</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C73E3A" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#C73E3A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#EFE7DA" />
            <XAxis
              dataKey="date"
              stroke="#8C8378"
              fontSize={11}
              tickLine={false}
            />
            <YAxis stroke="#8C8378" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #EFE7DA",
                borderRadius: 6,
                fontSize: 12,
              }}
              formatter={(value) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#C73E3A"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
