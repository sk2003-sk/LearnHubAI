import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getCourseName, getMetric } from "./analyticsHelpers";

function CoursePerformance({ courses = [], analytics }) {
  const analyticsCourses = Array.isArray(analytics?.courses)
    ? analytics.courses
    : [];

  const performanceCourses =
    analyticsCourses.length > 0 ? analyticsCourses : courses;

  const chartData = performanceCourses
    .map((course, index) => ({
      name: getCourseName(course, index),
      enrollments: getMetric(course, [
        "purchased",
        "totalEnrollments",
        "enrollments",
        "enrollmentCount",
      ]),
    }))
    .filter((course) => course.enrollments !== null);

  return (
    <section className="rounded-2xl border border-border bg-surface p-5  ">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground ">
          Course Performance
        </h2>
        <p className="mt-1 text-sm text-foreground-secondary">
          Enrollment performance across your courses.
        </p>
      </div>

      {chartData.length > 0 ? (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 15, left: 0, bottom: 40 }}
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
                height={70}
                tick={{ fontSize: 11 }}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="enrollments"
                name="Enrollments"
                fill="var(--brand-secondary)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="rounded-xl bg-surface-secondary p-6 text-center text-sm text-foreground-secondary  ">
          Course enrollment performance data is not available in the API
          response.
        </div>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-112.5 text-left text-sm">
          <thead className="border-b border-border text-foreground-secondary ">
            <tr>
              <th className="py-3 pr-4 font-medium">Course</th>
              <th className="py-3 pr-4 font-medium">Enrollments</th>
              <th className="py-3 font-medium">Rating</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border ">
            {performanceCourses.map((course, index) => (
              <tr
                key={course._id || course.id || index}
                className="text-foreground "
              >
                <td className="py-4 pr-4 font-medium">
                  {getCourseName(course, index)}
                </td>
                <td className="py-4 pr-4">
                  {getMetric(course, [
                    "purchased",
                    "totalEnrollments",
                    "enrollments",
                    "enrollmentCount",
                  ]) ?? "—"}
                </td>
                <td className="py-4">
                  {course.rating ?? course.averageRating ?? "—"}
                </td>
              </tr>
            ))}

            {performanceCourses.length === 0 && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-foreground-secondary">
                  No course performance data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default CoursePerformance;
