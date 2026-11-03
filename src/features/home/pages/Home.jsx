import { useMemo } from "react";
import { ArrowRight, Award, GraduationCap, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import MarketplaceNavbar from "../../../components/navigation/MarketplaceNavbar";
import CourseGrid from "../../courses/components/CourseGrid";
import { usePublicCourses } from "../../courses/hooks/useCourses";
import { getCourseThumbnail } from "../../courses/utils/courseHelpers";
import { useAuth } from "../../auth/hooks/useAuth";
import { ROUTES } from "../../../constants/routes";

const features = [
  {
    icon: GraduationCap,
    title: "Expert-led courses",
    description: "Structured lessons built by instructors who know the craft.",
  },
  {
    icon: PlayCircle,
    title: "Learn at your pace",
    description: "Start anytime and pick up right where you left off.",
  },
  {
    icon: Award,
    title: "Earn certificates",
    description: "Complete courses and collect certificates for your progress.",
  },
];

function Home() {
  const { isAuthenticated } = useAuth();
  const { data: courses = [], isLoading, isError, refetch } = usePublicCourses();

  const heroCourse = useMemo(
    () =>
      courses.find((course) => {
        const searchable = `${course.name ?? ""} ${Array.isArray(course.tags) ? course.tags.join(" ") : course.tags ?? ""}`.toLowerCase();
        return !searchable.includes("java") && Boolean(getCourseThumbnail(course));
      }),
    [courses],
  );

  const heroImage = getCourseThumbnail(heroCourse);
  const featuredCourses = courses.slice(0, 6);

  return (
    <>
      <MarketplaceNavbar />

      <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <section className="mb-10 grid overflow-hidden rounded-[2rem] border border-border bg-surface-secondary dark:bg-surface lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col justify-center px-7 py-10 sm:px-10 lg:px-12 lg:py-14">
              <span className="mb-4 inline-flex w-fit rounded-full bg-surface/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary dark:bg-surface-secondary dark:text-accent">
                LearnHub learning space
              </span>
              <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
                Learn. Build.{" "}
                <span className="text-brand-secondary dark:text-accent">Grow.</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-foreground-secondary">
                Build practical skills with structured courses, expert-led lessons
                and a learning experience designed around your goals.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to={ROUTES.MARKETPLACE}
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-secondary dark:bg-accent dark:text-accent-foreground"
                >
                  Explore courses
                  <ArrowRight size={16} className="ml-2" />
                </Link>

                {isAuthenticated ? (
                  <Link
                    to={ROUTES.DASHBOARD}
                    className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface/60 dark:border-border dark:hover:bg-surface-secondary"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    to={ROUTES.REGISTER}
                    className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface/60 dark:border-border dark:hover:bg-surface-secondary"
                  >
                    Create account
                  </Link>
                )}
              </div>
            </div>
            <div className="relative min-h-64 overflow-hidden bg-surface-secondary lg:min-h-[420px]">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt={heroCourse?.name || "Featured LearnHub course"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-secondary to-border dark:from-surface-secondary dark:to-background">
                  <span className="text-7xl font-semibold text-brand-secondary/50">LH</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-strong/55 via-transparent to-transparent" />
              {heroCourse && (
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                    Featured learning
                  </p>
                  <p className="mt-2 max-w-md text-xl font-semibold text-white">
                    {heroCourse.name}
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="mb-12 grid gap-4 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-surface p-5"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-surface-secondary text-brand-secondary dark:text-accent">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-foreground-secondary">
                  {description}
                </p>
              </div>
            ))}
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Featured Courses
                </h2>
                <p className="mt-1 text-sm text-foreground-secondary">
                  Explore our popular courses and start learning.
                </p>
              </div>

              <Link
                to={ROUTES.MARKETPLACE}
                className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-secondary hover:underline"
              >
                View all
                <ArrowRight size={15} />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-border bg-surface"
                  >
                    <div className="aspect-video animate-pulse bg-surface-secondary" />
                    <div className="space-y-3 p-5">
                      <div className="h-3 w-1/3 animate-pulse rounded bg-surface-secondary" />
                      <div className="h-5 w-4/5 animate-pulse rounded bg-surface-secondary" />
                      <div className="h-4 w-full animate-pulse rounded bg-surface-secondary" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-2xl border border-red-200 bg-surface p-8 text-center dark:border-red-900">
                <h3 className="font-semibold text-foreground">Unable to load courses</h3>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white dark:bg-accent dark:text-accent-foreground"
                >
                  Try again
                </button>
              </div>
            ) : (
              <CourseGrid courses={featuredCourses} />
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export default Home;
