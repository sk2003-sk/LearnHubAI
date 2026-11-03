import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";
import { getAdminOrdersFromResponse, getOrderReference, getPaymentStatus } from "../utils/adminData";
import { getAdminOrders } from "../api/orders.api";

export default function OrderDetails() {
  const { orderId } = useParams();
  const query = useQuery({ queryKey: ["admin", "orders"], queryFn: getAdminOrders });
  if (query.isLoading) return <PageLoader />;
  const order = getAdminOrdersFromResponse(query.data).find((item) => String(item._id ?? item.id) === orderId);
  if (!order) return <p className="text-sm text-foreground-secondary">Order not found.</p>;
  return <div className="space-y-5"><PageHeader title="Order details" description="Order data returned by the backend." /><div className="rounded-2xl border border-border bg-surface p-6  "><dl className="grid gap-4 sm:grid-cols-2">{[["Order ID", getOrderReference(order)], ["User ID", order.userId], ["Course ID", order.courseId], ["Payment status", getPaymentStatus(order)], ["Payment reference", order.payment_info?.id], ["Created", order.createdAt ? new Date(order.createdAt).toLocaleString() : "—"]].map(([label, value]) => <div key={label}><dt className="text-xs uppercase text-foreground-secondary">{label}</dt><dd className="mt-1 break-all text-sm text-foreground ">{value || "—"}</dd></div>)}</dl></div></div>;
}
