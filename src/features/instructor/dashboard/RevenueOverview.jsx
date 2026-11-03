import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  formatMetric,
  getRevenueArray,
  getCourseName,
  getMetric,
  unwrapAnalytics,
} from "../analytics/analyticsHelpers";

function RevenueOverview({ revenue }) {
  const data = unwrapAnalytics(revenue);
  const courses = getRevenueArray(revenue);

  const chartData = courses
    .map((course, index) => ({
      name: getCourseName(course, index),
      revenue: getMetric(course, [
        "revenue",
        "totalRevenue",
        "amount",
        "earnings",
      ]),
    }))
    .filter((course) => course.revenue !== null);

  const totalRevenue = getMetric(data, ["totalRevenue"]);

  return (
    <section className="rounded-2xl border border-border bg-surface p-5  ">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground ">
          Revenue Overview
        </h2>
        <p className="mt-1 text-sm text-foreground-secondary">
          Revenue information returned by your instructor API.
        </p>
      </div>

      <div className="mb-6">
        <p className="text-sm text-foreground-secondary">Total revenue</p>
        <p className="mt-2 text-3xl font-bold text-foreground ">
          {formatMetric(totalRevenue)}
        </p>
      </div>

      {chartData.length > 0 ? (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 15, left: 0, bottom: 35 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />
              <XAxis
                dataKey="name"
                angle={-20}
                textAnchor="end"
                interval={0}
                height={65}
                tick={{ fontSize: 11 }}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="var(--brand-secondary)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="rounded-xl bg-surface-secondary p-6 text-center text-sm text-foreground-secondary  ">
          Course-level revenue details are not available in the returned
          response.
        </div>
      )}
    </section>
  );
}

export default RevenueOverview;
