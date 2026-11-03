import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, BookOpen, RefreshCw, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import Button from "../../../components/ui/Button";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";

import { getAdminCoursesFromResponse } from "../utils/adminData";
import {
  useAdminCourses,
  useCloneAdminCourse,
  useUpdateAdminCourseStatus,
  useDeleteAdminCourse,
} from "../hook/useAdmin";

const COURSE_STATUSES = [
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "PUBLISHED",
  "UNPUBLISHED",
  "ARCHIVED",
];



function CourseManagement() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useAdminCourses();

  const updateStatus = useUpdateAdminCourseStatus();
  const cloneCourse = useCloneAdminCourse();
  const deleteCourse = useDeleteAdminCourse();

  const [filter, setFilter] = useState("ALL");

  const courses = useMemo(() => getAdminCoursesFromResponse(data), [data]);

  const filteredCourses = useMemo(
    () =>
      filter === "ALL"
        ? courses
        : courses.filter((course) => course.status?.toUpperCase() === filter),
    [courses, filter],
  );

  const handleStatusChange = async (courseId, status) => {
    try {
      await updateStatus.mutateAsync({ courseId, status });
      toast.success(`Course status updated to ${status}`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to update course status",
      );
    }
  };

  const handleClone = async (courseId) => {
    try {
      await cloneCourse.mutateAsync(courseId);
      toast.success("Course cloned successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to clone course");
    }
  };

  if (isLoading) return <PageLoader />;

  const inputClass =
    "rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-foreground outline-none focus:border-brand-secondary   ";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Management"
        description="Create, review, edit, publish, clone and remove platform courses."
        actions={<Link to="/admin/courses/create"><Button><Plus size={16} /> Create course</Button></Link>}
      />

      {isError && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          <span>
            {error?.response?.data?.message ||
              error?.message ||
              "Unable to load courses."}
          </span>

          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { label: "All Courses", value: courses.length },
          {
            label: "Published",
            value: courses.filter(
              (course) => course.status?.toUpperCase() === "PUBLISHED",
            ).length,
          },
          {
            label: "Pending Review",
            value: courses.filter((course) =>
              ["SUBMITTED", "UNDER_REVIEW"].includes(
                course.status?.toUpperCase(),
              ),
            ).length,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-surface p-5  "
          >
            <p className="text-sm text-foreground-secondary">{stat.label}</p>
            <p className="mt-3 text-3xl font-bold text-foreground ">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-foreground ">
            Platform Courses
          </h2>
          <p className="mt-1 text-sm text-foreground-secondary">
            {filteredCourses.length} courses displayed
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className={inputClass}
          >
            <option value="ALL">All statuses</option>
            {COURSE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.replaceAll("_", " ")}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            loading={isFetching}
          >
            <RefreshCw size={15} />
            Refresh
          </Button>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-10 text-center  ">
          <BookOpen size={38} className="mx-auto mb-3 text-foreground-secondary" />
          <p className="font-semibold text-foreground ">
            No courses found
          </p>
          <p className="mt-1 text-sm text-foreground-secondary">
            There are no courses matching this status.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course, index) => {
            const courseId = course._id || course.id;
            const thumbnail =
              typeof course.thumbnail === "string"
                ? course.thumbnail
                : course.thumbnail?.url;

            const status = course.status?.toUpperCase() || "DRAFT";

            return (
              <article
                key={courseId || index}
                className="overflow-hidden rounded-2xl border border-border bg-surface  "
              >
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={course.name || "Course"}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-44 items-center justify-center bg-surface-secondary ">
                    <BookOpen size={42} className="text-brand-secondary" />
                  </div>
                )}

                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-foreground ">
                      {course.name || course.title || "Untitled course"}
                    </h3>

                    <span className="shrink-0 rounded-full bg-surface-secondary px-3 py-1 text-xs font-medium text-foreground-secondary  dark:text-accent">
                      {status.replaceAll("_", " ")}
                    </span>
                  </div>

                  <p className="line-clamp-3 min-h-14 text-sm text-foreground-secondary">
                    {course.description || "No description available."}
                  </p>

                  <div className="flex items-center justify-between text-sm text-foreground-secondary">
                    <span>Level: {course.level || "—"}</span>
                    <span>Rating: {course.rating ?? "—"}</span>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-foreground-secondary ">
                      Update course status
                    </label>

                    <select
                      value={status}
                      onChange={(event) =>
                        handleStatusChange(courseId, event.target.value)
                      }
                      disabled={
                        !courseId ||
                        updateStatus.isPending ||
                        !COURSE_STATUSES.includes(status)
                      }
                      className={`${inputClass} w-full`}
                    >
                      {COURSE_STATUSES.map((option) => (
                        <option key={option} value={option}>
                          {option.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link to={`/admin/courses/${courseId}/edit`} className="min-w-0">
                      <Button variant="outline" size="sm" className="w-full"><Pencil size={14} /> Edit</Button>
                    </Link>
                    <Button variant="outline" size="sm" className="w-full" loading={cloneCourse.isPending} disabled={!courseId || cloneCourse.isPending} onClick={() => handleClone(courseId)}>
                      <Copy size={14} /> Clone
                    </Button>
                  </div>
                  <Button variant="danger" size="sm" className="w-full" loading={deleteCourse.isPending} disabled={!courseId || deleteCourse.isPending} onClick={async () => {
                    if (!window.confirm(`Delete ${course.name || "this course"}? This cannot be undone.`)) return;
                    try {
                      await deleteCourse.mutateAsync(courseId);
                      toast.success("Course deleted successfully");
                    } catch (err) {
                      toast.error(err.message || "Unable to delete course");
                    }
                  }}>
                    <Trash2 size={14} /> Delete course
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CourseManagement;
