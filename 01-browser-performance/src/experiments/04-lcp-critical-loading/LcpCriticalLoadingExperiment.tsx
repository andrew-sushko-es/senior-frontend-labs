import { useEffect, useState } from "react";
import { loadLandingConfig } from "./api/loadLandingConfig";
import { FeatureGrid } from "./components/FeatureGrid";
import { HeroSection } from "./components/HeroSection";
import { LandingNav } from "./components/LandingNav";
import { MetricsStrip } from "./components/MetricsStrip";
import type { LandingConfig } from "./types/landing";

export function LcpCriticalLoadingExperiment() {
  const [config, setConfig] = useState<LandingConfig | null>(null);
  const [hasConfigError, setHasConfigError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    loadLandingConfig(controller.signal)
      .then((landingConfig) => setConfig(landingConfig))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setHasConfigError(true);
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="lcp-critical-loading-experiment">
      <section className="reproduction-panel lcp-reproduction-panel" aria-labelledby="lcp-tools-heading">
        <p className="section-label" id="lcp-tools-heading">Suggested tools</p>
        <ul>
          <li>Network</li>
          <li>Performance</li>
          <li>Lighthouse</li>
        </ul>
        <ol>
          <li>Enable Disable cache.</li>
          <li>Apply Fast 3G or the documented custom profile.</li>
          <li>Reload the page.</li>
          <li>Identify the LCP element.</li>
          <li>Inspect when its resource request starts.</li>
          <li>Inspect the request chain before it.</li>
        </ol>
      </section>

      <div className="lcp-product-page">
        <LandingNav />
        <HeroSection config={config} />
        {hasConfigError ? (
          <p className="lcp-load-error" role="alert">The landing page configuration could not be loaded. Reload and try again.</p>
        ) : null}
        <MetricsStrip />
        <FeatureGrid />
      </div>
    </div>
  );
}
