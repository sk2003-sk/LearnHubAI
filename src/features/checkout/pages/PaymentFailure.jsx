import { useNavigate } from "react-router-dom";
import { XCircle, Home, RefreshCw } from "lucide-react";

export default function PaymentFailure() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-md">
                <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
                    <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30">
                        <XCircle className="size-10 text-red-600 dark:text-red-400" />
                    </div>

                    <h1 className="mb-2 text-2xl font-bold text-foreground">Payment Failed</h1>
                    <p className="mb-8 text-foreground-secondary">
                        We couldn't process your payment. Please try again or contact support if the issue persists.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
                        >
                            <RefreshCw className="size-4" />
                            Try Again
                        </button>

                        <button
                            onClick={() => navigate("/marketplace")}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-secondary px-6 py-3 font-semibold text-foreground transition hover:bg-surface-secondary/80"
                        >
                            <Home className="size-4" />
                            Browse Courses
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
