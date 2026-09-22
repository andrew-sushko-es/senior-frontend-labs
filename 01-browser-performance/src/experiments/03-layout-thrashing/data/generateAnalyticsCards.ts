export type AnalyticsCardData = {
  id: string;
  name: string;
  owner: string;
  status: "On track" | "Review" | "At risk";
  region: string;
  segment: string;
  revenue: string;
  conversion: string;
  pipeline: string;
  renewal: string;
  progress: number;
  tags: string[];
  summary: string;
};

const accounts = [
  "Northstar Health",
  "Atlas Financial",
  "Meridian Works",
  "Lumen Retail",
  "Summit Logistics",
  "Harbor Energy",
  "Crescent Bio",
  "Vantage Cloud",
  "Evergreen Foods",
  "Aster Mobility",
  "Pioneer Systems",
  "Signal Commerce",
];

const owners = ["Avery Kim", "Noah Patel", "Maya Chen", "Leo Martin", "Sofia Reyes", "Owen Brooks"];
const regions = ["North America", "EMEA", "APAC", "LATAM"];
const segments = ["Enterprise", "Growth", "Strategic", "Commercial"];
const tagGroups = [
  ["Expansion", "Q4 focus", "Executive"],
  ["Renewal", "Forecast", "Partner"],
  ["Adoption", "Growth", "Priority"],
  ["Pipeline", "Review", "Multi-region"],
];

function formatMoney(value: number) {
  return `$${value.toLocaleString("en-US")}k`;
}

export function generateAnalyticsCards(count: number): AnalyticsCardData[] {
  return Array.from({ length: count }, (_, index) => {
    const statusIndex = index % 9;
    const status =
      statusIndex === 0 ? "At risk" : statusIndex % 3 === 0 ? "Review" : "On track";
    const account = accounts[index % accounts.length];
    const accountNumber = String(Math.floor(index / accounts.length) + 1).padStart(2, "0");
    const revenue = 120 + ((index * 37) % 760);

    return {
      id: `portfolio-${index + 1}`,
      name: `${account} ${accountNumber}`,
      owner: owners[index % owners.length],
      status,
      region: regions[index % regions.length],
      segment: segments[index % segments.length],
      revenue: formatMoney(revenue),
      conversion: `${22 + ((index * 7) % 41)}%`,
      pipeline: formatMoney(80 + ((index * 29) % 640)),
      renewal: `${61 + ((index * 11) % 34)}%`,
      progress: 35 + ((index * 13) % 61),
      tags: tagGroups[index % tagGroups.length],
      summary: `Account plan updated for the current forecast cycle with regional delivery milestones and stakeholder follow-up.`,
    };
  });
}
