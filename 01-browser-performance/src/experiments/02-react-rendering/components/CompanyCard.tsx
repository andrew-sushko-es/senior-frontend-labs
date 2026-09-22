import { useMarketplace } from "../context/useMarketplace";
import type { Company } from "../domain/company";
import { CompanyStats } from "./CompanyStats";

type CompanyCardProps = {
  company: Company;
  displayMeta: { location: string; verified: boolean; areas: string[] };
  onWatchlist: () => void;
  onCompare: () => void;
  onSelect: () => void;
};

export function CompanyCard({
  company,
  displayMeta,
  onWatchlist,
  onCompare,
  onSelect,
}: CompanyCardProps) {
  const { compactMode, watchlist, compareSelection, selectedCompanyId } =
    useMarketplace();
  const isWatchlisted = watchlist.has(company.id);
  const isCompared = compareSelection.includes(company.id);
  const isSelected = selectedCompanyId === company.id;

  return (
    <article
      className={`marketplace-company-card${compactMode ? " is-compact" : ""}${isSelected ? " is-selected" : ""}`}
    >
      <div className="marketplace-company-heading">
        <div>
          <div className="marketplace-company-title">
            <h3>{company.name}</h3>
            {displayMeta.verified && (
              <span className="verified-badge">Verified</span>
            )}
          </div>
          <p>{company.companyType}</p>
        </div>
        <strong className="rating">★ {company.rating.toFixed(1)}</strong>
      </div>
      <p className="marketplace-description">{company.description}</p>
      <dl className="marketplace-company-details">
        <div>
          <dt>Location</dt>
          <dd>{displayMeta.location}</dd>
        </div>
        <div>
          <dt>Team</dt>
          <dd>{company.employeeRange}</dd>
        </div>
        <div>
          <dt>Focus</dt>
          <dd>{displayMeta.areas.join(", ")}</dd>
        </div>
      </dl>
      <CompanyStats company={company} />
      <div className="marketplace-card-actions">
        <button onClick={onWatchlist} type="button">
          {isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
        </button>
        <label>
          <input checked={isCompared} onChange={onCompare} type="checkbox" />
          Compare
        </label>
        <button className="text-button" onClick={onSelect} type="button">
          {isSelected ? "Selected" : "View details"}
        </button>
      </div>
    </article>
  );
}
