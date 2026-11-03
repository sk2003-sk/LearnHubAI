import { AlertCircle } from "lucide-react";
import PageHeader from "../../../components/common/PageHeader";

export default function EditLecture() {
  return <div className="space-y-5"><PageHeader title="Edit Lecture" description="Lecture editing is not exposed by the current backend API contract." /><div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200"><AlertCircle size={19} className="mt-0.5 shrink-0" /><p>The available instructor API supports creating lectures and retrieving lectures by section, but it does not document an update or delete lecture operation. This screen is intentionally read-only until the backend exposes those operations.</p></div></div>;
}
