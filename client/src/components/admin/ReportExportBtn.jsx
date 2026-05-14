// Triggers PDF revenue report download via the report API
import { useState } from "react";
import { IoDownloadOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { exportRevenuePDFApi } from "../../api/report.api.js";

const ReportExportBtn = ({
  from,
  to,
  label = "Export PDF",
  className = "",
}) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      const response = await exportRevenuePDFApi({ from, to });

      // Build a blob URL and trigger a download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `magzineer-revenue-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Report downloaded.");
    } catch {
      toast.error("Failed to export PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className={`btn-primary inline-flex items-center gap-2 disabled:opacity-60 ${className}`}
    >
      <IoDownloadOutline size={16} />
      {loading ? "Exporting..." : label}
    </button>
  );
};

export default ReportExportBtn;
