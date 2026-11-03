import { Download } from "lucide-react";
import { toast } from "sonner";
import Button from "../../../components/ui/Button";
import { useExportAdminEnrollments } from "../hook/useAdmin";

export default function ExportReports() {
  const mutation = useExportAdminEnrollments();
  const exportCsv = async () => {
    try {
      const blob = await mutation.mutateAsync();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "learnhub-enrollments.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success("Enrollment report downloaded");
    } catch (error) {
      toast.error(error.message || "Unable to export enrollment report");
    }
  };
  return <Button variant="outline" onClick={exportCsv} loading={mutation.isPending}><Download size={16} /> Export enrollments</Button>;
}
