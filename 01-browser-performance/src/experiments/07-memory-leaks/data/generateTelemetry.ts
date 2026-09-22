import type { Vehicle } from "./generateVehicles";

export type TelemetrySample = {
  timestamp: number;
  speed: number;
  latitude: number;
  longitude: number;
  engineTemp: number;
  fuelLevel: number;
  status: string;
};

export type ActivityRecord = {
  id: string;
  timestamp: number;
  category: "Route" | "Safety" | "Service" | "Dispatch";
  message: string;
  operator: string;
};

export type FleetAlert = {
  id: string;
  severity: "Info" | "Review" | "Action";
  raisedAt: number;
  title: string;
  detail: string;
};

export type MapMarker = {
  id: string;
  latitude: number;
  longitude: number;
  label: string;
  kind: "Stop" | "Checkpoint" | "Service";
};

export type WorkspaceNote = {
  id: string;
  author: string;
  createdAt: number;
  text: string;
  pinned: boolean;
};

export type ChartPoint = {
  minute: number;
  speed: number;
  engineTemp: number;
  fuelLevel: number;
};

export type WorkspaceSnapshot = {
  workspaceId: number;
  vehicle: Vehicle;
  telemetry: TelemetrySample[];
  activities: ActivityRecord[];
  alerts: FleetAlert[];
  markers: MapMarker[];
  notes: WorkspaceNote[];
  chartPoints: ChartPoint[];
  latestTelemetry: TelemetrySample | null;
};

const baseTimestamp = Date.UTC(2026, 8, 22, 8, 0, 0);
const operators = [
  "Dispatch desk",
  "Route control",
  "Service desk",
  "Safety desk",
];
const activityMessages = [
  "Route checkpoint confirmed",
  "Driver availability updated",
  "Estimated arrival recalculated",
  "Fuel stop recommendation reviewed",
  "Delivery window acknowledged",
  "Traffic advisory applied",
];

function seedFrom(value: string) {
  let seed = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    seed ^= value.charCodeAt(index);
    seed = Math.imul(seed, 16777619);
  }

  return seed >>> 0;
}

function randomFor(seed: number) {
  let state = seed;

  return () => {
    state += 0x6d2b79f5;
    let result = state;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function round(value: number, precision = 2) {
  const multiplier = 10 ** precision;
  return Math.round(value * multiplier) / multiplier;
}

export function createWorkspaceSnapshot(
  vehicle: Vehicle,
  workspaceId: number,
): WorkspaceSnapshot {
  const random = randomFor(seedFrom(`${vehicle.id}:${workspaceId}`));
  const telemetry = Array.from({ length: 3_600 }, (_, index) => {
    const phase = index / 48;

    return {
      timestamp: baseTimestamp - (3_600 - index) * 1_000,
      speed: round(46 + Math.sin(phase) * 13 + random() * 5),
      latitude: round(
        52.219 + Math.sin(phase / 8) * 0.035 + random() * 0.002,
        6,
      ),
      longitude: round(
        21.012 + Math.cos(phase / 7) * 0.042 + random() * 0.002,
        6,
      ),
      engineTemp: round(83 + Math.sin(phase / 3) * 5 + random() * 2),
      fuelLevel: round(71 - index / 105 + random() * 1.5),
      status: index % 19 === 0 ? "Cruising" : "On schedule",
    };
  });

  const activities = Array.from({ length: 820 }, (_, index) => ({
    id: `${vehicle.id}-activity-${workspaceId}-${index}`,
    timestamp: baseTimestamp - index * 73_000,
    category: ["Route", "Safety", "Service", "Dispatch"][
      index % 4
    ] as ActivityRecord["category"],
    message: activityMessages[index % activityMessages.length],
    operator: operators[index % operators.length],
  }));

  const alerts = Array.from({ length: 120 }, (_, index) => ({
    id: `${vehicle.id}-alert-${workspaceId}-${index}`,
    severity: ["Info", "Review", "Action"][index % 3] as FleetAlert["severity"],
    raisedAt: baseTimestamp - index * 193_000,
    title: ["Route variance", "Service window", "Driver check-in"][index % 3],
    detail: `Review ${vehicle.route.toLowerCase()} operating condition ${index + 1}.`,
  }));

  const markers = Array.from({ length: 180 }, (_, index) => ({
    id: `${vehicle.id}-marker-${workspaceId}-${index}`,
    latitude: round(52.21 + random() * 0.08, 6),
    longitude: round(20.96 + random() * 0.1, 6),
    label: `Route point ${index + 1}`,
    kind: ["Stop", "Checkpoint", "Service"][index % 3] as MapMarker["kind"],
  }));

  const notes = Array.from({ length: 64 }, (_, index) => ({
    id: `${vehicle.id}-note-${workspaceId}-${index}`,
    author: ["Maya", "Theo", "Nina", "Elliot"][index % 4],
    createdAt: baseTimestamp - index * 521_000,
    text: `Coordinate ${vehicle.route.toLowerCase()} handoff before checkpoint ${(index % 12) + 1}.`,
    pinned: index % 11 === 0,
  }));

  const chartPoints = Array.from({ length: 360 }, (_, index) => {
    const source = telemetry[index * 10];

    return {
      minute: index,
      speed: source.speed,
      engineTemp: source.engineTemp,
      fuelLevel: source.fuelLevel,
    };
  });

  return {
    workspaceId,
    vehicle,
    telemetry,
    activities,
    alerts,
    markers,
    notes,
    chartPoints,
    latestTelemetry: telemetry.at(-1) ?? null,
  };
}
