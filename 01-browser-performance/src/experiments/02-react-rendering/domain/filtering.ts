import type { Company, MarketplaceFilters } from "./company";

function normalize(value: string) {
  return value.trim().toLocaleLowerCase();
}

export function filterCompanies(
  companies: Company[],
  search: string,
  filters: MarketplaceFilters,
) {
  const normalizedSearch = normalize(search);
  return companies.filter((company) => {
    const searchableText = [
      company.name,
      company.description,
      company.country,
      company.city,
      company.companyType,
      ...company.therapeuticAreas,
      ...company.services,
    ]
      .join(" ")
      .toLocaleLowerCase();

    return (
      (!normalizedSearch || searchableText.includes(normalizedSearch)) &&
      (!filters.country || company.country === filters.country) &&
      (!filters.companyType || company.companyType === filters.companyType) &&
      (!filters.verifiedOnly || company.verified)
    );
  });
}
