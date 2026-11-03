import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";
import { getAdminInstructors } from "../api/admin.api";
import { getAdminInstructorsFromResponse } from "../utils/adminData";

export default function InstructorDetails() {
  const { instructorId } = useParams();
  const query = useQuery({ queryKey: ["admin", "instructors"], queryFn: getAdminInstructors });
  if (query.isLoading) return <PageLoader />;
  const instructor = getAdminInstructorsFromResponse(query.data).find((item) => item._id === instructorId);
  if (!instructor) return <p className="text-sm text-foreground-secondary">Instructor not found.</p>;
  return <div className="space-y-5"><PageHeader title="Instructor details" description="Account details returned by the instructor management endpoint." /><div className="rounded-2xl border border-border bg-surface p-6  "><h2 className="text-lg font-semibold text-foreground ">{instructor.name || "Instructor"}</h2><p className="mt-2 text-sm text-foreground-secondary">{instructor.email || "Email unavailable"}</p><p className="mt-3 text-xs text-foreground-secondary">ID: {instructor._id}</p></div></div>;
}
