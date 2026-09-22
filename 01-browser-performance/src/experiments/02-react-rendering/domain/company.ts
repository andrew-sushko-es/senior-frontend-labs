export type CompanyMetric = {
  period: string;
  enrolledParticipants: number;
  completedParticipants: number;
  responseRate: number;
};

export type Company = {
  id: string;
  name: string;
  description: string;
  country: string;
  city: string;
  companyType: string;
  employeeRange: string;
  therapeuticAreas: string[];
  services: string[];
  rating: number;
  reviewsCount: number;
  activeTrials: number;
  completedTrials: number;
  responseRate: number;
  verified: boolean;
  history: CompanyMetric[];
};

export type MarketplaceFilters = {
  country: string;
  companyType: string;
  verifiedOnly: boolean;
};
