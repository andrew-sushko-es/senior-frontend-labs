import { resolveLookupLabel } from "./lookup";
import { normalizeSearchValue } from "./normalization";
import type { Company, LookupBundle, SearchCriteria } from "./types";

export function matchesCompanyFilters(
  company: Company,
  criteria: SearchCriteria,
  lookups: LookupBundle,
) {
  const searchableValues = [
    company.name,
    company.description,
    resolveLookupLabel(lookups.countries, company.countryId),
    resolveLookupLabel(lookups.cities, company.cityId),
    resolveLookupLabel(lookups.companyTypes, company.companyTypeId),
    resolveLookupLabel(lookups.employeeRanges, company.employeeRangeId),
    ...company.therapeuticAreaIds.map((id) =>
      resolveLookupLabel(lookups.therapeuticAreas, id),
    ),
    ...company.serviceIds.map((id) => resolveLookupLabel(lookups.services, id)),
    ...company.technologyIds.map((id) =>
      resolveLookupLabel(lookups.technologies, id),
    ),
  ];
  const normalizedSearch = normalizeSearchValue(criteria.searchText);
  const searchMatches =
    !normalizedSearch ||
    searchableValues.some((value) =>
      normalizeSearchValue(value).includes(normalizedSearch),
    );

  const selectedCountry = criteria.countryId
    ? normalizeSearchValue(
        resolveLookupLabel(lookups.countries, criteria.countryId),
      )
    : "";
  const countryMatches =
    !criteria.countryId ||
    normalizeSearchValue(
      resolveLookupLabel(lookups.countries, company.countryId),
    ) === selectedCountry;

  const selectedType = criteria.companyTypeId
    ? normalizeSearchValue(
        resolveLookupLabel(lookups.companyTypes, criteria.companyTypeId),
      )
    : "";
  const typeMatches =
    !criteria.companyTypeId ||
    normalizeSearchValue(
      resolveLookupLabel(lookups.companyTypes, company.companyTypeId),
    ) === selectedType;

  const selectedTherapeuticArea = criteria.therapeuticAreaId
    ? normalizeSearchValue(
        resolveLookupLabel(
          lookups.therapeuticAreas,
          criteria.therapeuticAreaId,
        ),
      )
    : "";
  const therapeuticAreaMatches =
    !criteria.therapeuticAreaId ||
    company.therapeuticAreaIds.some(
      (id) =>
        normalizeSearchValue(
          resolveLookupLabel(lookups.therapeuticAreas, id),
        ) === selectedTherapeuticArea,
    );

  return (
    searchMatches &&
    countryMatches &&
    typeMatches &&
    therapeuticAreaMatches &&
    (!criteria.activeOnly || company.active)
  );
}

export function filterCompanies(
  companies: Company[],
  criteria: SearchCriteria,
  lookups: LookupBundle,
) {
  return companies.filter((company) =>
    matchesCompanyFilters(company, criteria, lookups),
  );
}
