import { CheckCircle2, ShieldCheck } from "lucide-react";
import formatCurrency from "../../../utils/formatCurrency";

export default function DemoPaymentForm({
  amount,
  courseName,
  isProcessing,
  onPay,
  onCancel,
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-surface-secondary p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground-secondary">
              Amount due
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {formatCurrency(Number(amount ?? 0))}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            <CheckCircle2 size={14} />
            Test payment
          </span>
        </div>
      </div>

      <div className="flex gap-3 rounded-xl border border-border bg-background p-4">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand-secondary" />
        <div className="space-y-1 text-sm">
          <p className="font-medium text-foreground">
            No real card is charged
          </p>
          <p className="text-foreground-secondary">
            This demo API simulates the payment. Confirming creates your order
            and unlocks{" "}
            <span className="font-medium text-foreground">
              {courseName || "this course"}
            </span>{" "}
            immediately.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onPay}
          disabled={isProcessing}
          className="flex-1 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing
            ? "Completing order..."
            : `Pay ${formatCurrency(Number(amount ?? 0))}`}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-secondary disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
