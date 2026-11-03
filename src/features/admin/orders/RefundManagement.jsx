import { useMemo, useState } from "react";
import { AlertCircle, RefreshCw, RotateCcw } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";
import Button from "../../../components/ui/Button";
import { getAdminOrders, processRefund } from "../api/orders.api";
import { getAdminOrdersFromResponse, getOrderReference, getPaymentStatus } from "../utils/adminData";

function RefundManagement() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const ordersQuery = useQuery({ queryKey: ["admin", "orders"], queryFn: getAdminOrders, staleTime: 30_000 });
  const orders = useMemo(() => getAdminOrdersFromResponse(ordersQuery.data), [ordersQuery.data]);
  const refundMutation = useMutation({
    mutationFn: processRefund,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["student", "my-learning"] });
      toast.success("Refund request processed");
      setSelectedOrder(null);
    },
    onError: (error) => toast.error(error.message || "Unable to process refund"),
  });

  if (ordersQuery.isLoading) return <PageLoader />;

  const handleRefund = () => {
    const orderId = selectedOrder?._id ?? selectedOrder?.id ?? selectedOrder?.orderId;
    if (!orderId) return;
    if (window.confirm("Process a full refund for this order? The backend will handle the refund and enrollment removal.")) {
      refundMutation.mutate({ orderId });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Refund Management" description="Select an order and request a refund through the documented backend operation." />
      {ordersQuery.isError && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">{ordersQuery.error?.response?.data?.message || ordersQuery.error?.message || "Unable to load orders."}<Button size="sm" variant="outline" className="ml-3" onClick={() => ordersQuery.refetch()}><RefreshCw size={14} /> Retry</Button></div>}
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-border bg-surface p-5  "><h2 className="font-semibold text-foreground ">Orders</h2><div className="mt-4 space-y-3">{orders.length === 0 ? <div className="py-10 text-center text-sm text-foreground-secondary">No orders are available for refund.</div> : orders.map((order, index) => { const id = order._id ?? order.id; const selected = selectedOrder && id === (selectedOrder._id ?? selectedOrder.id); return <button key={id || index} type="button" onClick={() => setSelectedOrder(order)} className={`w-full rounded-xl border p-4 text-left transition ${selected ? "border-brand-secondary bg-surface-secondary " : "border-border hover:border-brand-secondary "}`}><div className="flex flex-wrap items-center justify-between gap-2"><span className="font-semibold text-foreground ">Order #{String(getOrderReference(order)).slice(-12)}</span><span className="rounded-full bg-surface-secondary px-3 py-1 text-xs capitalize text-foreground-secondary dark:bg-surface dark:text-accent">{getPaymentStatus(order)}</span></div><p className="mt-2 text-xs text-foreground-secondary">Course: {typeof order.courseId === "object" ? order.courseId?._id : order.courseId || "—"}</p><p className="mt-1 text-xs text-foreground-secondary">User: {typeof order.userId === "object" ? order.userId?._id : order.userId || "—"}</p></button>; })}</div></section>
        <section className="h-fit rounded-2xl border border-border bg-surface p-5  "><h2 className="font-semibold text-foreground ">Confirm refund</h2>{!selectedOrder ? <div className="py-10 text-center"><AlertCircle size={34} className="mx-auto text-brand-secondary" /><p className="mt-3 text-sm text-foreground-secondary">Choose an order to review it before requesting a refund.</p></div> : <div className="mt-4 space-y-4"><div className="rounded-xl bg-background p-4 text-sm "><p className="text-foreground-secondary">Order ID</p><p className="mt-1 break-all font-semibold text-foreground ">{getOrderReference(selectedOrder)}</p><p className="mt-3 text-foreground-secondary">Payment reference</p><p className="mt-1 break-all font-medium text-foreground ">{selectedOrder.payment_info?.id || "Not supplied"}</p></div><p className="text-xs leading-5 text-foreground-secondary">The API contract accepts only the order ID. It processes the refund and removes the related enrollment; a custom amount or reason is not accepted by this endpoint.</p><Button block onClick={handleRefund} loading={refundMutation.isPending} disabled={refundMutation.isPending || !(selectedOrder._id || selectedOrder.id || selectedOrder.orderId)}><RotateCcw size={16} /> Process full refund</Button><Button block variant="outline" onClick={() => setSelectedOrder(null)} disabled={refundMutation.isPending}>Cancel</Button></div>}</section>
      </div>
    </div>
  );
}

export default RefundManagement;
