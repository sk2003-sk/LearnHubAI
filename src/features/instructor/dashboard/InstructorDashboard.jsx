import { BookOpen, CalendarDays, ShieldCheck, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import PageHeader from "../../../components/common/PageHeader";
import DashboardStats from "../../../components/dashboard/DashboardStats";
import Button from "../../../components/ui/Button";
import PageLoader from "../../../components/common/PageLoader";
import { useInstructorCourses } from "../hook/useInstructior";
function getCourses(response) {
  if (Array.isArray(response)) return response;
  return response?.courses ?? response?.data?.courses ?? response?.result?.courses ?? [];
}

function InstructorDashboard() {
  const { user } = useAuth();
  const coursesQuery = useInstructorCourses();
  const courses = getCourses(coursesQuery.data);

  const stats = [
    {
      title: "Total courses",
      value: coursesQuery.isLoading
        ? "..."
        : coursesQuery.isError
          ? "—"
          : courses.length,
      description: "Courses in your instructor workspace",
      icon: BookOpen,
    },
    {
      title: "Account status",
      value: user?.isVerified ? "Verified" : "Unverified",
      description: "Your account verification status",
      icon: ShieldCheck,
    },
    {
      title: "Member since",
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString()
        : "—",
      description: "Your registration date",
      icon: CalendarDays,
    },
  ];

  if (coursesQuery.isLoading) return <PageLoader />;

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome${user?.name ? `, ${user.name}` : ""}!`}
        description="Manage your courses, create learning content and help students grow."
        actions={
          <Link to="/instructor/courses/create">
            <Button>
              <Plus size={17} />
              Create course
            </Button>
          </Link>
        }
      />

      <DashboardStats stats={stats} />

      <section className="rounded-2xl border border-border bg-surface p-6  ">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground ">
              Your teaching workspace
            </h2>
            <p className="mt-2 text-sm text-foreground-secondary ">
              Create courses, update course information and submit your content
              for review.
            </p>
          </div>

          <Link to="/instructor/courses">
            <Button variant="outline">Manage courses</Button>
          </Link>
        </div>

        {coursesQuery.isError && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">
            Course statistics could not be loaded.
          </p>
        )}
      </section>
    </div>
  );
}

export default InstructorDashboard;
