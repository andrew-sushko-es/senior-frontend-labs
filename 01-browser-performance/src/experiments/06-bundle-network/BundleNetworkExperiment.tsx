import { useMemo, useState } from "react";
import {
  FeatureActions,
  type ReportingTool,
} from "./components/FeatureActions";
import { RecentReportsTable } from "./components/RecentReportsTable";
import { SummaryMetrics } from "./components/SummaryMetrics";
import { reports, type ReportStatus } from "./data/reports";
import { AdvancedAnalytics } from "./features/advanced-analytics/AdvancedAnalytics";
import { DocumentPreview } from "./features/document-preview/DocumentPreview";
import { ReportTemplateEditor } from "./features/report-template-editor/ReportTemplateEditor";
import { SpreadsheetExport } from "./features/spreadsheet-export/SpreadsheetExport";

const statusOptions: Array<ReportStatus | "All statuses"> = [
  "All statuses",
  "Published",
  "In review",
  "Scheduled",
];

export function BundleNetworkExperiment() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ReportStatus | "All statuses">(
    "All statuses",
  );
  const [openTool, setOpenTool] = useState<ReportingTool | null>(null);

  const filteredReports = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesSearch =
        !normalizedSearch ||
        report.title.toLowerCase().includes(normalizedSearch) ||
        report.owner.toLowerCase().includes(normalizedSearch) ||
        report.id.toLowerCase().includes(normalizedSearch);
      const matchesStatus =
        status === "All statuses" || report.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="experiment-layout bundle-network-experiment">
      <section
        className="reproduction-panel"
        aria-labelledby="bundle-tools-heading"
      >
        <p className="section-label" id="bundle-tools-heading">
          Suggested tools
        </p>
        <ul>
          <li>Network</li>
          <li>Coverage</li>
          <li>Performance</li>
          <li>Bundle analyzer</li>
        </ul>
        <ol>
          <li>Keep all optional tools closed.</li>
          <li>Enable Disable cache.</li>
          <li>Start a cold reload.</li>
          <li>Inspect JavaScript transferred during startup.</li>
          <li>Run Coverage without opening any optional tool.</li>
          <li>Inspect the production bundle report.</li>
        </ol>
      </section>

      <article
        className="reporting-dashboard"
        aria-label="Operations Reporting Console"
      >
        <header className="reporting-dashboard-header">
          <div>
            <p className="reporting-brand">Northstar Operations</p>
            <h2>Operations Reporting Console</h2>
            <p>
              Monitor report readiness and prepare the next operational review.
            </p>
          </div>
          <span className="reporting-period">September 2026 · Week 39</span>
        </header>

        <SummaryMetrics />

        <section className="reporting-filters" aria-label="Report filters">
          <label>
            Search reports
            <input
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Report name, owner, or ID"
              type="text"
              value={search}
            />
          </label>
          <label>
            Status
            <select
              onChange={(event) =>
                setStatus(event.target.value as ReportStatus | "All statuses")
              }
              value={status}
            >
              {statusOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </section>

        <FeatureActions onOpen={setOpenTool} />

        {openTool === "export" ? (
          <SpreadsheetExport
            reports={filteredReports}
            onClose={() => setOpenTool(null)}
          />
        ) : null}
        {openTool === "preview" ? (
          <DocumentPreview
            reports={filteredReports}
            onClose={() => setOpenTool(null)}
          />
        ) : null}
        {openTool === "template" ? (
          <ReportTemplateEditor onClose={() => setOpenTool(null)} />
        ) : null}
        {openTool === "analytics" ? (
          <AdvancedAnalytics onClose={() => setOpenTool(null)} />
        ) : null}

        <RecentReportsTable reports={filteredReports.slice(0, 8)} />
      </article>
    </div>
  );
}
