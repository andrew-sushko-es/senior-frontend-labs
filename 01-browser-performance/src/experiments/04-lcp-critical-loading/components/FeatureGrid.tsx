const features = [
  ["Network visibility", "See activity across transport, facilities, and fulfillment in a single operating view."],
  ["Exception response", "Prioritize the changes that need a decision and keep the right teams aligned."],
  ["Operational planning", "Turn current signals into practical forecasts for the next shift, day, and week."],
];

export function FeatureGrid() {
  return (
    <section className="lcp-features" id="operations" aria-labelledby="lcp-features-heading">
      <div className="lcp-features-heading">
        <p className="lcp-kicker">A shared operating picture</p>
        <h2 id="lcp-features-heading">Built for teams running complex operations.</h2>
      </div>
      <div className="lcp-feature-grid">
        {features.map(([title, description], index) => (
          <article className="lcp-feature-card" key={title}>
            <span className="lcp-feature-number">0{index + 1}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
