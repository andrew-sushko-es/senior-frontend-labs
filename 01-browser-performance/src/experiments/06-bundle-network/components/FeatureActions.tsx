export type ReportingTool = "export" | "preview" | "template" | "analytics";

export function FeatureActions({
  onOpen,
}: {
  onOpen: (tool: ReportingTool) => void;
}) {
  return (
    <section
      className="reporting-actions"
      aria-labelledby="reporting-actions-heading"
    >
      <div>
        <p className="section-label">Report tools</p>
        <h2 id="reporting-actions-heading">Prepare and share reporting</h2>
      </div>
      <div className="reporting-action-buttons">
        <button
          className="secondary-button"
          onClick={() => onOpen("export")}
          type="button"
        >
          Export report
        </button>
        <button
          className="secondary-button"
          onClick={() => onOpen("preview")}
          type="button"
        >
          Open document preview
        </button>
        <button
          className="secondary-button"
          onClick={() => onOpen("template")}
          type="button"
        >
          Edit report template
        </button>
        <button
          className="secondary-button"
          onClick={() => onOpen("analytics")}
          type="button"
        >
          Advanced analytics
        </button>
      </div>
    </section>
  );
}
