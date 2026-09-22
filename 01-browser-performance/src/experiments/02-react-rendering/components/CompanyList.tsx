import { useMarketplace } from "../context/useMarketplace";
import { filterCompanies } from "../domain/filtering";
import { CompanyCard } from "./CompanyCard";

export function CompanyList() {
  const {
    companies,
    search,
    filters,
    toggleWatchlist,
    toggleCompare,
    setSelectedCompanyId,
  } = useMarketplace();
  const visibleCompanies = filterCompanies(companies, search, filters);

  return (
    <section
      className="marketplace-results"
      aria-labelledby="marketplace-results-heading"
    >
      <div className="marketplace-results-heading">
        <div>
          <p className="section-label">Marketplace results</p>
          <h2 id="marketplace-results-heading">
            Companies <span>{visibleCompanies.length} visible</span>
          </h2>
        </div>
      </div>
      <div className="marketplace-company-grid">
        {visibleCompanies.map((company) => {
          const displayMeta = {
            location: `${company.city}, ${company.country}`,
            verified: company.verified,
            areas: company.therapeuticAreas.slice(0, 2),
          };

          return (
            <CompanyCard
              company={company}
              displayMeta={displayMeta}
              key={company.id}
              onCompare={() => toggleCompare(company.id)}
              onSelect={() => setSelectedCompanyId(company.id)}
              onWatchlist={() => toggleWatchlist(company.id)}
            />
          );
        })}
      </div>
    </section>
  );
}
