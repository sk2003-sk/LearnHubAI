import { useMemo, useState } from "react";
import { CalendarDays, CreditCard, Package, Search, UserRound } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";
import Button from "../../../components/ui/Button";
import { getAdminOrders } from "../api/orders.api";
import { getAdminOrdersFromResponse, getOrderReference, getPaymentStatus } from "../utils/adminData";

function Orders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const query = useQuery({ queryKey: ["admin", "orders"], queryFn: getAdminOrders, staleTime: 30_000 });
  const orders = useMemo(() => getAdminOrdersFromResponse(query.data), [query.data]);

  const filteredOrders = useMemo(() => orders.filter((order) => {
    const status = String(getPaymentStatus(order)).toLowerCase();
    const haystack = [getOrderReference(order), order.userId, order.courseId, order.payment_info?.id, status].filter(Boolean).join(" ").toLowerCase();
    const matchesSearch = haystack.includes(search.trim().toLowerCase());
    const matchesStatus = statusFilter === "all" || (statusFilter === "paid" ? ["succeeded", "paid", "complete", "completed"].includes(status) : !["succeeded", "paid", "complete", "completed"].includes(status));
    return matchesSearch && matchesStatus;
  }), [orders, search, statusFilter]);

  if (query.isLoading) return <PageLoader />;

  const paidOrders = orders.filter((order) => ["succeeded", "paid", "complete", "completed"].includes(String(getPaymentStatus(order)).toLowerCase())).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Order Management" description="Review course orders and the payment details returned by the backend." />
      {query.isError && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">{query.error?.response?.data?.message || query.error?.message || "Unable to load orders."}<Button size="sm" variant="outline" className="ml-3" onClick={() => query.refetch()}>Retry</Button></div>}
      <div className="grid gap-4 sm:grid-cols-2"><article className="rounded-2xl border border-border bg-surface p-5  "><div className="flex items-center justify-between text-sm text-foreground-secondary "><span>Total orders</span><Package size={19} className="text-brand-secondary" /></div><p className="mt-3 text-3xl font-semibold text-foreground ">{orders.length}</p></article><article className="rounded-2xl border border-border bg-surface p-5  "><div className="flex items-center justify-between text-sm text-foreground-secondary "><span>Successful payments</span><CreditCard size={19} className="text-brand-secondary" /></div><p className="mt-3 text-3xl font-semibold text-foreground ">{paidOrders}</p></article></div>
      <section className="space-y-4 rounded-2xl border border-border bg-surface p-5  ">
        <div className="flex flex-col gap-3 md:flex-row"><div className="relative flex-1"><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-secondary" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order, user, course or payment ID" className="w-full rounded-xl border border-border bg-surface-secondary py-3 pl-11 pr-4 text-sm text-foreground outline-none focus:border-brand-secondary  dark:bg-background " /></div><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm text-foreground outline-none  dark:bg-background "><option value="all">All payment states</option><option value="paid">Successful</option><option value="other">Other / unknown</option></select></div>
        {filteredOrders.length === 0 ? <div className="py-12 text-center"><Package size={36} className="mx-auto text-brand-secondary" /><p className="mt-3 font-semibold text-foreground ">No orders found</p><p className="mt-1 text-sm text-foreground-secondary">Orders will appear here when returned by the admin orders endpoint.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="text-xs uppercase tracking-wide text-foreground-secondary "><tr>{["Order", "User ID", "Course ID", "Payment", "Created"].map((label) => <th key={label} className="border-b border-border px-4 py-4 ">{label}</th>)}</tr></thead><tbody>{filteredOrders.map((order, index) => { const status = getPaymentStatus(order); return <tr key={order._id || order.id || index} className="border-b border-border last:border-0 "><td className="px-4 py-4 text-sm font-semibold text-foreground ">{String(getOrderReference(order)).slice(-12)}</td><td className="px-4 py-4 text-sm text-foreground-secondary "><span className="inline-flex items-center gap-2"><UserRound size={14} />{typeof order.userId === "object" ? order.userId?._id || order.userId?.name : order.userId || "—"}</span></td><td className="px-4 py-4 text-sm text-foreground-secondary ">{typeof order.courseId === "object" ? order.courseId?._id || order.courseId?.name : order.courseId || "—"}</td><td className="px-4 py-4"><div className="space-y-1"><span className="inline-flex rounded-full bg-surface-secondary px-3 py-1 text-xs font-medium capitalize text-foreground  dark:text-accent">{status}</span>{order.payment_info?.id && <p className="text-xs text-foreground-secondary">{order.payment_info.id}</p>}</div></td><td className="px-4 py-4 text-sm text-foreground-secondary "><span className="inline-flex items-center gap-2"><CalendarDays size={14} />{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}</span></td></tr>; })}</tbody></table></div>}
        <p className="text-xs text-foreground-secondary ">Showing {filteredOrders.length} of {orders.length} orders. The documented order response does not include a guaranteed amount, currency, or populated user/course object, so those values are not fabricated.</p>
      </section>
    </div>
  );
}

export default Orders;
