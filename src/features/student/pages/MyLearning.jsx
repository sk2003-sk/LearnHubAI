import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, RefreshCw } from "lucide-react";
import { getCourseThumbnail } from "../../courses/utils/courseHelpers";
import PageHeader from "../../../components/common/PageHeader";
import Button from "../../../components/ui/Button";
import { ROUTES } from "../../../constants/routes";
import { useStudentLearning } from "../hook/useStudentLearning";
function MyLearning() {
  const { courses, isLoading, isError, refetch } = useStudentLearning();

  return (
    <div>
      <PageHeader
        title="My Learning"
        description="Access your purchased courses and continue learning."
      />

      {isLoading && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-2xl bg-surface-secondary "
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
          <p className="font-semibold text-red-700 dark:text-red-300">
            Unable to load your courses.
          </p>
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            Please check your connection or sign in again.
          </p>
          <Button className="mt-4" onClick={() => refetch()}>
            <RefreshCw size={16} />
            Try again
          </Button>
        </div>
      )}

      {!isLoading && !isError && courses.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center  ">
          <div className="mb-4 rounded-full bg-surface-secondary p-5 ">
            <GraduationCap
              size={34}
              className="text-foreground dark:text-accent"
            />
          </div>
          <h2 className="text-xl font-semibold text-foreground ">
            No courses yet
          </h2>
          <p className="mt-2 max-w-md text-sm text-foreground-secondary ">
            Explore the marketplace and purchase a course to start your learning
            journey.
          </p>
          <Link to={ROUTES.MARKETPLACE} className="mt-6">
            <Button>Explore courses</Button>
          </Link>
        </div>
      )}

      {!isLoading && !isError && courses.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const thumbnail = getCourseThumbnail(course);

            return (
              <article
                key={course._id}
                className="overflow-hidden rounded-2xl border border-border bg-surface  "
              >
                <div className="aspect-video overflow-hidden bg-surface-secondary ">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={course.name || "Course"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen size={40} className="text-brand-secondary" />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="line-clamp-2 text-lg font-semibold text-foreground ">
                    {course.name || "Untitled course"}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm text-foreground-secondary ">
                    {course.description || "Continue learning this course."}
                  </p>

                  <Link
                    to={`/student/learning/${course._id}`}
                    className="mt-5 block"
                  >
                    <Button block>
                      <BookOpen size={16} />
                      Continue learning
                    </Button>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyLearning;
