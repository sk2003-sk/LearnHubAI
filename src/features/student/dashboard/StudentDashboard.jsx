import { BookOpen, CalendarDays, ShieldCheck } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import PageHeader from "../../../components/common/PageHeader";
import DashboardStats from "../../../components/dashboard/DashboardStats";
import ContinueLearning from "./ContinueLearning";
import { useStudentLearning } from "../hook/useStudentLearning";

function StudentDashboard() {
  const { user } = useAuth();
  const { courses, isLoading, isError } = useStudentLearning();

  const stats = [
    {
      title: "Enrolled courses",
      value: isLoading ? "..." : isError ? "—" : courses.length,
      description: "Courses available in your learning space",
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

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome${user?.name ? `, ${user.name}` : ""}!`}
        description="Continue your learning journey and keep building your skills."
      />

      <DashboardStats stats={stats} />

      <ContinueLearning
        courses={courses}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}

export default StudentDashboard;
