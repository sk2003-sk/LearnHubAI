import { useMemo, useState } from "react";
import { Search, GraduationCap, CheckCircle2, Clock3, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";
import Button from "../../../components/ui/Button";
import { getAdminEnrollments } from "../api/admin.api";
import { getAdminEnrollmentsFromResponse } from "../utils/adminData";
import ExportReports from "../analytics/ExportReports";

const displayId = (value) => {
  if (value && typeof value === "object") {
    return value.name ?? value.email ?? value.title ?? value._id ?? value.id ?? "—";
  }
  return value ?? "—";
};
const getProgress = (item) => Math.max(0, Math.min(100, Number(item.progress ?? item.progressPercentage ?? item.percentage ?? (item.completed ? 100 : 0))));

function Enrollments() {
  const [search, setSearch] = useState("");
  const query = useQuery({ queryKey: ["admin", "enrollments"], queryFn: getAdminEnrollments, staleTime: 30_000 });
  const enrollments = useMemo(() => getAdminEnrollmentsFromResponse(query.data), [query.data]);
  const filtered = enrollments.filter((item) => [item._id, displayId(item.user ?? item.userId), displayId(item.course ?? item.courseId), displayId(item.order ?? item.orderId)].join(" ").toLowerCase().includes(search.trim().toLowerCase()));
  const completed = enrollments.filter((item) => item.completed || getProgress(item) >= 100).length;

  if (query.isLoading) return <PageLoader />;

  return <div className="space-y-6">
    <PageHeader title="Enrollment Management" description="Review student-to-course enrollment records and learning completion status." actions={<div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => query.refetch()} loading={query.isFetching}><RefreshCw size={15} /> Refresh</Button><ExportReports /></div>} />
    {query.isError && <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"><span>{query.error?.response?.data?.message || query.error?.message || "Unable to load enrollments."}</span><Button size="sm" variant="outline" onClick={() => query.refetch()}>Retry</Button></div>}
    <div className="grid gap-4 sm:grid-cols-2"><article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"><p className="text-sm text-[var(--foreground-secondary)]">Total enrollments</p><p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">{enrollments.length}</p></article><article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"><p className="text-sm text-[var(--foreground-secondary)]">Completed</p><p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">{completed}</p></article></div>
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"><div className="relative"><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-secondary)]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search enrollment, user, course or order ID" className="w-full rounded-xl border border-[var(--input)] bg-[var(--surface-secondary)] py-3 pl-11 pr-4 text-sm text-[var(--foreground)] outline-none focus:border-[var(--ring)]" /></div>
      {filtered.length ? <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="text-xs uppercase tracking-wide text-[var(--foreground-secondary)]"><tr>{["Enrollment ID", "Student", "Course", "Order", "Progress", "Status"].map((label) => <th key={label} className="border-b border-[var(--border)] px-4 py-4">{label}</th>)}</tr></thead><tbody>{filtered.map((item, index) => { const progress = getProgress(item); const isComplete = item.completed || progress >= 100; return <tr key={item._id || item.id || index} className="border-b border-[var(--border)] text-sm last:border-0"><td className="px-4 py-4 text-xs text-[var(--foreground-secondary)]">{item._id || item.id || "—"}</td><td className="px-4 py-4 text-[var(--foreground)]">{displayId(item.user ?? item.userId)}</td><td className="px-4 py-4 text-[var(--foreground)]">{displayId(item.course ?? item.courseId)}</td><td className="px-4 py-4 text-[var(--foreground)]">{displayId(item.order ?? item.orderId)}</td><td className="px-4 py-4"><div className="flex items-center gap-2"><div className="h-2 w-20 overflow-hidden rounded-full bg-[var(--surface-secondary)]"><div className="h-full rounded-full bg-[var(--brand-secondary)]" style={{ width: `${progress}%` }} /></div><span className="text-[var(--foreground-secondary)]">{progress}%</span></div></td><td className="px-4 py-4"><span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-secondary)] px-3 py-1 text-xs text-[var(--foreground)]">{isComplete ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}{isComplete ? "Completed" : "In progress"}</span></td></tr>; })}</tbody></table></div> : <div className="py-12 text-center"><GraduationCap size={36} className="mx-auto text-[var(--brand-secondary)]" /><p className="mt-3 font-semibold text-[var(--foreground)]">{query.isError ? "Enrollment data is unavailable" : "No enrollments found"}</p><p className="mt-1 text-sm text-[var(--foreground-secondary)]">{query.isError ? "Check the admin account permissions and API response, then retry." : "Enrollment records will appear here after successful course purchases."}</p>{query.isError && <Button className="mt-4" variant="outline" onClick={() => query.refetch()}>Retry</Button>}</div>}
    </section>
  </div>;
}

export default Enrollments;
