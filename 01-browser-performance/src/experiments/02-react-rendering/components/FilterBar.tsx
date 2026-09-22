import { marketplaceOptions } from "../data/generateCompanies";
import { useMarketplace } from "../context/useMarketplace";

export function FilterBar() {
  const { filters, setFilters } = useMarketplace();

  return (
    <div className="marketplace-filters" aria-label="Company filters">
      <label>
        Country
        <select
          onChange={(event) =>
            setFilters({ ...filters, country: event.target.value })
          }
          value={filters.country}
        >
          <option value="">All countries</option>
          {marketplaceOptions.countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </label>
      <label>
        Company type
        <select
          onChange={(event) =>
            setFilters({ ...filters, companyType: event.target.value })
          }
          value={filters.companyType}
        >
          <option value="">All company types</option>
          {marketplaceOptions.companyTypes.map((companyType) => (
            <option key={companyType} value={companyType}>
              {companyType}
            </option>
          ))}
        </select>
      </label>
      <label className="marketplace-toggle">
        <input
          checked={filters.verifiedOnly}
          onChange={(event) =>
            setFilters({ ...filters, verifiedOnly: event.target.checked })
          }
          type="checkbox"
        />
        Verified companies
      </label>
    </div>
  );
}
