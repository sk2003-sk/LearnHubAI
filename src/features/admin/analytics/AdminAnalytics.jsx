import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BookOpen, ShoppingCart, Users } from "lucide-react";
import { useUsersAnalytics, useCourseAnalytics, useOrderAnalytics } from "../hook/useAnalytics";
import { useAdminAnalytics } from "../hook/useAdmin";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";
import ExportReports from "./ExportReports";
import { getAdminAnalyticsOverview, getStatValue } from "../utils/adminData";

function getMonthlyRows(response, rootKey) {
  let root = response?.[rootKey] ?? response?.data?.[rootKey] ?? response?.result?.[rootKey];

  if (!root && response && typeof response === "object") {
    const foundKey = Object.keys(response).find(
      (key) => key.toLowerCase() === rootKey.toLowerCase(),
    );
    if (foundKey) root = response[foundKey];
  }

  root ??= response;
  const rows = root?.last12Months ?? root?.monthly ?? root?.months ?? root?.data ?? root?.items ?? (Array.isArray(root) ? root : []);
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => ({
    month: row.month ?? row.label ?? row.name ?? "—",
    count: Number(row.count ?? row.value ?? row.total ?? 0),
  }));
}

function AdminAnalytics() {
  const usersQuery = useUsersAnalytics();
  const coursesQuery = useCourseAnalytics();
  const ordersQuery = useOrderAnalytics();
  const overviewQuery = useAdminAnalytics();

  const usersData = useMemo(() => getMonthlyRows(usersQuery.data, "users"), [usersQuery.data]);
  const coursesData = useMemo(() => getMonthlyRows(coursesQuery.data, "courses"), [coursesQuery.data]);
  const ordersData = useMemo(() => getMonthlyRows(ordersQuery.data, "orders"), [ordersQuery.data]);
  const overview = useMemo(() => getAdminAnalyticsOverview(overviewQuery.data), [overviewQuery.data]);

  const loading = usersQuery.isLoading || coursesQuery.isLoading || ordersQuery.isLoading || overviewQuery.isLoading;
  if (loading) return <PageLoader />;

  const cards = [
    { label: "Users", value: getStatValue(overview, ["users", "totalUsers", "userCount"]) ?? usersData.reduce((sum, row) => sum + row.count, 0), icon: Users },
    { label: "Courses", value: getStatValue(overview, ["courses", "totalCourses", "courseCount"]) ?? coursesData.reduce((sum, row) => sum + row.count, 0), icon: BookOpen },
    { label: "Orders", value: getStatValue(overview, ["orders", "totalOrders", "orderCount"]) ?? ordersData.reduce((sum, row) => sum + row.count, 0), icon: ShoppingCart },
  ];

  const charts = [
    { title: "User signups", data: usersData, color: "var(--brand-secondary)", name: "New users", type: "bar" },
    { title: "Course creation", data: coursesData, color: "var(--brand)", name: "Courses", type: "line" },
    { title: "Order activity", data: ordersData, color: "var(--muted-gold)", name: "Orders", type: "bar" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Platform Analytics" description="Monthly user, course and order trends returned by the analytics API." actions={<ExportReports />} />
      {(usersQuery.isError || coursesQuery.isError || ordersQuery.isError || overviewQuery.isError) && <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">Some analytics requests failed. Available charts and totals are shown using the requests that succeeded.</div>}
      <div className="grid gap-4 sm:grid-cols-3">{cards.map(({ label, value, icon: Icon }) => <article key={label} className="rounded-2xl border border-border bg-surface p-5  "><div className="flex items-center justify-between text-sm text-foreground-secondary "><span>Total {label.toLowerCase()}</span><Icon size={19} className="text-brand-secondary" /></div><p className="mt-3 text-3xl font-semibold text-foreground ">{value}</p></article>)}</div>
      <div className="grid gap-5 xl:grid-cols-2">{charts.map((chart) => <section key={chart.title} className="rounded-2xl border border-border bg-surface p-5  "><h2 className="font-semibold text-foreground ">{chart.title}</h2>{chart.data.length === 0 ? <p className="flex h-64 items-center justify-center text-sm text-foreground-secondary">No monthly data was returned for this chart.</p> : <div className="mt-4 h-72"><ResponsiveContainer width="100%" height="100%">{chart.type === "bar" ? <BarChart data={chart.data}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis allowDecimals={false} /><Tooltip /><Legend /><Bar dataKey="count" fill={chart.color} name={chart.name} radius={[5, 5, 0, 0]} /></BarChart> : <LineChart data={chart.data}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis allowDecimals={false} /><Tooltip /><Legend /><Line type="monotone" dataKey="count" stroke={chart.color} strokeWidth={2} dot={false} name={chart.name} /></LineChart>}</ResponsiveContainer></div>}</section>)}</div>
      <p className="text-xs text-foreground-secondary ">No percentage growth rates or revenue amounts are estimated. The page displays only values returned by the backend analytics endpoints.</p>
    </div>
  );
}

export default AdminAnalytics;
