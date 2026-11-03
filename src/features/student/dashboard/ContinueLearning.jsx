import { ArrowRight, BookOpen, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";

function ContinueLearning({ courses = [], isLoading, isError }) {
  if (isLoading) {
    return (
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-foreground ">
          Continue Learning
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-48 animate-pulse rounded-2xl bg-surface-secondary dark:bg-surface"
            />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/20">
        <p className="text-sm text-red-700 dark:text-red-300">
          Unable to load your enrolled courses. Please try again later.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground ">
            Continue Learning
          </h2>
          <p className="mt-1 text-sm text-foreground-secondary ">
            Pick up where you left off.
          </p>
        </div>

        <Link
          to={ROUTES.MY_LEARNING}
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-brand-secondary dark:text-accent"
        >
          View all
          <ArrowRight size={16} />
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border bg-surface p-8 text-center  ">
          <BookOpen
            size={32}
            className="mx-auto text-brand-secondary dark:text-accent"
          />
          <h3 className="mt-3 font-semibold text-foreground ">
            No enrolled courses yet
          </h3>
          <p className="mt-2 text-sm text-foreground-secondary ">
            Explore the marketplace and enroll in a course to start learning.
          </p>
          <Link
            to={ROUTES.MARKETPLACE}
            className="mt-5 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-secondary dark:bg-accent dark:text-accent-foreground"
          >
            Explore courses
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {courses.slice(0, 4).map((course) => {
            const thumbnail =
              typeof course.thumbnail === "string"
                ? course.thumbnail
                : course.thumbnail?.url;

            const learningPath = ROUTES.COURSE_LEARNING.replace(
              ":courseId",
              course._id,
            );

            return (
              <article
                key={course._id}
                className="overflow-hidden rounded-2xl border border-border bg-surface  "
              >
                <div className="h-36 overflow-hidden bg-surface-secondary ">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={course.name || "Course"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen
                        size={38}
                        className="text-brand-secondary dark:text-accent"
                      />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="line-clamp-2 font-semibold text-foreground ">
                    {course.name || "Untitled course"}
                  </h3>

                  <p className="mt-2 text-sm text-foreground-secondary ">
                    {course.level || "Course"}
                  </p>

                  <Link
                    to={learningPath}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-secondary dark:bg-accent dark:text-accent-foreground"
                  >
                    <PlayCircle size={17} />
                    Continue Learning
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ContinueLearning;
