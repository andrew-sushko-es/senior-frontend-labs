const navigationItems = ["Platform", "Solutions", "Customers", "Resources"];

export function LandingNav() {
  return (
    <nav className="lcp-landing-nav" aria-label="Product navigation">
      <a className="lcp-brand" href="#overview">
        <span aria-hidden="true" className="lcp-brand-mark">N</span>
        Northstar Ops
      </a>
      <div className="lcp-nav-links">
        {navigationItems.map((item) => (
          <a href="#overview" key={item}>{item}</a>
        ))}
      </div>
      <a className="lcp-nav-action" href="#overview">Request access</a>
    </nav>
  );
}
