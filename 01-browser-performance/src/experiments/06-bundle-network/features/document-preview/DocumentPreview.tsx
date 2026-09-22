import {
  Document,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { Report } from "../../data/reports";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    color: "#173956",
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 36,
  },
  eyebrow: {
    color: "#3973a5",
    fontSize: 8,
    marginBottom: 7,
    textTransform: "uppercase",
  },
  title: { fontSize: 22, fontFamily: "Helvetica-Bold", marginBottom: 10 },
  copy: { color: "#526678", lineHeight: 1.5, marginBottom: 20 },
  row: {
    borderBottomColor: "#d8e0e8",
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingVertical: 8,
  },
  report: { width: "48%" },
  owner: { width: "21%" },
  status: { width: "18%" },
  incidents: { textAlign: "right", width: "13%" },
  label: { color: "#6a7c8b", fontSize: 8, fontFamily: "Helvetica-Bold" },
});

function OperationsDocument({ reports }: { reports: Report[] }) {
  return (
    <Document title="Operations report summary">
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>Operations Reporting Console</Text>
        <Text style={styles.title}>Weekly operations summary</Text>
        <Text style={styles.copy}>
          A concise view of the latest report activity and exceptions across the
          current operating regions.
        </Text>
        <View style={styles.row}>
          <Text style={[styles.report, styles.label]}>REPORT</Text>
          <Text style={[styles.owner, styles.label]}>OWNER</Text>
          <Text style={[styles.status, styles.label]}>STATUS</Text>
          <Text style={[styles.incidents, styles.label]}>OPEN</Text>
        </View>
        {reports.slice(0, 12).map((report) => (
          <View key={report.id} style={styles.row}>
            <Text style={styles.report}>{report.title}</Text>
            <Text style={styles.owner}>{report.owner}</Text>
            <Text style={styles.status}>{report.status}</Text>
            <Text style={styles.incidents}>{report.incidents}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}

export function DocumentPreview({
  reports,
  onClose,
}: {
  reports: Report[];
  onClose: () => void;
}) {
  return (
    <section
      className="reporting-tool-panel reporting-document-panel"
      aria-labelledby="preview-heading"
    >
      <div className="reporting-tool-heading">
        <div>
          <p className="section-label">Document preview</p>
          <h2 id="preview-heading">Weekly operations summary</h2>
        </div>
        <button
          className="icon-button"
          onClick={onClose}
          type="button"
          aria-label="Close document preview"
        >
          ×
        </button>
      </div>
      <PDFViewer className="reporting-pdf-viewer">
        <OperationsDocument reports={reports} />
      </PDFViewer>
    </section>
  );
}
