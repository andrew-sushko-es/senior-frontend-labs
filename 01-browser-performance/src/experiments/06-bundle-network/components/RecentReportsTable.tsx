import type { Report } from "../data/reports";

export function RecentReportsTable({ reports }: { reports: Report[] }) {
  return (
    <section
      className="reporting-table-panel"
      aria-labelledby="recent-reports-heading"
    >
      <div className="reporting-section-heading">
        <div>
          <p className="section-label">Recent reports</p>
          <h2 id="recent-reports-heading">Operational reporting queue</h2>
        </div>
        <span>{reports.length} matching reports</span>
      </div>
      <div className="reporting-table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Report</th>
              <th scope="col">Owner</th>
              <th scope="col">Region</th>
              <th scope="col">Status</th>
              <th scope="col">Updated</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>
                  <strong>{report.title}</strong>
                  <span>
                    {report.id} · {report.period}
                  </span>
                </td>
                <td>{report.owner}</td>
                <td>{report.region}</td>
                <td>
                  <span
                    className={`report-status ${report.status.toLowerCase().replace(" ", "-")}`}
                  >
                    {report.status}
                  </span>
                </td>
                <td>{report.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
