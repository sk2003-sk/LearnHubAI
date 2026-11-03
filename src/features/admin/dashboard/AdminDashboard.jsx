import { useMemo } from "react";
import { BookOpen, GraduationCap, Layers3, ShoppingCart, Users, UserRoundCheck, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";
import { useAuth } from "../../auth/hooks/useAuth";
import { useAdminCourses, useAdminAnalytics } from "../hook/useAdmin";
import { useAdminUsers } from "../hook/useAdminUsers";
import { getAdminAnalyticsOverview, getAdminCoursesFromResponse, getStatValue } from "../utils/adminData";
import { ROUTES } from "../../../constants/routes";

function AdminDashboard() {
  const { user } = useAuth();
  const usersQuery = useAdminUsers();
  const coursesQuery = useAdminCourses();
  const analyticsQuery = useAdminAnalytics();
  const users = usersQuery.data || [];
  const courses = useMemo(() => getAdminCoursesFromResponse(coursesQuery.data), [coursesQuery.data]);
  const analytics = useMemo(() => getAdminAnalyticsOverview(analyticsQuery.data), [analyticsQuery.data]);
  const isLoading = usersQuery.isLoading || coursesQuery.isLoading || analyticsQuery.isLoading;

  const stats = [
    { label: "Registered users", value: users.length, icon: Users, description: "User records returned by the user dashboard API", to: ROUTES.ADMIN_USERS },
    { label: "Students", value: users.filter((item) => item.role === "user").length, icon: GraduationCap, description: "Accounts with the student role", to: ROUTES.ADMIN_USERS },
    { label: "Instructors", value: users.filter((item) => item.role === "instructor").length, icon: UserRoundCheck, description: "Accounts with the instructor role", to: ROUTES.ADMIN_INSTRUCTORS },
    { label: "Courses", value: courses.length || getStatValue(analytics, ["courses", "totalCourses", "courseCount"]) || 0, icon: BookOpen, description: "Course records available in the admin workspace", to: ROUTES.ADMIN_COURSES },
    { label: "Orders", value: getStatValue(analytics, ["orders", "totalOrders", "orderCount"]) || 0, icon: ShoppingCart, description: "Order total returned by platform analytics", to: ROUTES.ADMIN_ORDERS },
    { label: "Enrollments", value: getStatValue(analytics, ["enrollments", "totalEnrollments", "enrollmentCount"]) || 0, icon: Layers3, description: "Enrollment total returned by platform analytics", to: ROUTES.ADMIN_ENROLLMENTS },
  ];

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-7">
      <PageHeader title={`Welcome${user?.name ? `, ${user.name}` : ""}!`} description="Your LearnHub administration workspace and live platform overview." />
      {(usersQuery.isError || coursesQuery.isError || analyticsQuery.isError) && <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">Some dashboard requests failed. The cards show only the data returned successfully.{usersQuery.isError && <p className="mt-1">Users: {usersQuery.error?.message || "Request failed"}</p>}{coursesQuery.isError && <p className="mt-1">Courses: {coursesQuery.error?.message || "Request failed"}</p>}{analyticsQuery.isError && <p className="mt-1">Platform totals: {analyticsQuery.error?.message || "Request failed"}</p>}</div>}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{stats.map(({ label, value, icon: Icon, description, to }) => <Link key={label} to={to} className="group rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-brand-secondary  "><div className="flex items-center justify-between"><p className="text-sm text-foreground-secondary ">{label}</p><Icon size={20} className="text-brand-secondary" /></div><p className="mt-3 text-3xl font-semibold text-foreground ">{value}</p><div className="mt-2 flex items-center justify-between gap-2"><p className="text-xs leading-5 text-foreground-secondary ">{description}</p><ArrowUpRight size={16} className="shrink-0 text-brand-secondary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div></Link>)}</section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[{ title: "Course management", description: "Create courses, review submissions, update lifecycle status, edit, clone or remove course records.", path: ROUTES.ADMIN_COURSES, icon: BookOpen }, { title: "User management", description: "Search accounts, review verification status, update supported roles and remove users.", path: ROUTES.ADMIN_USERS, icon: Users }, { title: "Instructor management", description: "Review the instructor and administrator accounts returned by the backend.", path: ROUTES.ADMIN_INSTRUCTORS, icon: GraduationCap }, { title: "Orders and refunds", description: "Review recorded orders and request full refunds through the backend operation.", path: ROUTES.ADMIN_ORDERS, icon: ShoppingCart }, { title: "Enrollments", description: "Review student-to-course enrollment records and completion progress.", path: ROUTES.ADMIN_ENROLLMENTS, icon: Layers3 }, { title: "Categories and coupons", description: "Organize course categories and create discount coupons.", path: ROUTES.ADMIN_CATEGORIES, icon: Layers3 }, { title: "Analytics", description: "Review monthly user, course and order trends returned by analytics APIs.", path: ROUTES.ADMIN_ANALYTICS, icon: UserRoundCheck }].map(({ title, description, path, icon: Icon }) => <Link key={title} to={path} className="rounded-2xl border border-border bg-surface p-6 transition hover:border-brand-secondary  "><div className="flex items-center gap-3"><Icon className="text-brand-secondary" /><h2 className="font-semibold text-foreground ">{title}</h2></div><p className="mt-3 text-sm leading-6 text-foreground-secondary ">{description}</p></Link>)}</section>
      <p className="text-xs leading-5 text-foreground-secondary ">Totals are taken from API responses. The dashboard does not estimate revenue or growth where the backend does not return those values.</p>
    </div>
  );
}

export default AdminDashboard;
