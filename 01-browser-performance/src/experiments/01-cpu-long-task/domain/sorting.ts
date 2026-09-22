import { resolveLookupLabel } from "./lookup";
import type { Company, LookupBundle, SearchCriteria } from "./types";

export function compareCompanies(
  left: Company,
  right: Company,
  sortBy: SearchCriteria["sortBy"],
  lookups: LookupBundle,
) {
  if (sortBy === "rating")
    return right.rating - left.rating || left.name.localeCompare(right.name);

  const leftValue =
    sortBy === "country"
      ? resolveLookupLabel(lookups.countries, left.countryId)
      : sortBy === "companyType"
        ? resolveLookupLabel(lookups.companyTypes, left.companyTypeId)
        : left.name;
  const rightValue =
    sortBy === "country"
      ? resolveLookupLabel(lookups.countries, right.countryId)
      : sortBy === "companyType"
        ? resolveLookupLabel(lookups.companyTypes, right.companyTypeId)
        : right.name;

  return (
    leftValue.localeCompare(rightValue, undefined, { sensitivity: "base" }) ||
    left.name.localeCompare(right.name)
  );
}

export function sortCompanies(
  companies: Company[],
  criteria: SearchCriteria,
  lookups: LookupBundle,
) {
  return [...companies].sort((left, right) =>
    compareCompanies(left, right, criteria.sortBy, lookups),
  );
}
