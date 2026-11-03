import { Link } from "react-router-dom";
import { BookOpen, Plus, Pencil, Send } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";
import Button from "../../../components/ui/Button";
import {
  useInstructorCourses,
  useSubmitInstructorCourse,
} from "../hook/useInstructior";

function getCourses(response) {
  if (Array.isArray(response)) return response;
  return response?.courses ?? response?.data?.courses ?? response?.result?.courses ?? [];
}

function InstructorCourses() {
  const coursesQuery = useInstructorCourses();
  const submitMutation = useSubmitInstructorCourse();

  const courses = getCourses(coursesQuery.data);

  const handleSubmit = async (courseId) => {
    try {
      await submitMutation.mutateAsync(courseId);
      toast.success("Course submitted for review.");
    } catch (error) {
      toast.error(error?.message || "Unable to submit course.");
    }
  };

  if (coursesQuery.isLoading) return <PageLoader />;

  return (
    <div>
      <PageHeader
        title="My Courses"
        description="Create, manage and submit your courses for review."
        actions={
          <Link to="/instructor/courses/create">
            <Button>
              <Plus size={17} />
              Create course
            </Button>
          </Link>
        }
      />

      {coursesQuery.isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
          <p className="text-sm text-red-700 dark:text-red-300">
            Unable to load your courses.
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => coursesQuery.refetch()}
          >
            Try again
          </Button>
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center  ">
          <BookOpen size={42} className="mx-auto text-brand-secondary" />
          <h2 className="mt-4 text-lg font-semibold text-foreground ">
            No courses yet
          </h2>
          <p className="mt-2 text-sm text-foreground-secondary ">
            Create your first course and start building your classroom.
          </p>
          <Link to="/instructor/courses/create" className="mt-5 inline-block">
            <Button>
              <Plus size={17} />
              Create your first course
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const courseId = course._id || course.id;
            const thumbnail =
              typeof course.thumbnail === "string"
                ? course.thumbnail
                : course.thumbnail?.url;

            return (
              <article
                key={courseId}
                className="overflow-hidden rounded-2xl border border-border bg-surface  "
              >
                <div className="aspect-video bg-surface-secondary ">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={course.name || "Course"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen size={38} className="text-brand-secondary" />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="line-clamp-2 font-semibold text-foreground ">
                      {course.name || "Untitled course"}
                    </h2>

                    <span className="shrink-0 rounded-full bg-surface-secondary px-3 py-1 text-xs font-medium text-foreground-secondary  dark:text-accent">
                      {course.status || "Draft"}
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm text-foreground-secondary ">
                    {course.description || "No description added."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link
                      to={`/instructor/courses/${courseId}/edit`}
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full">
                        <Pencil size={15} />
                        Edit
                      </Button>
                    </Link>

                    <Button
                      variant="secondary"
                      onClick={() => handleSubmit(courseId)}
                      loading={
                        submitMutation.isPending &&
                        submitMutation.variables === courseId
                      }
                      disabled={
                        submitMutation.isPending ||
                        ["SUBMITTED", "UNDER_REVIEW", "PUBLISHED"].includes(
                          course.status,
                        )
                      }
                    >
                      <Send size={15} />
                      Submit
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default InstructorCourses;
