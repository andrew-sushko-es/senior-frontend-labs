import type { LandingConfig } from "../types/landing";

const landingConfigUrl = "/experiments/04-lcp-critical-loading/landing-config.json";

export async function loadLandingConfig(signal: AbortSignal) {
  const response = await fetch(landingConfigUrl, { signal });
  if (!response.ok) {
    throw new Error("Landing configuration could not be loaded.");
  }

  return (await response.json()) as LandingConfig;
}
