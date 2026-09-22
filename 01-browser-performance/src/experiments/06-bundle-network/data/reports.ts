export type ReportStatus = "Published" | "In review" | "Scheduled";

export type Report = {
  id: string;
  title: string;
  owner: string;
  region: string;
  status: ReportStatus;
  period: string;
  updatedAt: string;
  incidents: number;
};

const reportTitles = [
  "Daily fulfillment health",
  "Carrier exception review",
  "Warehouse throughput",
  "Service-level commitment",
  "Inventory aging",
  "Regional operating plan",
];
const owners = ["Avery Chen", "Morgan Bell", "Samir Patel", "Lena Ortiz"];
const regions = ["North America", "EMEA", "APAC", "Latin America"];
const statuses: ReportStatus[] = ["Published", "In review", "Scheduled"];

export const reports: Report[] = Array.from({ length: 84 }, (_, index) => {
  const day = String((index % 28) + 1).padStart(2, "0");

  return {
    id: `OPS-${String(1042 - index).padStart(4, "0")}`,
    title: `${reportTitles[index % reportTitles.length]} — Week ${
      (index % 12) + 1
    }`,
    owner: owners[index % owners.length],
    region: regions[index % regions.length],
    status: statuses[index % statuses.length],
    period: `2026-Q${(index % 3) + 1}`,
    updatedAt: `2026-09-${day} ${String(8 + (index % 9)).padStart(2, "0")}:30`,
    incidents: (index * 3) % 17,
  };
});

export const analyticsSeries = [
  { week: "W1", onTime: 91, exceptions: 14 },
  { week: "W2", onTime: 93, exceptions: 11 },
  { week: "W3", onTime: 92, exceptions: 16 },
  { week: "W4", onTime: 95, exceptions: 9 },
  { week: "W5", onTime: 94, exceptions: 12 },
  { week: "W6", onTime: 96, exceptions: 7 },
  { week: "W7", onTime: 95, exceptions: 10 },
  { week: "W8", onTime: 97, exceptions: 6 },
];
