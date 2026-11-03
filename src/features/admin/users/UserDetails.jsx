import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAdminUsers } from "../hook/useAdminUsers";
import PageLoader from "../../../components/common/PageLoader";
import PageHeader from "../../../components/common/PageHeader";

export default function UserDetails() {
  const { userId } = useParams();
  const query = useAdminUsers();
  const user = useMemo(() => query.data?.find((item) => item._id === userId), [query.data, userId]);
  if (query.isLoading) return <PageLoader />;
  if (query.isError) return <p className="text-sm text-red-600">{query.error?.message || "Unable to load users."}</p>;
  if (!user) return <p className="text-sm text-foreground-secondary">User not found.</p>;
  return <div className="space-y-5"><PageHeader title="User details" description="Account information returned by the user dashboard API." /><div className="rounded-2xl border border-border bg-surface p-6  "><h2 className="text-lg font-semibold text-foreground ">{user.name || "Unnamed user"}</h2><dl className="mt-5 grid gap-4 sm:grid-cols-2">{[["User ID", user._id], ["Email", user.email], ["Role", user.role], ["Verified", user.isVerified ? "Yes" : "No"], ["Joined", user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"]].map(([label, value]) => <div key={label}><dt className="text-xs uppercase text-foreground-secondary">{label}</dt><dd className="mt-1 break-all text-sm text-foreground ">{value || "—"}</dd></div>)}</dl></div></div>;
}
