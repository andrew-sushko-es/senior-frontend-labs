import type { Product, ProductCategory } from './product';

export type StockFilter = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';

export type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'stock-desc'
  | 'updated-desc';

export interface InventoryFilters {
  search: string;
  category: ProductCategory | 'all';
  stock: StockFilter;
  minRating: number;
  minPrice: number;
  maxPrice: number;
  sort: SortOption;
}

export interface InventoryStats {
  matchingProducts: number;
  totalInventoryValue: number;
  totalStock: number;
  averageRating: number;
  averagePrice: number;
  outOfStockCount: number;
  lowStockCount: number;
  highestPricedProduct: Product | null;
  mostReviewedProduct: Product | null;
}
