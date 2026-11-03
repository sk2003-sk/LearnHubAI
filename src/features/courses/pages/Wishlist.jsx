import { useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { Heart, BookOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "../../../components/common/PageHeader";
import {
  useCourseWishlist,
  useToggleCourseWishlist,
} from "../hooks/useCourses";
import { getCourseById } from "../../marketplace/api/marketplace.api";
import {
  getCourseFromResponse,
  getCoursesFromResponse,
  getCourseId,
  getCourseThumbnail,
} from "../utils/courseHelpers";
import formatCurrency from "../../../utils/formatCurrency";

function Wishlist() {
  const navigate = useNavigate();

  const {
    data: wishlistResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useCourseWishlist();

  const toggleWishlist = useToggleCourseWishlist();
  const wishlistItems = getCoursesFromResponse(wishlistResponse);
  const detailQueries = useQueries({
    queries: wishlistItems.map((item) => {
      const courseId = getCourseId(item);
      return {
        queryKey: ["courses", "detail", courseId],
        queryFn: () => getCourseById(courseId),
        enabled: Boolean(courseId),
        staleTime: 60_000,
      };
    }),
  });
  const courses = wishlistItems.map((item, index) => {
    const response = detailQueries[index]?.data;
    if (!response) return item;
    const course = getCourseFromResponse(response);
    return { ...item, ...course, _id: getCourseId(course) ?? getCourseId(item) };
  });
  const isLoadingCourses = isLoading || detailQueries.some((query) => query.isLoading);

  const handleRemove = async (courseId) => {
    try {
      await toggleWishlist.mutateAsync(courseId);
      toast.success("Course removed from wishlist");
    } catch (mutationError) {
      toast.error(mutationError?.message || "Unable to update your wishlist");
    }
  };

  return (
    <div>
      <PageHeader
        title="My wishlist"
        description="Keep track of the courses you want to learn."
      />

      {isLoadingCourses ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-2xl bg-surface-secondary "
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-border bg-surface p-8 text-center  ">
          <p className="font-semibold text-foreground ">
            Unable to load your wishlist
          </p>
          <p className="mt-2 text-sm text-foreground-secondary ">
            {error?.message || "Please try again."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white dark:bg-accent dark:text-accent-foreground"
          >
            Try again
          </button>
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center  ">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-surface-secondary text-brand-secondary ">
            <Heart size={26} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-foreground ">
            Your wishlist is empty
          </h2>

          <p className="mt-2 text-sm text-foreground-secondary ">
            Explore the marketplace and save courses you are interested in.
          </p>

          <button
            type="button"
            onClick={() => navigate("/marketplace")}
            className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white dark:bg-accent dark:text-accent-foreground"
          >
            Explore courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const thumbnail = getCourseThumbnail(course);
            const courseId = getCourseId(course);
            const isRemoving =
              toggleWishlist.isPending &&
              String(toggleWishlist.variables) === String(courseId);

            return (
              <article
                key={courseId}
                className="overflow-hidden rounded-2xl border border-border bg-surface  "
              >
                <button
                  type="button"
                  onClick={() => navigate(`/marketplace/${courseId}`)}
                  className="block aspect-video w-full bg-surface-secondary text-left "
                >
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={course.name || "Course thumbnail"}
                      className="size-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-brand-secondary">
                      <BookOpen size={42} />
                    </div>
                  )}
                </button>

                <div className="p-5">
                  <h2 className="line-clamp-2 font-semibold text-foreground ">
                    {course.name || "Untitled course"}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-foreground-secondary ">
                    {course.description || "Explore this course to learn more."}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="font-bold text-foreground dark:text-accent">
                      {Number.isFinite(Number(course.price))
                        ? formatCurrency(Number(course.price))
                        : "Price unavailable"}
                    </span>

                    <button
                      type="button"
                      disabled={isRemoving || !courseId}
                      onClick={() => handleRemove(courseId)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <Trash2 size={15} />
                      {isRemoving ? "Removing..." : "Remove"}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/checkout/${courseId}`)}
                    disabled={!courseId}
                    className="mt-4 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                  >
                    Enroll now
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
