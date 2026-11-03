import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import Button from "../../../components/ui/Button";
import { useCreateCourseReview } from "../hook/useStudentLearning";

function ReviewForm({ courseId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const reviewMutation = useCreateCourseReview();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!rating) {
      toast.error("Please select a rating.");
      return;
    }

    try {
      await reviewMutation.mutateAsync({
        courseId,
        rating,
        comment: comment.trim() || undefined,
      });

      setRating(0);
      setComment("");
      toast.success("Your review has been submitted.");
    } catch (error) {
      toast.error(error?.message || "Unable to submit your review.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface p-5  "
    >
      <h3 className="text-lg font-semibold text-foreground ">
        Share your experience
      </h3>

      <p className="mt-1 text-sm text-foreground-secondary ">
        How would you rate this course?
      </p>

      <div className="mt-4 flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            aria-label={`Rate ${value} out of 5`}
            aria-pressed={rating === value}
            className="rounded-md p-1 transition hover:scale-110"
          >
            <Star
              size={27}
              className={
                value <= rating
                  ? "fill-[#D7A94B] text-[#D7A94B]"
                  : "text-foreground-secondary "
              }
            />
          </button>
        ))}

        <span className="ml-2 text-sm font-medium text-foreground-secondary ">
          {rating ? `${rating}/5` : "Select rating"}
        </span>
      </div>

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        rows={4}
        maxLength={1000}
        placeholder="Write your feedback about this course..."
        className="mt-5 w-full resize-y rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-brand-secondary focus:ring-2 focus:ring-ring/20   "
      />

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-xs text-foreground-secondary ">
          {comment.length}/1000 characters
        </span>

        <Button
          type="submit"
          disabled={!rating || reviewMutation.isPending}
          loading={reviewMutation.isPending}
        >
          Submit review
        </Button>
      </div>
    </form>
  );
}

export default ReviewForm;
