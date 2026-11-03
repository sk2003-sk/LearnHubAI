import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import MarketplaceNavbar from "../../../components/navigation/MarketplaceNavbar";
import CourseGrid from "../components/CourseGrid";
import { usePublicCourses } from "../hooks/useCourses";

function MarketPlace() {
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const {
    data: courses = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = usePublicCourses();

  const levels = useMemo(() => {
    const availableLevels = courses
      .map((course) => course.level)
      .filter(Boolean);

    return ["All", ...new Set(availableLevels)];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return courses.filter((course) => {
      const searchableValues = [
        course.name,
        course.description,
        ...(Array.isArray(course.tags) ? course.tags : [course.tags]),
        course.level,
      ].filter((value) => typeof value === "string");

      const matchesSearch =
        !normalizedSearch ||
        searchableValues.some((value) =>
          value.toLowerCase().includes(normalizedSearch),
        );

      const matchesLevel =
        selectedLevel === "All" || course.level === selectedLevel;

      return matchesSearch && matchesLevel;
    });
  }, [courses, search, selectedLevel]);

  return (
    <>
      <MarketplaceNavbar />

      <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              All Courses
            </h1>
            <p className="mt-2 text-sm text-foreground-secondary">
              Browse the full catalog and find the course that fits your goals.
            </p>
          </div>

          <section id="courses" className="mb-8 rounded-2xl border border-border bg-surface p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-secondary"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by course name, topic, or level..."
                  className="w-full rounded-xl border border-border bg-surface-secondary py-3 pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-brand-secondary focus:ring-2 focus:ring-ring/20   "
                />
              </div>

              <div className="flex items-center gap-3 lg:w-64">
                <SlidersHorizontal
                  size={18}
                  className="shrink-0 text-foreground-secondary"
                />

                <select
                  value={selectedLevel}
                  onChange={(event) => setSelectedLevel(event.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-secondary px-3 py-3 text-sm text-foreground outline-none focus:border-brand-secondary   "
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level === "All" ? "All levels" : level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground ">
                Courses
              </h2>

              {!isLoading && (
                <p className="mt-1 text-sm text-foreground-secondary ">
                  {filteredCourses.length} courses found
                </p>
              )}
            </div>

            {isFetching && !isLoading && (
              <span className="text-xs text-foreground-secondary ">
                Updating...
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-border bg-surface  "
                >
                  <div className="aspect-video animate-pulse bg-surface-secondary " />
                  <div className="space-y-3 p-5">
                    <div className="h-3 w-1/3 animate-pulse rounded bg-surface-secondary " />
                    <div className="h-5 w-4/5 animate-pulse rounded bg-surface-secondary " />
                    <div className="h-4 w-full animate-pulse rounded bg-surface-secondary " />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-red-200 bg-surface p-8 text-center dark:border-red-900 ">
              <h3 className="font-semibold text-foreground ">
                Unable to load courses
              </h3>

              <p className="mt-2 text-sm text-foreground-secondary ">
                {error?.message || "Something went wrong. Please try again."}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white dark:bg-accent dark:text-accent-foreground"
              >
                Try again
              </button>
            </div>
          ) : filteredCourses.length > 0 ? (
            <CourseGrid courses={filteredCourses} />
          ) : (
            <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center  ">
              <h3 className="text-lg font-semibold text-foreground ">
                No courses found
              </h3>

              <p className="mt-2 text-sm text-foreground-secondary ">
                Try another search term or select a different level.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedLevel("All");
                }}
                className="mt-5 text-sm font-semibold text-brand-secondary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default MarketPlace;
