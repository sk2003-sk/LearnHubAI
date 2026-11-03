import { useMemo, useState } from "react";
import { Bell, Check, Clock3, RefreshCw } from "lucide-react";
import { useNotifications, useUpdateNotificationStatus } from "../hook/useNotifications";
import { getAdminNotificationsFromResponse } from "../utils/adminData";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";
import Button from "../../../components/ui/Button";

function AdminNotifications() {
  const [filter, setFilter] = useState("all");
  const query = useNotifications();
  const updateStatus = useUpdateNotificationStatus();
  const notifications = useMemo(() => getAdminNotificationsFromResponse(query.data), [query.data]);
  const filtered = notifications.filter((item) => {
    const unread = String(item.status || "unread").toLowerCase() === "unread";
    return filter === "all" || (filter === "unread" ? unread : !unread);
  });

  if (query.isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="Review platform notifications and mark items as read." />
      {query.isError && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">{query.error?.message || "Unable to load notifications."}<Button size="sm" variant="outline" className="ml-3" onClick={() => query.refetch()}><RefreshCw size={14} /> Retry</Button></div>}
      <div className="flex flex-wrap gap-2">{[{ value: "all", label: `All (${notifications.length})` }, { value: "unread", label: `Unread (${notifications.filter((item) => String(item.status || "unread").toLowerCase() === "unread").length})` }, { value: "read", label: "Read" }].map((item) => <button key={item.value} type="button" onClick={() => setFilter(item.value)} className={`rounded-xl px-4 py-2 text-sm font-medium transition ${filter === item.value ? "bg-primary text-white dark:bg-accent dark:text-accent-foreground" : "bg-surface text-foreground-secondary hover:bg-surface-secondary   "}`}>{item.label}</button>)}</div>
      {filtered.length === 0 && !query.isError ? <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center  "><Bell size={36} className="mx-auto text-brand-secondary" /><p className="mt-3 font-semibold text-foreground ">No notifications found</p><p className="mt-1 text-sm text-foreground-secondary">New platform notifications will appear here.</p></div> : <div className="space-y-3">{filtered.map((item, index) => { const unread = String(item.status || "unread").toLowerCase() === "unread"; const id = item._id ?? item.id; return <article key={id || index} className="rounded-2xl border border-border bg-surface p-5  "><div className="flex flex-wrap items-start justify-between gap-4"><div className="flex min-w-0 gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-secondary text-foreground  dark:text-accent"><Bell size={19} /></span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold text-foreground ">{item.title || "Notification"}</h2>{unread && <span className="rounded-full bg-surface-secondary px-2.5 py-1 text-xs font-medium text-foreground  dark:text-accent">Unread</span>}</div><p className="mt-2 text-sm leading-6 text-foreground-secondary ">{item.message || "No message provided."}</p><p className="mt-3 flex items-center gap-2 text-xs text-foreground-secondary "><Clock3 size={14} />{item.createdAt ? new Date(item.createdAt).toLocaleString() : "Date unavailable"}</p></div></div>{unread && <Button size="sm" variant="outline" disabled={!id || updateStatus.isPending} loading={updateStatus.isPending && updateStatus.variables === id} onClick={() => updateStatus.mutate(id)}><Check size={15} /> Mark read</Button>}</div></article>; })}</div>}
    </div>
  );
}

export default AdminNotifications;
