import { useEffect, useRef, useState } from "react";
import { FleetOverview } from "./components/FleetOverview";
import { VehicleWorkspace } from "./components/VehicleWorkspace";
import { vehicles, type Vehicle } from "./data/generateVehicles";
import { telemetryBus } from "./telemetry/telemetryBus";

type OpenWorkspace = {
  vehicle: Vehicle;
  workspaceId: number;
};

export function MemoryLeaksExperiment() {
  const [openWorkspace, setOpenWorkspace] = useState<OpenWorkspace | null>(
    null,
  );
  const nextWorkspaceId = useRef(1);

  useEffect(() => {
    telemetryBus.startLiveFeed();

    return () => {
      telemetryBus.stopLiveFeed();
    };
  }, []);

  const openVehicleWorkspace = (vehicle: Vehicle) => {
    setOpenWorkspace({ vehicle, workspaceId: nextWorkspaceId.current });
    nextWorkspaceId.current += 1;
  };

  const resetExperiment = () => {
    setOpenWorkspace(null);
  };

  return (
    <div className="experiment-layout memory-leaks-experiment">
      <section
        className="reproduction-panel"
        aria-labelledby="memory-tools-heading"
      >
        <div className="memory-instructions-heading">
          <div>
            <p className="section-label" id="memory-tools-heading">
              Suggested tools
            </p>
            <ul>
              <li>Memory → Heap Snapshot</li>
              <li>Allocation instrumentation</li>
              <li>Performance Monitor</li>
            </ul>
          </div>
          <button
            className="secondary-button"
            onClick={resetExperiment}
            type="button"
          >
            Reset experiment
          </button>
        </div>
        <ol>
          <li>Take a baseline snapshot.</li>
          <li>
            Open a vehicle workspace and keep it open for about 5 seconds.
          </li>
          <li>Review an alert, then close the workspace.</li>
          <li>Repeat the open and close flow 10 times.</li>
          <li>Force garbage collection and take another snapshot.</li>
          <li>Repeat the cycles and compare the retained objects.</li>
        </ol>
      </section>

      {openWorkspace ? (
        <VehicleWorkspace
          key={openWorkspace.workspaceId}
          onClose={() => setOpenWorkspace(null)}
          vehicle={openWorkspace.vehicle}
          workspaceId={openWorkspace.workspaceId}
        />
      ) : (
        <FleetOverview
          onOpenWorkspace={openVehicleWorkspace}
          vehicles={vehicles}
        />
      )}
    </div>
  );
}
