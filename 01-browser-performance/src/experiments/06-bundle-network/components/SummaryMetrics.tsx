export function SummaryMetrics() {
  return (
    <section className="reporting-summary" aria-label="Operations summary">
      <article>
        <span>Reports on track</span>
        <strong>42</strong>
        <small>6 updated today</small>
      </article>
      <article>
        <span>Open exceptions</span>
        <strong>18</strong>
        <small>Down 12% from last week</small>
      </article>
      <article>
        <span>On-time completion</span>
        <strong>95.6%</strong>
        <small>Across active regions</small>
      </article>
      <article>
        <span>Scheduled deliveries</span>
        <strong>124</strong>
        <small>Next 7 days</small>
      </article>
    </section>
  );
}
