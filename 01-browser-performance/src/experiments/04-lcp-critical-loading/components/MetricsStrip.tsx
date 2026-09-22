const metrics = [
  ["96.4%", "on-time delivery"],
  ["28 min", "average exception response"],
  ["14 regions", "connected operating hubs"],
];

export function MetricsStrip() {
  return (
    <section className="lcp-metrics" aria-label="Platform metrics">
      {metrics.map(([value, label]) => (
        <div key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </section>
  );
}
