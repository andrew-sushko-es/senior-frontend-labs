import { useEffect, useRef } from "react";
import type { MapMarker } from "../data/generateTelemetry";
import { registerWorkspaceLayer } from "../workspace/overlayRegistry";

type WorkspaceOverlayProps = {
  markers: MapMarker[];
  vehicleName: string;
};

export function WorkspaceOverlay({
  markers,
  vehicleName,
}: WorkspaceOverlayProps) {
  const mapLayerRef = useRef<HTMLDivElement>(null);
  const calloutLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapLayerRef.current) {
      registerWorkspaceLayer(mapLayerRef.current);
    }
    if (calloutLayerRef.current) {
      registerWorkspaceLayer(calloutLayerRef.current);
    }
  }, []);

  return (
    <section className="workspace-map" aria-label={`${vehicleName} route map`}>
      <div className="workspace-map-grid" ref={mapLayerRef}>
        <span className="workspace-map-route" aria-hidden="true" />
        {markers.slice(0, 18).map((marker, index) => (
          <span
            aria-label={`${marker.kind}: ${marker.label}`}
            className={`workspace-map-marker marker-${marker.kind.toLowerCase()}`}
            key={marker.id}
            role="img"
            style={{
              left: `${12 + ((index * 31) % 76)}%`,
              top: `${16 + ((index * 17) % 64)}%`,
            }}
          />
        ))}
      </div>
      <div className="workspace-map-callout" ref={calloutLayerRef}>
        <span>Route progress</span>
        <strong>72% complete</strong>
        <small>{markers.length} route references available</small>
      </div>
    </section>
  );
}
