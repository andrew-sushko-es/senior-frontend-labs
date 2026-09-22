import { useEffect, useMemo, useState } from "react";
import {
  createWorkspaceSnapshot,
  type TelemetrySample,
} from "../data/generateTelemetry";
import type { Vehicle } from "../data/generateVehicles";
import { telemetryBus } from "../telemetry/telemetryBus";
import { WorkspaceOverlay } from "./WorkspaceOverlay";

type VehicleWorkspaceProps = {
  onClose: () => void;
  vehicle: Vehicle;
  workspaceId: number;
};

function formatTime(timestamp: number) {
  return new Date(timestamp).toISOString().slice(11, 16);
}

function formatLocation(sample: TelemetrySample) {
  return `${sample.latitude.toFixed(4)}, ${sample.longitude.toFixed(4)}`;
}

export function VehicleWorkspace({
  onClose,
  vehicle,
  workspaceId,
}: VehicleWorkspaceProps) {
  const workspace = useMemo(
    () => createWorkspaceSnapshot(vehicle, workspaceId),
    [vehicle, workspaceId],
  );
  const [latestTelemetry, setLatestTelemetry] = useState(
    workspace.latestTelemetry,
  );
  const [reviewedAlert, setReviewedAlert] = useState<string | null>(null);

  useEffect(() => {
    telemetryBus.subscribe(vehicle.id, (sample) => {
      workspace.latestTelemetry = sample;
      setLatestTelemetry(sample);
    });
  }, [vehicle.id, workspace]);

  const displayedTelemetry = latestTelemetry ?? workspace.telemetry.at(-1);
  const visibleActivities = workspace.activities.slice(0, 6);
  const visibleAlerts = workspace.alerts.slice(0, 3);

  return (
    <article
      className="vehicle-workspace"
      data-workspace-instance={workspaceId}
      aria-labelledby="vehicle-workspace-heading"
    >
      <header className="vehicle-workspace-header">
        <div>
          <p className="fleet-kicker">Vehicle detail</p>
          <h2 id="vehicle-workspace-heading">{vehicle.name}</h2>
          <p>
            {vehicle.id} · {vehicle.driver} · {vehicle.route}
          </p>
        </div>
        <div className="vehicle-workspace-actions">
          <span
            className={`fleet-status ${vehicle.status.toLowerCase().replaceAll(" ", "-")}`}
          >
            {vehicle.status}
          </span>
          <button className="secondary-button" onClick={onClose} type="button">
            Close workspace
          </button>
        </div>
      </header>

      <section className="workspace-summary" aria-label="Current telemetry">
        <article>
          <span>Speed</span>
          <strong>{displayedTelemetry?.speed.toFixed(1)} km/h</strong>
          <small>{displayedTelemetry?.status}</small>
        </article>
        <article>
          <span>Engine</span>
          <strong>{displayedTelemetry?.engineTemp.toFixed(1)}°C</strong>
          <small>Within operating range</small>
        </article>
        <article>
          <span>Fuel level</span>
          <strong>{displayedTelemetry?.fuelLevel.toFixed(1)}%</strong>
          <small>Next review at 55%</small>
        </article>
        <article>
          <span>Last position</span>
          <strong>
            {displayedTelemetry ? formatLocation(displayedTelemetry) : "—"}
          </strong>
          <small>
            {displayedTelemetry
              ? `${formatTime(displayedTelemetry.timestamp)} UTC`
              : "Awaiting feed"}
          </small>
        </article>
      </section>

      <div className="vehicle-workspace-grid">
        <div className="workspace-primary-column">
          <WorkspaceOverlay
            markers={workspace.markers}
            vehicleName={vehicle.name}
          />
          <section
            className="workspace-panel"
            aria-labelledby="activity-heading"
          >
            <div className="workspace-panel-heading">
              <div>
                <p className="fleet-kicker">Recent activity</p>
                <h3 id="activity-heading">Operational timeline</h3>
              </div>
              <span>Last 12 hours</span>
            </div>
            <ol className="workspace-activity-list">
              {visibleActivities.map((activity) => (
                <li key={activity.id}>
                  <time>{formatTime(activity.timestamp)}</time>
                  <div>
                    <strong>{activity.message}</strong>
                    <span>
                      {activity.category} · {activity.operator}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="workspace-side-column">
          <section className="workspace-panel" aria-labelledby="alerts-heading">
            <div className="workspace-panel-heading">
              <div>
                <p className="fleet-kicker">Attention queue</p>
                <h3 id="alerts-heading">Alerts</h3>
              </div>
              <span>{workspace.alerts.length} recorded</span>
            </div>
            <ul className="workspace-alert-list">
              {visibleAlerts.map((alert) => (
                <li key={alert.id}>
                  <span
                    className={`workspace-alert-severity ${alert.severity.toLowerCase()}`}
                  >
                    {alert.severity}
                  </span>
                  <div>
                    <strong>{alert.title}</strong>
                    <p>{alert.detail}</p>
                    <button
                      className="workspace-text-button"
                      onClick={() => setReviewedAlert(alert.id)}
                      type="button"
                    >
                      {reviewedAlert === alert.id ? "Reviewed" : "Review alert"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section
            className="workspace-panel workspace-notes"
            aria-labelledby="notes-heading"
          >
            <div className="workspace-panel-heading">
              <div>
                <p className="fleet-kicker">Shift handoff</p>
                <h3 id="notes-heading">Notes</h3>
              </div>
            </div>
            {workspace.notes.slice(0, 3).map((note) => (
              <article key={note.id}>
                <p>{note.text}</p>
                <span>
                  {note.author} · {formatTime(note.createdAt)} UTC
                </span>
              </article>
            ))}
          </section>
        </aside>
      </div>
    </article>
  );
}
