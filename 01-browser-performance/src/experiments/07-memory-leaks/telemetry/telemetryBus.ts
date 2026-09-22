import type { TelemetrySample } from "../data/generateTelemetry";

type TelemetryHandler = (sample: TelemetrySample) => void;

const subscribers = new Map<string, Set<TelemetryHandler>>();
let feedTimer: ReturnType<typeof setInterval> | null = null;
let sequence = 0;

function createLiveSample(
  vehicleId: string,
  currentSequence: number,
): TelemetrySample {
  const vehicleOffset = vehicleId.charCodeAt(vehicleId.length - 1) % 8;
  const phase = currentSequence / 4 + vehicleOffset;

  return {
    timestamp: Date.UTC(2026, 8, 22, 8, 0, 0) + currentSequence * 500,
    speed: Math.round((48 + Math.sin(phase) * 12) * 10) / 10,
    latitude:
      Math.round((52.219 + Math.sin(phase / 7) * 0.03) * 1_000_000) / 1_000_000,
    longitude:
      Math.round((21.012 + Math.cos(phase / 6) * 0.04) * 1_000_000) / 1_000_000,
    engineTemp: Math.round((84 + Math.cos(phase / 3) * 4) * 10) / 10,
    fuelLevel: Math.round((68 - (currentSequence % 90) / 10) * 10) / 10,
    status: currentSequence % 11 === 0 ? "Traffic adjusted" : "On schedule",
  };
}

function publishTelemetry() {
  sequence += 1;

  subscribers.forEach((handlers, vehicleId) => {
    const sample = createLiveSample(vehicleId, sequence);
    handlers.forEach((handler) => handler(sample));
  });
}

export const telemetryBus = {
  subscribe(vehicleId: string, handler: TelemetryHandler) {
    const vehicleSubscribers =
      subscribers.get(vehicleId) ?? new Set<TelemetryHandler>();
    vehicleSubscribers.add(handler);
    subscribers.set(vehicleId, vehicleSubscribers);
  },

  startLiveFeed() {
    if (feedTimer !== null) {
      return;
    }

    feedTimer = setInterval(publishTelemetry, 500);
  },

  stopLiveFeed() {
    if (feedTimer !== null) {
      clearInterval(feedTimer);
      feedTimer = null;
    }
  },
};
