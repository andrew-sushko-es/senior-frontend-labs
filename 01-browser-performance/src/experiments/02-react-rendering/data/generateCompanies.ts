import type { Company, CompanyMetric } from "../domain/company";

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
const countries = [
  "United States",
  "Germany",
  "Switzerland",
  "United Kingdom",
  "France",
  "Japan",
  "Singapore",
];
const cities = [
  "Boston",
  "Berlin",
  "Basel",
  "Cambridge",
  "Lyon",
  "Osaka",
  "Singapore",
];
const companyTypes = [
  "Biotechnology",
  "Clinical research organization",
  "CDMO",
  "Diagnostics",
  "Platform company",
];
const employeeRanges = [
  "1–10 employees",
  "11–50 employees",
  "51–200 employees",
  "201–500 employees",
  "501+ employees",
];
const therapeuticAreas = [
  "Oncology",
  "Immunology",
  "Neurology",
  "Rare disease",
  "Cardiometabolic",
  "Infectious disease",
  "Cell therapy",
  "Dermatology",
];
const services = [
  "Clinical operations",
  "Biostatistics",
  "Regulatory strategy",
  "Patient recruitment",
  "Data management",
  "Medical writing",
  "Site monitoring",
  "Pharmacovigilance",
];

function pick<T>(items: T[], index: number) {
  return items[((index % items.length) + items.length) % items.length];
}

function createHistory(index: number): CompanyMetric[] {
  return Array.from({ length: 24 }, (_, monthIndex) => {
    const enrolledParticipants =
      42 + ((index * 19 + monthIndex * 11 + monthIndex * monthIndex) % 185);
    const completedParticipants = Math.max(
      12,
      enrolledParticipants - ((index * 7 + monthIndex * 5) % 38),
    );
    return {
      period: `202${Math.floor(monthIndex / 12) + 3}-${String((monthIndex % 12) + 1).padStart(2, "0")}`,
      enrolledParticipants,
      completedParticipants,
      responseRate: 68 + ((index * 13 + monthIndex * 3) % 29),
    };
  });
}

function selectLabels(items: string[], index: number, count: number) {
  return Array.from({ length: count }, (_, offset) =>
    pick(items, index * 3 + offset * 5),
  );
}

export function generateCompanies(count: number): Company[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `marketplace-company-${index + 1}`,
    name: `${pick(companyPrefixes, index)} ${pick(companySuffixes, index * 3)}`,
    description: `${index % 2 === 0 ? "Biopharma" : "Life science"} organization supporting sponsor teams from study planning through regulated delivery.`,
    country: pick(countries, index),
    city: pick(cities, index * 5),
    companyType: pick(companyTypes, index * 2),
    employeeRange: pick(employeeRanges, index * 3),
    therapeuticAreas: selectLabels(therapeuticAreas, index, 3),
    services: selectLabels(services, index * 2, 5),
    rating: Number((3.1 + ((index * 17) % 19) / 10).toFixed(1)),
    reviewsCount: 18 + ((index * 29) % 460),
    activeTrials: 3 + ((index * 7) % 34),
    completedTrials: 12 + ((index * 11) % 112),
    responseRate: 68 + ((index * 13) % 29),
    verified: index % 4 !== 0,
    history: createHistory(index),
  }));
}

export const marketplaceOptions = { countries, companyTypes };
