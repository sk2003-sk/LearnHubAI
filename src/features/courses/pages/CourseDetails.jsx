import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  Heart,
  PlayCircle,
  Star,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../auth/hooks/useAuth";
import MarketplaceNavbar from "../../../components/navigation/MarketplaceNavbar";
import {
  useCourse,
  useCourseCurriculum,
  useCourseWishlist,
  useToggleCourseWishlist,
} from "../hooks/useCourses";
import {
  getCourseFromResponse,
  getCourseId,
  getCourseRating,
  getCoursesFromResponse,
  getCourseThumbnail,
  getCurriculumItemsFromResponse,
  getCourseTags,
} from "../utils/courseHelpers";
import { ROUTES } from "../../../constants/routes";
import formatCurrency from "../../../utils/formatCurrency";

function formatPrice(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? formatCurrency(amount) : "Price unavailable";
}

function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const {
    data: courseResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useCourse(courseId);

  const { data: curriculumResponse, isLoading: curriculumLoading } =
    useCourseCurriculum(courseId);

  const { data: wishlistResponse } = useCourseWishlist(isAuthenticated);
  const toggleWishlist = useToggleCourseWishlist();

  const course = getCourseFromResponse(courseResponse);
  const wishlistCourses = getCoursesFromResponse(wishlistResponse);

  const isWishlisted = wishlistCourses.some(
    (item) => getCourseId(item) === courseId,
  );

  const thumbnail = getCourseThumbnail(course);

  const curriculumItems = getCurriculumItemsFromResponse(curriculumResponse);
  const courseTags = getCourseTags(course);
  const courseRating = getCourseRating(course);

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, {
        state: { from: { pathname: `/marketplace/${courseId}` } },
      });
      return;
    }

    try {
      await toggleWishlist.mutateAsync(courseId);
      toast.success(
        isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      );
    } catch (mutationError) {
      toast.error(mutationError?.message || "Unable to update your wishlist");
    }
  };

  if (isLoading) {
    return (
      <>
        <MarketplaceNavbar />
        <main className="min-h-screen bg-background px-4 py-10 ">
          <div className="mx-auto max-w-6xl animate-pulse space-y-6">
            <div className="h-8 w-40 rounded bg-surface-secondary " />
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="aspect-video rounded-2xl bg-surface-secondary " />
              <div className="space-y-4">
                <div className="h-8 w-3/4 rounded bg-surface-secondary " />
                <div className="h-4 w-full rounded bg-surface-secondary " />
                <div className="h-4 w-2/3 rounded bg-surface-secondary " />
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (isError || !course?._id) {
    return (
      <>
        <MarketplaceNavbar />
        <main className="min-h-screen bg-background px-4 py-16 ">
          <div className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-8 text-center  ">
            <h1 className="text-xl font-bold text-foreground ">
              Unable to load this course
            </h1>
            <p className="mt-2 text-sm text-foreground-secondary ">
              {error?.message || "The course may not exist or is unavailable."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white dark:bg-accent dark:text-accent-foreground"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => navigate(ROUTES.MARKETPLACE)}
              className="mt-3 block w-full text-sm font-medium text-brand-secondary"
            >
              Back to marketplace
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <MarketplaceNavbar />

      <main className="min-h-screen bg-background px-4 py-8  sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <button
            type="button"
            onClick={() => navigate(ROUTES.MARKETPLACE)}
            className="mb-6 flex items-center gap-2 text-sm font-semibold text-foreground-secondary hover:text-foreground  dark:hover:text-accent"
          >
            <ArrowLeft size={17} />
            Back to courses
          </button>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="aspect-video overflow-hidden rounded-2xl bg-surface-secondary ">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={course.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <BookOpen size={64} className="text-brand-secondary" />
                  </div>
                )}
              </div>

              <section className="mt-8 rounded-2xl border border-border bg-surface p-6  ">
                <h2 className="text-xl font-bold text-foreground ">
                  About this course
                </h2>
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-foreground-secondary ">
                  {course.description || "No course description available."}
                </p>

                {courseTags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {courseTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-surface-secondary px-3 py-1 text-xs font-medium text-foreground-secondary  "
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </section>

              <section className="mt-6 rounded-2xl border border-border bg-surface p-6  ">
                <h2 className="text-xl font-bold text-foreground ">
                  What you'll learn
                </h2>

                {course.benefits?.length > 0 ? (
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {course.benefits.map((benefit, index) => (
                      <li
                        key={`${benefit.title}-${index}`}
                        className="flex items-start gap-2 text-sm text-foreground-secondary "
                      >
                        <CheckCircle2
                          size={17}
                          className="mt-0.5 shrink-0 text-brand-secondary"
                        />
                        {benefit.title}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-foreground-secondary ">
                    No benefits have been added to this course.
                  </p>
                )}
              </section>

              <section className="mt-6 rounded-2xl border border-border bg-surface p-6  ">
                <h2 className="text-xl font-bold text-foreground ">
                  Prerequisites
                </h2>

                {course.prerequisites?.length > 0 ? (
                  <ul className="mt-4 space-y-3">
                    {course.prerequisites.map((item, index) => (
                      <li
                        key={`${item.title}-${index}`}
                        className="flex items-start gap-2 text-sm text-foreground-secondary "
                      >
                        <CheckCircle2
                          size={17}
                          className="mt-0.5 shrink-0 text-brand-secondary"
                        />
                        {item.title}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-foreground-secondary ">
                    No prerequisites have been added.
                  </p>
                )}
              </section>
            </div>

            <aside>
              <div className="sticky top-24 rounded-2xl border border-border bg-surface p-6 shadow-sm  ">
                {course.level && (
                  <span className="inline-flex rounded-full bg-surface-secondary px-3 py-1 text-xs font-semibold text-foreground  dark:text-accent">
                    {course.level}
                  </span>
                )}

                <h1 className="mt-4 text-2xl font-bold leading-tight text-foreground ">
                  {course.name}
                </h1>

                <div className="mt-5 flex flex-wrap gap-4 text-sm text-foreground-secondary ">
                  {courseRating > 0 && (
                    <span className="flex items-center gap-1">
                      <Star
                        size={16}
                        className="fill-[#D7A94B] text-[#D7A94B]"
                      />
                      {courseRating.toFixed(1)}
                    </span>
                  )}

                  {typeof course.purchased === "number" && (
                    <span className="flex items-center gap-1">
                      <Users size={16} />
                      {course.purchased} learners
                    </span>
                  )}
                </div>

                <div className="my-6 border-t border-border " />

                <p className="text-3xl font-bold text-foreground dark:text-accent">
                  {formatPrice(course.price)}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate(ROUTES.LOGIN, { state: { from: { pathname: `/checkout/${courseId}` } } });
                      return;
                    }
                    navigate(`/checkout/${courseId}`);
                  }}
                  className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-secondary dark:bg-accent dark:text-accent-foreground"
                >
                  Enroll in this course
                </button>

                {typeof course.estimatedPrice === "number" &&
                  course.estimatedPrice > (course.price ?? 0) && (
                    <p className="mt-1 text-sm text-foreground-secondary line-through ">
                      {formatPrice(course.estimatedPrice)}
                    </p>
                  )}

                <button
                  type="button"
                  onClick={handleWishlist}
                  disabled={toggleWishlist.isPending}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-brand-secondary px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-60 dark:text-accent "
                >
                  <Heart
                    size={18}
                    className={isWishlisted ? "fill-current" : ""}
                  />
                  {toggleWishlist.isPending
                    ? "Updating..."
                    : isWishlisted
                      ? "Remove from wishlist"
                      : "Add to wishlist"}
                </button>

                <div className="mt-6 space-y-4 border-t border-border pt-5 text-sm text-foreground-secondary  ">
                  <p className="flex items-center gap-3">
                    <BookOpen size={17} />
                    Course access details
                  </p>
                  <p className="flex items-center gap-3">
                    <PlayCircle size={17} />
                    Curriculum available below
                  </p>
                  <p className="flex items-center gap-3">
                    <Clock3 size={17} />
                    Learn at your own pace
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <section className="mt-8 rounded-2xl border border-border bg-surface p-6  ">
            <h2 className="text-xl font-bold text-foreground ">
              Course curriculum
            </h2>

            {curriculumLoading ? (
              <p className="mt-4 text-sm text-foreground-secondary ">
                Loading curriculum...
              </p>
            ) : curriculumItems.length > 0 ? (
              <div className="mt-4 space-y-3">
                {curriculumItems.map((item, index) => (
                  <div
                    key={item._id || item.id || index}
                    className="rounded-xl bg-background p-4 dark:bg-surface-secondary"
                  >
                    <div className="flex items-center gap-3">
                      <PlayCircle
                        size={18}
                        className="shrink-0 text-brand-secondary"
                      />
                      <div>
                        <p className="text-sm font-semibold text-foreground ">
                          {item.title || item.name || `Lesson ${index + 1}`}
                        </p>
                        {item.sectionTitle && (
                          <p className="mt-1 text-xs text-foreground-secondary ">{item.sectionTitle}</p>
                        )}
                        {item.description && (
                          <p className="mt-1 text-xs text-foreground-secondary ">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-foreground-secondary ">
                {curriculumResponse
                  ? "No curriculum items are available in the returned response."
                  : "Curriculum information is not available."}
              </p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export default CourseDetails;
