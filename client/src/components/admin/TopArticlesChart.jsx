// Most-read articles — Recharts horizontal bar chart
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const TopArticlesChart = ({ data = [] }) => {
  // Truncate long titles for cleaner Y-axis labels
  const chartData = data.slice(0, 8).map((a) => ({
    title: a.title.length > 30 ? a.title.slice(0, 30) + "…" : a.title,
    views: a.views,
  }));

  // Alternate two accent colors across bars for editorial flair
  const colors = ["#C73E3A", "#B89968"];

  return (
    <div className="card-mz p-5 lg:p-7">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display text-lg text-charcoal">Top Articles</h3>
          <p className="text-xs text-muted mt-0.5">By view count</p>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#EFE7DA"
              horizontal={false}
            />
            <XAxis
              type="number"
              stroke="#8C8378"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              dataKey="title"
              type="category"
              stroke="#8C8378"
              fontSize={11}
              tickLine={false}
              width={200}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #EFE7DA",
                borderRadius: 6,
                fontSize: 12,
              }}
            />
            <Bar dataKey="views" radius={[0, 4, 4, 0]}>
              {chartData.map((_, idx) => (
                <Cell key={idx} fill={colors[idx % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopArticlesChart;
