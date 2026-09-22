import type { Vehicle } from "../data/generateVehicles";

type FleetOverviewProps = {
  onOpenWorkspace: (vehicle: Vehicle) => void;
  vehicles: Vehicle[];
};

export function FleetOverview({
  onOpenWorkspace,
  vehicles,
}: FleetOverviewProps) {
  return (
    <section
      className="fleet-overview"
      aria-labelledby="fleet-overview-heading"
    >
      <header className="fleet-overview-heading">
        <div>
          <p className="fleet-kicker">Operations control</p>
          <h2 id="fleet-overview-heading">Fleet overview</h2>
          <p>
            Review active routes and open a vehicle workspace for live context.
          </p>
        </div>
        <span className="fleet-live-indicator">Live operations</span>
      </header>
      <div className="fleet-vehicle-list">
        {vehicles.map((vehicle) => (
          <article className="fleet-vehicle-row" key={vehicle.id}>
            <div className="fleet-vehicle-identity">
              <span className="fleet-vehicle-icon" aria-hidden="true">
                ▰
              </span>
              <div>
                <h3>{vehicle.name}</h3>
                <p>
                  {vehicle.id} · {vehicle.driver}
                </p>
              </div>
            </div>
            <p className="fleet-route">{vehicle.route}</p>
            <span
              className={`fleet-status ${vehicle.status.toLowerCase().replaceAll(" ", "-")}`}
            >
              {vehicle.status}
            </span>
            <p className="fleet-updated">Updated {vehicle.lastUpdated}</p>
            <button
              className="secondary-button"
              onClick={() => onOpenWorkspace(vehicle)}
              type="button"
            >
              Open workspace
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
