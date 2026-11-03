import { useMemo } from "react";
import { Activity, BookOpen, CheckCircle2, Clock3 } from "lucide-react";
import { useStudentProgressAnalytics, useStudentLearning } from "../hook/useStudentLearning";
import { getProgressRowsFromResponse } from "../utils/studentHelpers";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";
import Button from "../../../components/ui/Button";

function LearningProgress() {
  const analyticsQuery = useStudentProgressAnalytics();
  const learningQuery = useStudentLearning();
  const progressRows = useMemo(() => {
    const rows = getProgressRowsFromResponse(analyticsQuery.data);
    const sourceRows = rows.length ? rows : (learningQuery.courses ?? []).map((course) => ({ ...course.enrollment, course, progress: course.enrollment?.completed ? 100 : course.enrollment?.progress ?? course.enrollment?.progressPercentage ?? 0 }));
    return sourceRows.map((item) => ({ ...item, title: item.course?.name ?? item.courseName ?? item.name ?? item.course?.title ?? "Course", progress: Math.max(0, Math.min(100, Number(item.progress ?? item.progressPercentage ?? item.percentage ?? 0))) }));
  }, [analyticsQuery.data, learningQuery.courses]);
  const completed = progressRows.filter((item) => item.completed || item.progress >= 100).length;
  const average = progressRows.length ? Math.round(progressRows.reduce((sum, item) => sum + item.progress, 0) / progressRows.length) : 0;
  if (analyticsQuery.isLoading && learningQuery.isLoading) return <PageLoader />;

  return <div className="space-y-6"><PageHeader title="Learning Progress" description="Track your course completion and learning activity." />
    {(analyticsQuery.isError || learningQuery.isError) && <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200"><span>Some progress information could not be loaded. {analyticsQuery.error?.message || learningQuery.error?.message || "Refresh to try again."}</span><Button size="sm" variant="outline" onClick={() => { analyticsQuery.refetch(); learningQuery.refetch(); }}>Refresh</Button></div>}
    <div className="grid gap-4 sm:grid-cols-3"><article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"><div className="flex items-center justify-between text-sm text-[var(--foreground-secondary)]"><span>Enrolled courses</span><BookOpen size={19} className="text-[var(--brand-secondary)]" /></div><p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">{learningQuery.courses.length}</p></article><article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"><div className="flex items-center justify-between text-sm text-[var(--foreground-secondary)]"><span>Completed courses</span><CheckCircle2 size={19} className="text-[var(--brand-secondary)]" /></div><p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">{completed}</p></article><article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"><div className="flex items-center justify-between text-sm text-[var(--foreground-secondary)]"><span>Average progress</span><Activity size={19} className="text-[var(--brand-secondary)]" /></div><p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">{average}%</p></article></div>
    {progressRows.length === 0 ? <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-12 text-center"><Clock3 size={36} className="mx-auto text-[var(--brand-secondary)]" /><h2 className="mt-3 font-semibold text-[var(--foreground)]">No progress details available</h2><p className="mt-1 text-sm text-[var(--foreground-secondary)]">Progress appears after you start lessons in an enrolled course.</p><Button className="mt-4" variant="outline" onClick={() => { analyticsQuery.refetch(); learningQuery.refetch(); }}>Refresh progress</Button></div> : <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"><h2 className="font-semibold text-[var(--foreground)]">Course completion</h2><div className="mt-5 space-y-5">{progressRows.map((item, index) => <div key={item._id ?? item.courseId ?? index}><div className="mb-2 flex items-center justify-between gap-3"><p className="text-sm font-medium text-[var(--foreground)]">{item.title}</p><span className="text-xs font-semibold text-[var(--brand-secondary)]">{item.progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-[var(--surface-secondary)]"><div className="h-full rounded-full bg-[var(--brand-secondary)]" style={{ width: `${item.progress}%` }} /></div></div>)}</div></section>}
  </div>;
}

export default LearningProgress;
