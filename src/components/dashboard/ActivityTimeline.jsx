import { Clock3 } from "lucide-react";

export default function ActivityTimeline({ items = [], emptyMessage = "No recent activity" }) {
  if (!items.length) return <p className="rounded-xl bg-surface-secondary p-5 text-sm text-foreground-secondary  ">{emptyMessage}</p>;
  return <ol className="space-y-4">{items.map((item, index) => <li key={item.id ?? item._id ?? index} className="flex gap-3"><span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-secondary text-brand-secondary "><Clock3 size={15} /></span><div className="min-w-0 flex-1"><p className="text-sm font-medium text-foreground ">{item.title ?? item.message ?? "Activity"}</p>{item.description && <p className="mt-1 text-xs text-foreground-secondary ">{item.description}</p>}{item.createdAt && <p className="mt-1 text-xs text-foreground-secondary">{new Date(item.createdAt).toLocaleString()}</p>}</div></li>)}</ol>;
}
