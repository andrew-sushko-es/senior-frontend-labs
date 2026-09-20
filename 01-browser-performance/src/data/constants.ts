import type { InventoryFilters, SortOption, StockFilter } from '../domain/filters';
import type { ProductCategory } from '../domain/product';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Electronics',
  'Home',
  'Sports',
  'Books',
  'Clothing',
  'Food',
  'Automotive',
  'Garden',
];

export const BRANDS = [
  'Apex', 'Northstar', 'Verde', 'Cedar & Co.', 'Orbit', 'Summit', 'Harbor', 'Morrow',
];

export const WAREHOUSES = [
  'Warsaw Central', 'Berlin North', 'Prague Hub', 'Vienna South', 'Amsterdam West',
];

export const PRODUCT_ADJECTIVES = [
  'Professional', 'Smart', 'Wireless', 'Compact', 'Essential', 'Classic', 'Home', 'Sport',
  'Portable', 'Precision', 'Everyday', 'Advanced',
];

export const PRODUCT_NOUNS = [
  'Keyboard', 'Garden Lamp', 'Running Shoes', 'Coffee Grinder', 'Bluetooth Speaker',
  'Storage Case', 'Water Bottle', 'Desk Organizer', 'Travel Bag', 'Tool Set',
  'Reading Light', 'Kitchen Scale',
];

export const DEFAULT_FILTERS: InventoryFilters = {
  search: '',
  category: 'all',
  stock: 'all',
  minRating: 0,
  minPrice: 0,
  maxPrice: 2500,
  sort: 'name-asc',
};

export const STOCK_FILTER_LABELS: Record<StockFilter, string> = {
  all: 'All stock levels',
  'in-stock': 'In stock',
  'low-stock': 'Low stock',
  'out-of-stock': 'Out of stock',
};

export const SORT_OPTION_LABELS: Record<SortOption, string> = {
  'name-asc': 'Name: A to Z',
  'name-desc': 'Name: Z to A',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  'rating-desc': 'Rating: high to low',
  'stock-desc': 'Stock: high to low',
  'updated-desc': 'Recently updated',
};
