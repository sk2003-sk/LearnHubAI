import { useState } from "react";
import { Tag, X, Check } from "lucide-react";
import { toast } from "sonner";
import { validateCoupon } from "../../marketplace/api/marketplace.api";

export default function CouponInput({ courseId, onCouponApplied }) {
  const [code, setCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleApplyCoupon = async (event) => {
    event.preventDefault();
    if (!code.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsValidating(true);
    try {
      const response = await validateCoupon({ courseId, code: code.trim().toUpperCase() });
      const result = response?.data ?? response;
      if (result?.payable == null) {
        throw new Error(result?.message || "The coupon response did not include a payable amount.");
      }

      const coupon = { code: code.trim().toUpperCase(), discount: result.discount };
      setAppliedCoupon(coupon);
      onCouponApplied(coupon, Number(result.payable));
      setCode("");
      toast.success("Coupon applied successfully");
    } catch (error) {
      toast.error(error.message || "Invalid or expired coupon");
    } finally {
      setIsValidating(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    onCouponApplied(null, null);
    toast.info("Coupon removed");
  };

  if (appliedCoupon) {
    return <div className="flex items-center justify-between rounded-xl border border-border bg-surface-secondary p-4  "><div className="flex items-center gap-2"><Check size={18} className="text-brand-secondary" /><div><p className="font-semibold text-foreground ">{appliedCoupon.code}</p><p className="text-xs text-foreground-secondary ">Discount: {appliedCoupon.discount ?? "Applied"}</p></div></div><button type="button" onClick={removeCoupon} className="rounded-lg p-2 text-foreground-secondary hover:bg-surface dark:text-accent " aria-label="Remove coupon"><X size={17} /></button></div>;
  }

  return <form onSubmit={handleApplyCoupon} className="flex gap-2"><div className="relative min-w-0 flex-1"><Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-secondary" /><input type="text" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="Enter coupon code" className="w-full rounded-xl border border-border bg-surface-secondary py-3 pl-10 pr-3 text-sm text-foreground outline-none focus:border-brand-secondary  dark:bg-background " /></div><button type="submit" disabled={isValidating} className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-secondary disabled:opacity-50 dark:bg-accent dark:text-accent-foreground">{isValidating ? "Checking..." : "Apply"}</button></form>;
}
