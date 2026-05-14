// New subscribers per day — Recharts line chart
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const SubscribersChart = ({ data = [] }) => {
  const chartData = data.map((d) => ({
    date: d._id,
    subscribers: d.count,
  }));

  return (
    <div className="card-mz p-5 lg:p-7">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display text-lg text-charcoal">
            New Subscribers
          </h3>
          <p className="text-xs text-muted mt-0.5">Last 14 days</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#EFE7DA" />
            <XAxis
              dataKey="date"
              stroke="#8C8378"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              stroke="#8C8378"
              fontSize={11}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #EFE7DA",
                borderRadius: 6,
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="subscribers"
              stroke="#1A1A1A"
              strokeWidth={2.5}
              dot={{ fill: "#C73E3A", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SubscribersChart;
