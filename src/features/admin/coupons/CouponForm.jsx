import { useState } from "react";
import Button from "../../../components/ui/Button";

const initialForm = { code: "", discountType: "percentage", discountValue: "", maxDiscount: "", minPurchaseAmount: "", courseId: "", usageLimit: "", endDate: "" };

export default function CouponForm({ onSubmit, onCancel, isSubmitting = false, initialData = initialForm }) {
  const [form, setForm] = useState(() => ({ ...initialForm, ...initialData }));
  const inputClass = "w-full rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-brand-secondary  dark:bg-background ";
  const submit = (event) => {
    event.preventDefault();
    onSubmit?.({ code: form.code.trim().toUpperCase(), discountType: form.discountType, discountValue: Number(form.discountValue), ...(form.maxDiscount !== "" ? { maxDiscount: Number(form.maxDiscount) } : {}), ...(form.minPurchaseAmount !== "" ? { minPurchaseAmount: Number(form.minPurchaseAmount) } : {}), ...(form.courseId ? { courseId: form.courseId } : {}), ...(form.usageLimit !== "" ? { usageLimit: Number(form.usageLimit) } : {}), endDate: new Date(form.endDate).toISOString() });
  };
  return <form onSubmit={submit} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2">{[{ key: "code", label: "Coupon code", type: "text", required: true }, { key: "discountValue", label: "Discount value", type: "number", required: true }, { key: "maxDiscount", label: "Maximum discount", type: "number" }, { key: "minPurchaseAmount", label: "Minimum purchase", type: "number" }, { key: "courseId", label: "Course ID (optional)", type: "text" }, { key: "usageLimit", label: "Usage limit", type: "number" }, { key: "endDate", label: "Expiry date", type: "datetime-local", required: true }].map((field) => <label key={field.key} className="space-y-2 text-sm text-foreground-secondary ">{field.label}<input type={field.type} required={field.required} value={form[field.key]} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} className={inputClass} /></label>)}<label className="space-y-2 text-sm text-foreground-secondary ">Discount type<select className={inputClass} value={form.discountType} onChange={(event) => setForm({ ...form, discountType: event.target.value })}><option value="percentage">Percentage</option><option value="fixed">Fixed amount</option></select></label></div><div className="flex gap-3"><Button type="submit" loading={isSubmitting}>Save coupon</Button>{onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}</div></form>;
}
