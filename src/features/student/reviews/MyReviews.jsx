import { Star } from "lucide-react";
import PageLoader from "../../../components/common/PageLoader";
import { useCourseReviews } from "../hook/useStudentLearning";
import ReviewForm from "./ReviewForm";

function getReviews(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.reviews)) return response.reviews;
  if (Array.isArray(response?.data?.reviews)) return response.data.reviews;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function MyReviews({ courseId }) {
  const reviewsQuery = useCourseReviews(courseId);
  const reviews = getReviews(reviewsQuery.data);

  return (
    <section className="space-y-6">
      <ReviewForm courseId={courseId} />

      <div className="rounded-2xl border border-border bg-surface p-5  ">
        <h3 className="text-lg font-semibold text-foreground ">
          Course reviews
        </h3>

        {reviewsQuery.isLoading ? (
          <PageLoader />
        ) : reviewsQuery.isError ? (
          <div className="mt-4">
            <p className="text-sm text-red-600 dark:text-red-400">
              Unable to load course reviews.
            </p>
            <button
              type="button"
              onClick={() => reviewsQuery.refetch()}
              className="mt-2 text-sm font-semibold text-brand-secondary"
            >
              Try again
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <p className="mt-4 text-sm text-foreground-secondary ">
            No reviews have been submitted for this course yet.
          </p>
        ) : (
          <div className="mt-5 divide-y divide-border ">
            {reviews.map((review, index) => {
              const reviewer = review?.user?.name || review?.name || "Learner";

              return (
                <article
                  key={review?._id || review?.id || index}
                  className="py-5 first:pt-0 last:pb-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold text-foreground ">
                      {reviewer}
                    </p>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          size={15}
                          className={
                            starIndex < Number(review?.rating || 0)
                              ? "fill-[#D7A94B] text-[#D7A94B]"
                              : "text-foreground-secondary "
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {review?.comment && (
                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-foreground-secondary ">
                      {review.comment}
                    </p>
                  )}

                  {(review?.createdAt || review?.updatedAt) && (
                    <p className="mt-3 text-xs text-foreground-secondary ">
                      {new Date(
                        review.createdAt || review.updatedAt,
                      ).toLocaleDateString()}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default MyReviews;
