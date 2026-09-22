import { useEffect, useState } from "react";
import {
  loadDashboardNotice,
  type DashboardNotice,
} from "./api/loadDashboardNotice";
import { useObservedCls } from "./performance/useObservedCls";

const activityCards = [
  ["11", "work orders need attention"],
  ["4", "handoffs due this afternoon"],
  ["92%", "on-time completion this week"],
];

const recentItems = [
  ["East campus", "Access review assigned", "09:12"],
  ["North line", "Supplier confirmation received", "08:47"],
  ["Central depot", "Route plan updated", "08:18"],
];

export function CumulativeLayoutShiftExperiment() {
  const [notice, setNotice] = useState<DashboardNotice | null>(null);
  const observedCls = useObservedCls();

  useEffect(() => {
    const controller = new AbortController();

    loadDashboardNotice(controller.signal)
      .then(setNotice)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="cls-experiment">
      <section className="reproduction-panel cls-reproduction-panel" aria-labelledby="cls-tools-heading">
        <p className="section-label" id="cls-tools-heading">Suggested tools</p>
        <ul>
          <li>Performance</li>
          <li>Rendering → Layout Shift Regions</li>
          <li>Lighthouse</li>
        </ul>
        <ol>
          <li>Enable Disable cache.</li>
          <li>Use Fast 3G or an equivalent profile.</li>
          <li>Start recording and reload the page.</li>
          <li>Wait until the page stabilizes, then stop recording.</li>
          <li>Inspect the Layout Shift events.</li>
        </ol>
      </section>

      <article className="cls-dashboard" aria-label="Operations dashboard">
        <nav className="cls-dashboard-nav" aria-label="Operations navigation">
          <a className="cls-brand" href="#dashboard-overview">
            <span aria-hidden="true">F</span>
            Fleetline
          </a>
          <div className="cls-nav-links">
            <a href="#dashboard-overview">Overview</a>
            <a href="#activity">Activity</a>
            <a href="#recent-items">Work queue</a>
          </div>
          <p className="cls-user">Avery Chen <span>Operations lead</span></p>
        </nav>

        <div className="cls-dashboard-content">
          {notice ? (
            <aside className={`cls-notice cls-notice-${notice.type}`} aria-live="polite">
              <strong>Operations update</strong>
              <span>{notice.message}</span>
            </aside>
          ) : null}

          <section className="cls-preview-section" aria-labelledby="operations-preview-heading">
            <div className="cls-section-heading">
              <div>
                <p className="cls-kicker">Live view</p>
                <h3 id="operations-preview-heading">Today&apos;s operating picture</h3>
              </div>
              <p>Last refreshed 2 min ago</p>
            </div>
            <img
              alt="Operations dashboard with delivery and facility status"
              className="cls-dashboard-preview"
              src="/experiments/05-cls/operations-preview.jpg"
            />
          </section>

          <section className="cls-overview" id="dashboard-overview">
            <p className="cls-kicker">Monday, 08:30 UTC</p>
            <h2>Keep every active operation one step ahead.</h2>
            <p>
              Start with the locations where a timely decision keeps the rest
              of the day on track.
            </p>
          </section>

          <section className="cls-activity-grid" id="activity" aria-label="Activity summary">
            {activityCards.map(([value, label]) => (
              <div key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </section>

          <section className="cls-recent-items" id="recent-items" aria-labelledby="recent-items-heading">
            <div className="cls-section-heading">
              <div>
                <p className="cls-kicker">Recent items</p>
                <h3 id="recent-items-heading">Work moving through the network</h3>
              </div>
              <a href="#recent-items">View queue</a>
            </div>
            <ul>
              {recentItems.map(([location, description, time]) => (
                <li key={location}>
                  <span className="cls-item-marker" aria-hidden="true" />
                  <div>
                    <strong>{location}</strong>
                    <span>{description}</span>
                  </div>
                  <time>{time}</time>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>

      <output className="cls-diagnostics" aria-live="polite">
        Observed CLS: {observedCls.toFixed(2)}
      </output>
    </div>
  );
}
