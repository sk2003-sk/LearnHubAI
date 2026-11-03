import { Clock3, Star, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WishlistButton from "../../student/wishlist/WishlistButton";
import formatCurrency from "../../../utils/formatCurrency";
import {
  getCourseId,
  getCourseRating,
  getCourseThumbnail,
} from "../utils/courseHelpers";

function formatPrice(value) {
  if (value === null || value === undefined || value === "") {
    return "Price unavailable";
  }

  const amount = Number(value);
  return Number.isFinite(amount) ? formatCurrency(amount) : "Price unavailable";
}

function CourseCard({ course }) {
  const navigate = useNavigate();

  const thumbnail = getCourseThumbnail(course);
  const courseId = getCourseId(course);
  const rating = getCourseRating(course);

  return (
    <article
      onClick={() => {
        if (courseId) {
          navigate(`/marketplace/${courseId}`);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" && courseId) {
          navigate(`/marketplace/${courseId}`);
        }
      }}
      role="button"
      tabIndex={courseId ? 0 : -1}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-surface transition duration-200 hover:-translate-y-1 hover:shadow-lg  "
    >
      <div className="relative aspect-video overflow-hidden bg-surface-secondary ">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={course?.name || "Course thumbnail"}
            className="size-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(event) => { event.currentTarget.src = "/images/default-course.svg"; }}
          />
        ) : (
          <img src="/images/default-course.svg" alt="LearnHub course" className="size-full object-cover" />
        )}

        {course?.level && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
            {course.level}
          </span>
        )}

        {courseId && (
          <WishlistButton
            courseId={courseId}
            className="absolute right-3 top-3 z-10"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-3 text-xs text-foreground-secondary ">
          {rating > 0 && (
            <span className="flex items-center gap-1">
              <Star size={14} className="fill-[#D7A94B] text-[#D7A94B]" />
              {rating.toFixed(1)}
            </span>
          )}

          {typeof course?.purchased === "number" && (
            <span className="flex items-center gap-1">
              <Users size={14} />
              {course.purchased} learners
            </span>
          )}
        </div>

        <h2 className="mt-3 line-clamp-2 text-base font-semibold text-foreground ">
          {course?.name || "Untitled course"}
        </h2>

        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-foreground-secondary ">
          {course?.description || "Explore this course to learn more."}
        </p>

        {course?.tags && (
          <p className="mt-3 line-clamp-1 text-xs text-foreground-secondary ">
            {course.tags}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4 ">
          <div>
            <p className="text-lg font-bold text-foreground dark:text-accent">
              {formatPrice(course?.price)}
            </p>

            {typeof course?.estimatedPrice === "number" &&
              course.estimatedPrice > (course?.price ?? 0) && (
                <p className="text-xs text-foreground-secondary line-through ">
                  {formatPrice(course.estimatedPrice)}
                </p>
              )}
          </div>

          <span className="flex items-center gap-1 text-sm font-semibold text-brand-secondary">
            View course
            <Clock3 size={15} />
          </span>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;
