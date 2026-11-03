import { BookOpen, CheckCircle2, Users, Wallet } from "lucide-react";

import {
  formatMetric,
  getMetric,
  unwrapAnalytics,
} from "../analytics/analyticsHelpers";

function InstructorStats({ analytics, revenue }) {
  const analyticsData = unwrapAnalytics(analytics);
  const revenueData = unwrapAnalytics(revenue);

  const stats = [
    {
      title: "Total Courses",
      value: getMetric(analyticsData, [
        "totalCourses",
        "coursesCount",
        "courseCount",
        "courses",
      ]),
      icon: BookOpen,
    },
    {
      title: "Total Enrollments",
      value:
        getMetric(revenueData, ["totalEnrollments", "enrollments"]) ??
        getMetric(analyticsData, [
          "totalEnrollments",
          "enrollmentsCount",
          "enrollmentCount",
          "enrollments",
        ]),
      icon: Users,
    },
    {
      title: "Completed Enrollments",
      value: getMetric(analyticsData, [
        "totalCompletions",
        "completedEnrollments",
        "completionsCount",
        "completionCount",
        "completions",
      ]),
      icon: CheckCircle2,
    },
    {
      title: "Total Revenue",
      value: getMetric(revenueData, ["totalRevenue"]),
      icon: Wallet,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-2xl border border-border bg-surface p-5  "
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground-secondary">{stat.title}</p>
              <Icon size={21} className="text-brand-secondary" />
            </div>

            <p className="mt-4 text-2xl font-bold text-foreground ">
              {formatMetric(stat.value)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default InstructorStats;
