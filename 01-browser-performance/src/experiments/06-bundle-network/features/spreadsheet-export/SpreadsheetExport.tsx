import * as XLSX from "xlsx";
import type { Report } from "../../data/reports";

export function SpreadsheetExport({
  reports,
  onClose,
}: {
  reports: Report[];
  onClose: () => void;
}) {
  const downloadWorkbook = () => {
    const rows = reports.map((report) => ({
      "Report ID": report.id,
      Report: report.title,
      Owner: report.owner,
      Region: report.region,
      Status: report.status,
      Period: report.period,
      "Open incidents": report.incidents,
      Updated: report.updatedAt,
    }));
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Operations reports");
    XLSX.writeFileXLSX(workbook, "operations-report.xlsx", {
      compression: true,
    });
  };

  return (
    <section className="reporting-tool-panel" aria-labelledby="export-heading">
      <div className="reporting-tool-heading">
        <div>
          <p className="section-label">Spreadsheet export</p>
          <h2 id="export-heading">Export the current report view</h2>
        </div>
        <button
          className="icon-button"
          onClick={onClose}
          type="button"
          aria-label="Close export panel"
        >
          ×
        </button>
      </div>
      <p>
        Create an XLSX workbook containing the {reports.length} reports that
        match the dashboard filters.
      </p>
      <button
        className="primary-button"
        onClick={downloadWorkbook}
        type="button"
      >
        Download workbook
      </button>
    </section>
  );
}
