import { useMemo, useState } from "react";
import { CalendarDays, Percent, Plus, Tag } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";
import Button from "../../../components/ui/Button";
import { getCoupons, createCoupon } from "../../marketplace/api/marketplace.api";
import { getAdminCouponsFromResponse } from "../utils/adminData";

const initialForm = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  maxDiscount: "",
  minPurchaseAmount: "",
  courseId: "",
  usageLimit: "",
  endDate: "",
};

function Coupons() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const query = useQuery({ queryKey: ["admin", "coupons"], queryFn: getCoupons });
  const coupons = useMemo(() => getAdminCouponsFromResponse(query.data), [query.data]);

  const createMutation = useMutation({
    mutationFn: createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      toast.success("Coupon created successfully");
      setForm(initialForm);
      setShowForm(false);
    },
    onError: (error) => toast.error(error.message || "Unable to create coupon"),
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      code: form.code.trim().toUpperCase(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      endDate: new Date(form.endDate).toISOString(),
    };
    if (form.maxDiscount !== "") payload.maxDiscount = Number(form.maxDiscount);
    if (form.minPurchaseAmount !== "") payload.minPurchaseAmount = Number(form.minPurchaseAmount);
    if (form.courseId.trim()) payload.courseId = form.courseId.trim();
    if (form.usageLimit !== "") payload.usageLimit = Number(form.usageLimit);
    createMutation.mutate(payload);
  };

  if (query.isLoading) return <PageLoader />;

  const inputClass = "w-full rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-brand-secondary  dark:bg-background ";

  return (
    <div className="space-y-6">
      <PageHeader title="Coupons" description="Create discount codes and review the coupon records returned by the backend." actions={<Button onClick={() => setShowForm((value) => !value)}><Plus size={16} /> Create coupon</Button>} />
      {query.isError && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">{query.error?.message || "Unable to load coupons."}<button type="button" onClick={() => query.refetch()} className="ml-3 font-semibold underline">Retry</button></div>}
      {showForm && <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-surface p-5  "><h2 className="font-semibold text-foreground ">Create a coupon</h2><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="space-y-2 text-sm text-foreground-secondary ">Coupon code<input className={inputClass} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required /></label>
        <label className="space-y-2 text-sm text-foreground-secondary ">Discount type<select className={inputClass} value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}><option value="percentage">Percentage</option><option value="fixed">Fixed amount</option></select></label>
        <label className="space-y-2 text-sm text-foreground-secondary ">Discount value<input className={inputClass} type="number" min="0.01" step="0.01" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} required /></label>
        <label className="space-y-2 text-sm text-foreground-secondary ">Maximum discount<input className={inputClass} type="number" min="0" step="0.01" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} /></label>
        <label className="space-y-2 text-sm text-foreground-secondary ">Minimum purchase<input className={inputClass} type="number" min="0" step="0.01" value={form.minPurchaseAmount} onChange={(e) => setForm({ ...form, minPurchaseAmount: e.target.value })} /></label>
        <label className="space-y-2 text-sm text-foreground-secondary ">Usage limit<input className={inputClass} type="number" min="1" step="1" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} /></label>
        <label className="space-y-2 text-sm text-foreground-secondary ">Course ID (optional)<input className={inputClass} value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} /></label>
        <label className="space-y-2 text-sm text-foreground-secondary ">Expiry date<input className={inputClass} type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required /></label>
      </div><div className="flex gap-3"><Button type="submit" loading={createMutation.isPending}>Save coupon</Button><Button type="button" variant="outline" onClick={() => { setShowForm(false); setForm(initialForm); }}>Cancel</Button></div></form>}
      {coupons.length === 0 && !query.isError ? <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center  "><Tag size={38} className="mx-auto text-brand-secondary" /><h2 className="mt-3 font-semibold text-foreground ">No coupons found</h2><p className="mt-1 text-sm text-foreground-secondary">Create a coupon to make a discount available at checkout.</p></div> : <div className="overflow-x-auto rounded-2xl border border-border bg-surface  "><table className="w-full min-w-[760px] text-left"><thead className="bg-surface-secondary text-xs uppercase tracking-wide text-foreground-secondary  "><tr>{["Code", "Discount", "Minimum", "Maximum", "Expires", "Status"].map((label) => <th key={label} className="px-5 py-4">{label}</th>)}</tr></thead><tbody>{coupons.map((coupon, index) => { const expires = coupon.endDate ? new Date(coupon.endDate) : null; const active = !expires || expires >= new Date(); return <tr key={coupon._id || coupon.code || index} className="border-t border-border text-sm "><td className="px-5 py-4 font-semibold text-foreground ">{coupon.code || "—"}</td><td className="px-5 py-4 text-foreground-secondary "><span className="inline-flex items-center gap-1"><Percent size={14} />{coupon.discountValue ?? "—"} {coupon.discountType || ""}</span></td><td className="px-5 py-4 text-foreground-secondary ">{coupon.minPurchaseAmount ?? "—"}</td><td className="px-5 py-4 text-foreground-secondary ">{coupon.maxDiscount ?? "—"}</td><td className="px-5 py-4 text-foreground-secondary "><span className="inline-flex items-center gap-2"><CalendarDays size={14} />{expires ? expires.toLocaleDateString() : "—"}</span></td><td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-medium ${active ? "bg-surface-secondary text-foreground  dark:text-accent" : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-300"}`}>{active ? "Active" : "Expired"}</span></td></tr>; })}</tbody></table></div>}
    </div>
  );
}

export default Coupons;
