import type { LandingConfig } from "../types/landing";
import { HeroMedia } from "./HeroMedia";

type HeroSectionProps = {
  config: LandingConfig | null;
};

export function HeroSection({ config }: HeroSectionProps) {
  const hero = config?.hero;

  return (
    <section className="lcp-hero" id="overview" aria-busy={!hero}>
      <div className="lcp-hero-copy">
        {hero ? (
          <>
            <p className="lcp-kicker">{hero.eyebrow}</p>
            <h2>{hero.title}</h2>
            <p className="lcp-hero-description">{hero.description}</p>
            <div className="lcp-hero-actions">
              <a className="lcp-primary-action" href="#operations">Explore the platform</a>
              <a className="lcp-text-action" href="#operations">View operations overview <span aria-hidden="true">→</span></a>
            </div>
          </>
        ) : (
          <div className="lcp-copy-placeholder" aria-label="Loading landing content">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>
      <div className="lcp-hero-media-slot">
        {hero ? <HeroMedia alt={hero.imageAlt} imageUrl={hero.imageUrl} /> : null}
      </div>
    </section>
  );
}
