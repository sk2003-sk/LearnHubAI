import { useMemo } from "react";

import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";

import {
  useInstructorAnalytics,
  useInstructorCourses,
  useInstructorRevenue,
} from "../hook/useInstructior";

import InstructorStats from "../dashboard/InstructorStats";
import RevenueOverview from "../dashboard/RevenueOverview";
import CoursePerformance from "./CoursePerformance";

import { getCourseArray, unwrapAnalytics } from "./analyticsHelpers";

function InstructorAnalytics() {
  const analyticsQuery = useInstructorAnalytics();
  const revenueQuery = useInstructorRevenue();
  const coursesQuery = useInstructorCourses();

  const courses = useMemo(
    () => getCourseArray(coursesQuery.data),
    [coursesQuery.data],
  );

  const analytics = useMemo(
    () => unwrapAnalytics(analyticsQuery.data),
    [analyticsQuery.data],
  );

  const hasLoading =
    analyticsQuery.isLoading ||
    revenueQuery.isLoading ||
    coursesQuery.isLoading;

  if (hasLoading) {
    return <PageLoader />;
  }

  const errors = [
    analyticsQuery.isError && {
      title: "Teaching analytics",
      error: analyticsQuery.error,
    },
    revenueQuery.isError && {
      title: "Revenue",
      error: revenueQuery.error,
    },
    coursesQuery.isError && {
      title: "Course information",
      error: coursesQuery.error,
    },
  ].filter(Boolean);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Instructor Analytics"
        description="Track your courses, student enrollments, completions and revenue."
      />

      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map(({ title, error }) => (
            <div
              key={title}
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
            >
              <span className="font-semibold">{title}: </span>
              {error?.response?.data?.message ||
                error?.message ||
                "Unable to load this information."}
            </div>
          ))}
        </div>
      )}

      <InstructorStats
        analytics={analyticsQuery.data}
        revenue={revenueQuery.data}
      />

      <RevenueOverview revenue={revenueQuery.data} />

      <CoursePerformance courses={courses} analytics={analytics} />
    </div>
  );
}

export default InstructorAnalytics;
