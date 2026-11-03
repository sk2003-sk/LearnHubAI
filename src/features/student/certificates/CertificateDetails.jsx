import { ArrowLeft, Award, Download } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";
import { ROUTES } from "../../../constants/routes";
import {
  useDownloadStudentCertificate,
  useStudentCertificate,
} from "../hook/useStudentLearning";

function CertificateDetails() {
  const { certificateId } = useParams();

  const certificateQuery = useStudentCertificate(certificateId);
  const downloadMutation = useDownloadStudentCertificate();

  const certificate =
    certificateQuery.data?.certificate ||
    certificateQuery.data?.data?.certificate ||
    certificateQuery.data?.data ||
    certificateQuery.data;

  const handleDownload = async () => {
    try {
      const blob = await downloadMutation.mutateAsync(certificateId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      return;
    }
  };

  if (certificateQuery.isLoading) return <PageLoader />;

  if (certificateQuery.isError || !certificate) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/20">
        <h2 className="font-semibold text-red-700 dark:text-red-300">
          Unable to load certificate
        </h2>
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          The certificate may not exist or you may not have permission to view
          it.
        </p>
        <Link
          to={ROUTES.CERTIFICATES}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-300"
        >
          <ArrowLeft size={16} />
          Back to certificates
        </Link>
      </div>
    );
  }

  const courseName =
    certificate?.course?.name ||
    certificate?.courseName ||
    certificate?.title ||
    "Course Certificate";

  const issuedDate = certificate?.issuedAt || certificate?.createdAt;

  return (
    <div className="space-y-6">
      <Link
        to={ROUTES.CERTIFICATES}
        className="inline-flex items-center gap-2 text-sm font-medium text-foreground-secondary hover:text-foreground  dark:hover:text-accent"
      >
        <ArrowLeft size={17} />
        Back to certificates
      </Link>

      <PageHeader
        title="Certificate Details"
        description="Review your earned course certificate."
      />

      <div className="mx-auto max-w-3xl rounded-2xl border border-muted-gold bg-surface p-8 text-center shadow-sm dark:border-border  sm:p-12">
        <Award
          size={56}
          className="mx-auto text-[#9B8150] dark:text-accent"
        />

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-foreground-secondary ">
          Certificate of Completion
        </p>

        <h2 className="mt-5 text-2xl font-bold text-foreground ">
          {courseName}
        </h2>

        {issuedDate && (
          <p className="mt-4 text-sm text-foreground-secondary ">
            Issued on {new Date(issuedDate).toLocaleDateString()}
          </p>
        )}

        <button
          onClick={handleDownload}
          disabled={downloadMutation.isPending}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white disabled:opacity-60 dark:bg-accent dark:text-accent-foreground"
        >
          <Download size={17} />
          {downloadMutation.isPending ? "Preparing PDF..." : "Download PDF"}
        </button>
      </div>
    </div>
  );
}

export default CertificateDetails;
