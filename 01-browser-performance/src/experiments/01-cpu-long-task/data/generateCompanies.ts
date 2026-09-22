import type { Company } from "../domain/types";
import type { LookupFixture } from "./generateLookups";

const companyPrefixes = [
  "Aster",
  "Cedar",
  "Helix",
  "Nexa",
  "Orion",
  "Pioneer",
  "Solace",
  "Veridian",
  "Cobalt",
  "Lumen",
];
const companySuffixes = [
  "BioSystems",
  "Therapeutics",
  "Life Sciences",
  "Clinical Partners",
  "BioWorks",
  "Research Group",
  "Pharma Solutions",
];

function selectFrom<T>(items: T[], index: number) {
  return items[((index % items.length) + items.length) % items.length];
}

function selectedTaxonomyIds(
  ids: string[],
  companyIndex: number,
  count: number,
) {
  const start = Math.floor(ids.length * 0.68) + companyIndex * 37;
  return Array.from({ length: count }, (_, offset) =>
    selectFrom(ids, start + offset * 97),
  );
}

export function generateCompanies(
  count: number,
  fixture: LookupFixture,
): Company[] {
  const cityIds = fixture.countryChoices.flatMap((_, countryIndex) =>
    Array.from(
      { length: 8 },
      (_, cityIndex) => `city-${countryIndex + 1}-${cityIndex + 1}`,
    ),
  );
  const employeeRangeIds = [
    "employees-1-10",
    "employees-11-50",
    "employees-51-200",
    "employees-201-500",
    "employees-501-plus",
  ];
  const therapyIds = fixture.therapeuticAreaChoices.map((choice) => choice.id);

  return Array.from({ length: count }, (_, index) => {
    const therapeuticAreaIds = selectedTaxonomyIds(therapyIds, index, 10);
    if (index % 3 === 0)
      therapeuticAreaIds[0] = fixture.fixtureTherapeuticAreaId;
    return {
      id: `company-${index + 1}`,
      name: `${selectFrom(companyPrefixes, index)} ${selectFrom(companySuffixes, index * 3)}`,
      description: `${index % 2 === 0 ? "Biopharma" : "Life science"} organization supporting translational research, development, and regulated delivery programs.`,
      countryId: selectFrom(fixture.countryChoices, index).id,
      cityId: selectFrom(cityIds, index * 5),
      companyTypeId: selectFrom(fixture.companyTypeChoices, index * 2).id,
      employeeRangeId: selectFrom(employeeRangeIds, index * 3),
      therapeuticAreaIds,
      serviceIds: selectedTaxonomyIds(fixture.serviceIds, index * 3, 8),
      technologyIds: selectedTaxonomyIds(fixture.technologyIds, index * 5, 8),
      active: index % 5 !== 0,
      rating: Number((3.2 + ((index * 17) % 18) / 10).toFixed(1)),
    };
  });
}
