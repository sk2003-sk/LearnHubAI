import { Heart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../auth/hooks/useAuth";
import { ROUTES } from "../../../constants/routes";
import {
  useCourseWishlist,
  useToggleCourseWishlist,
} from "../../courses/hooks/useCourses";
import {
  getCourseId,
  getCoursesFromResponse,
} from "../../courses/utils/courseHelpers";

export default function WishlistButton({ courseId, className = "" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const wishlistQuery = useCourseWishlist(isAuthenticated && Boolean(courseId));
  const toggleMutation = useToggleCourseWishlist();

  const isSaved = getCoursesFromResponse(wishlistQuery.data).some(
    (course) => String(getCourseId(course)) === String(courseId),
  );

  const toggle = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!courseId) return;

    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, {
        state: { from: { pathname: location.pathname } },
      });
      return;
    }

    try {
      await toggleMutation.mutateAsync(courseId);
      toast.success(isSaved ? "Removed from wishlist" : "Added to wishlist");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to update wishlist",
      );
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!courseId || toggleMutation.isPending}
      aria-pressed={isSaved}
      aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
      title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
      className={`inline-flex items-center justify-center rounded-full border border-border bg-surface/95 p-2 text-brand-secondary shadow-sm backdrop-blur transition hover:bg-surface-secondary disabled:opacity-50 ${className}`}
    >
      <Heart
        size={18}
        className={isSaved ? "fill-current" : ""}
        strokeWidth={2.2}
      />
    </button>
  );
}
