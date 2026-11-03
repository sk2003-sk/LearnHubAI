import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Home, BookOpen } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { ROUTES } from "../../../constants/routes";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const courseId = location.state?.courseId;
  const isDemoPayment = Boolean(location.state?.demo);

  useEffect(() => {
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["student", "my-learning"] }),
      queryClient.invalidateQueries({ queryKey: ["student", "orders"] }),
      queryClient.invalidateQueries({ queryKey: ["student", "enrollments"] }),
      queryClient.invalidateQueries({ queryKey: ["student", "course"] }),
      queryClient.invalidateQueries({ queryKey: ["student", "progress-analytics"] }),
      queryClient.invalidateQueries({ queryKey: ["learning", "my"] }),
    ]);
  }, [queryClient]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 text-center shadow-[var(--shadow)]">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-success/10">
          <CheckCircle className="size-10 text-success" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-foreground">
          Enrollment confirmed
        </h1>
        <p className="mb-3 text-foreground-secondary">
          Your order is complete and the course has been added to your learning
          library.
        </p>
        {isDemoPayment && (
          <p className="mb-5 rounded-xl bg-surface-secondary px-4 py-2 text-xs font-medium text-foreground-secondary">
            Completed with test payment — no real card was charged.
          </p>
        )}
        <div className="mt-8 space-y-3">
          <button
            onClick={() =>
              navigate(ROUTES.MY_LEARNING, {
                replace: true,
                state: { courseId },
              })
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <BookOpen className="size-4" />
            Go to My Learning
          </button>
          <button
            onClick={() => navigate(ROUTES.MARKETPLACE)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 font-semibold text-foreground transition hover:bg-surface-secondary"
          >
            <Home className="size-4" />
            Browse Courses
          </button>
        </div>
      </div>
    </div>
  );
}
