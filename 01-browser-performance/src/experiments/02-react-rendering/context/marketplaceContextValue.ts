import { createContext } from "react";
import type { Company, MarketplaceFilters } from "../domain/company";

export type DatasetSize = 100 | 500 | 1000;

export type MarketplaceContextValue = {
  companies: Company[];
  datasetSize: DatasetSize;
  search: string;
  filters: MarketplaceFilters;
  watchlist: Set<string>;
  compactMode: boolean;
  compareSelection: string[];
  selectedCompanyId: string | null;
  setDatasetSize: (size: DatasetSize) => void;
  setSearch: (value: string) => void;
  setFilters: (filters: MarketplaceFilters) => void;
  toggleWatchlist: (companyId: string) => void;
  setCompactMode: (compact: boolean) => void;
  toggleCompare: (companyId: string) => void;
  setSelectedCompanyId: (companyId: string | null) => void;
};

export const MarketplaceContext = createContext<MarketplaceContextValue | null>(
  null,
);
