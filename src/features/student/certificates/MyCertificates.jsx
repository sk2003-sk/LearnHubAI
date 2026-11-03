import { Award, Download, Eye, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";
import { ROUTES } from "../../../constants/routes";
import { getCertificatesFromResponse } from "../utils/studentHelpers";
import { useDownloadStudentCertificate, useStudentCertificates } from "../hook/useStudentLearning";

function MyCertificates() {
  const certificatesQuery = useStudentCertificates();
  const downloadMutation = useDownloadStudentCertificate();
  const certificates = getCertificatesFromResponse(certificatesQuery.data);

  const handleDownload = async (certificateId) => {
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
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Unable to download certificate");
    }
  };

  if (certificatesQuery.isLoading) return <PageLoader />;

  return <div className="space-y-6">
    <PageHeader title="My Certificates" description="View and download the certificates you have earned." />
    {certificatesQuery.isError ? <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/20"><p className="text-sm text-red-700 dark:text-red-300">{certificatesQuery.error?.response?.data?.message || certificatesQuery.error?.message || "Unable to load your certificates."}</p><button onClick={() => certificatesQuery.refetch()} className="mt-3 text-sm font-semibold underline">Retry</button></div> : certificates.length === 0 ? <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center"><Award size={42} className="mx-auto text-[var(--brand-secondary)]" /><h2 className="mt-4 font-semibold text-[var(--foreground)]">No certificates yet</h2><p className="mt-2 text-sm text-[var(--foreground-secondary)]">Complete every lesson in an enrolled course to earn a certificate.</p><Link to={ROUTES.MY_LEARNING} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white"><GraduationCap size={17} />Go to My Learning</Link></div> : <div className="grid gap-5 md:grid-cols-2">{certificates.map((certificate, index) => {
      const certificateId = certificate?._id || certificate?.id || certificate?.certificateId;
      const courseName = certificate?.course?.name || certificate?.courseName || certificate?.course?.title || certificate?.title || "Course Certificate";
      const issuedDate = certificate?.issuedAt || certificate?.createdAt;
      return <article key={certificateId || index} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"><div className="flex items-start justify-between gap-4"><div className="flex size-12 items-center justify-center rounded-xl bg-[var(--surface-secondary)] text-[var(--brand)]"><Award size={25} /></div><span className="rounded-full bg-[var(--surface-secondary)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]">Earned</span></div><h2 className="mt-5 font-semibold text-[var(--foreground)]">{courseName}</h2>{issuedDate && <p className="mt-2 text-sm text-[var(--foreground-secondary)]">Issued {new Date(issuedDate).toLocaleDateString()}</p>}{certificateId ? <div className="mt-5 flex flex-wrap gap-3"><Link to={ROUTES.CERTIFICATE_DETAILS.replace(":certificateId", certificateId)} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)]"><Eye size={16} />View</Link><button onClick={() => handleDownload(certificateId)} disabled={downloadMutation.isPending} className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"><Download size={16} />Download</button></div> : <p className="mt-4 text-xs text-[var(--foreground-secondary)]">Certificate identifier is unavailable.</p>}</article>;
    })}</div>}
  </div>;
}

export default MyCertificates;
