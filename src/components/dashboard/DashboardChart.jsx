import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function DashboardChart({
  title,
  description,
  data = [],
  xKey = "name",
  dataKey = "value",
  dataLabel = "Activity",
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm  ">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground ">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-foreground-secondary ">
            {description}
          </p>
        )}
      </div>

      {data.length > 0 ? (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id="dashboardChartFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#6D9181" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6D9181" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#9CA99F"
                opacity={0.25}
              />

              <XAxis
                dataKey={xKey}
                tick={{ fill: "#78877F", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: "#78877F", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Area
                type="monotone"
                dataKey={dataKey}
                name={dataLabel}
                stroke="#6D9181"
                strokeWidth={2}
                fill="url(#dashboardChartFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-background px-5 text-center dark:bg-surface-secondary">
          <p className="font-medium text-foreground ">
            No analytics data available
          </p>
          <p className="mt-2 max-w-sm text-sm text-foreground-secondary ">
            Chart information will appear here when the relevant API data is
            connected.
          </p>
        </div>
      )}
    </section>
  );
}

export default DashboardChart;
