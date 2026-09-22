export type VehicleStatus = "On route" | "At depot" | "Needs attention";

export type Vehicle = {
  id: string;
  name: string;
  driver: string;
  route: string;
  status: VehicleStatus;
  lastUpdated: string;
  utilization: number;
};

export const vehicles: Vehicle[] = [
  {
    id: "FLT-204",
    name: "Sprinter 204",
    driver: "Maya Rodriguez",
    route: "North loop",
    status: "On route",
    lastUpdated: "08:42 UTC",
    utilization: 82,
  },
  {
    id: "FLT-317",
    name: "Box truck 317",
    driver: "Theo Martins",
    route: "Harbor transfer",
    status: "At depot",
    lastUpdated: "08:39 UTC",
    utilization: 58,
  },
  {
    id: "FLT-428",
    name: "Reefer 428",
    driver: "Nina Okafor",
    route: "Airport express",
    status: "Needs attention",
    lastUpdated: "08:37 UTC",
    utilization: 74,
  },
  {
    id: "FLT-511",
    name: "Cargo van 511",
    driver: "Elliot Park",
    route: "West distribution",
    status: "On route",
    lastUpdated: "08:35 UTC",
    utilization: 91,
  },
  {
    id: "FLT-612",
    name: "Box truck 612",
    driver: "Samira Khan",
    route: "South retail run",
    status: "On route",
    lastUpdated: "08:31 UTC",
    utilization: 68,
  },
  {
    id: "FLT-706",
    name: "Sprinter 706",
    driver: "Jon Bell",
    route: "Central returns",
    status: "At depot",
    lastUpdated: "08:28 UTC",
    utilization: 46,
  },
];
