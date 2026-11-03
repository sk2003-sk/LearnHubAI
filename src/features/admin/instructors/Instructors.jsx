import { useMemo, useState } from "react";
import { Search, Users, GraduationCap, ShieldCheck, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";
import Button from "../../../components/ui/Button";
import { getAdminInstructors } from "../api/admin.api";
import { getAdminInstructorsFromResponse } from "../utils/adminData";

function Instructors() {
  const [search, setSearch] = useState("");
  const query = useQuery({ queryKey: ["admin", "instructors"], queryFn: getAdminInstructors });
  const instructors = useMemo(() => getAdminInstructorsFromResponse(query.data), [query.data]);
  const filtered = instructors.filter((item) => [item.name, item.email, item._id].filter(Boolean).join(" ").toLowerCase().includes(search.trim().toLowerCase()));

  if (query.isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <PageHeader title="Instructor Management" description="Review instructor and administrator accounts returned by the instructor dashboard API." />
      {query.isError && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">{query.error?.message || "Unable to load instructors."}<Button size="sm" variant="outline" className="ml-3" onClick={() => query.refetch()}><RefreshCw size={14} /> Retry</Button></div>}
      <div className="grid gap-4 sm:grid-cols-2"><article className="rounded-2xl border border-border bg-surface p-5  "><div className="flex items-center justify-between text-sm text-foreground-secondary "><span>Accounts returned</span><Users size={19} className="text-brand-secondary" /></div><p className="mt-3 text-3xl font-semibold text-foreground ">{instructors.length}</p></article><article className="rounded-2xl border border-border bg-surface p-5  "><div className="flex items-center justify-between text-sm text-foreground-secondary "><span>Instructor accounts</span><GraduationCap size={19} className="text-brand-secondary" /></div><p className="mt-3 text-3xl font-semibold text-foreground ">{instructors.filter((item) => item.role === "instructor").length}</p></article></div>
      <section className="rounded-2xl border border-border bg-surface p-5  "><div className="relative"><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-secondary" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by instructor name, email or ID" className="w-full rounded-xl border border-border bg-surface-secondary py-3 pl-11 pr-4 text-sm text-foreground outline-none focus:border-brand-secondary  dark:bg-background " /></div>
        {filtered.length === 0 ? <div className="py-12 text-center"><GraduationCap size={36} className="mx-auto text-brand-secondary" /><p className="mt-3 font-semibold text-foreground ">No instructor accounts found</p><p className="mt-1 text-sm text-foreground-secondary">Try changing your search.</p></div> : <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead className="text-xs uppercase tracking-wide text-foreground-secondary "><tr>{["Instructor", "Role", "Verification", "User ID"].map((label) => <th key={label} className="border-b border-border px-4 py-4 ">{label}</th>)}</tr></thead><tbody>{filtered.map((item, index) => <tr key={item._id || index} className="border-b border-border last:border-0 "><td className="px-4 py-4"><p className="font-medium text-foreground ">{item.name || "Unnamed account"}</p><p className="mt-1 text-xs text-foreground-secondary">{item.email || "Email unavailable"}</p></td><td className="px-4 py-4 text-sm capitalize text-foreground-secondary ">{item.role || "—"}</td><td className="px-4 py-4"><span className="inline-flex items-center gap-2 text-sm text-foreground-secondary "><ShieldCheck size={15} className={item.isVerified ? "text-brand-secondary" : "text-muted-gold"} />{item.isVerified ? "Verified" : "Unverified"}</span></td><td className="px-4 py-4 text-xs text-foreground-secondary">{item._id || "—"}</td></tr>)}</tbody></table></div>}
      </section>
    </div>
  );
}

export default Instructors;
