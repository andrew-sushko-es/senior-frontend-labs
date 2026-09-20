import type { InventoryFilters, InventoryStats, SortOption } from '../domain/filters';
import type { Product } from '../domain/product';

function normalizeSearchValue(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('en-US')
    .replace(/[._-]/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function filterProducts(products: Product[], filters: InventoryFilters): Product[] {
  const searchTerm = normalizeSearchValue(filters.search);

  let result = products.filter((product) => {
    if (searchTerm.length === 0) {
      return true;
    }

    return [product.name, product.sku, product.brand, product.description, product.warehouse]
      .some((value) => normalizeSearchValue(value).includes(searchTerm));
  });

  result = result.filter((product) => filters.category === 'all' || product.category === filters.category);
  result = result.filter((product) => {
    if (filters.stock === 'in-stock') return product.stock > 0;
    if (filters.stock === 'low-stock') return product.stock > 0 && product.stock <= 20;
    if (filters.stock === 'out-of-stock') return product.stock === 0;
    return true;
  });
  result = result.filter((product) => product.rating >= filters.minRating);
  result = result.filter(
    (product) => product.price >= filters.minPrice && product.price <= filters.maxPrice,
  );

  return result;
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];

  sorted.sort((first, second) => {
    switch (sort) {
      case 'name-asc':
        return first.name.localeCompare(second.name, 'en-US', { sensitivity: 'base' });
      case 'name-desc':
        return second.name.localeCompare(first.name, 'en-US', { sensitivity: 'base' });
      case 'price-asc':
        return first.price - second.price;
      case 'price-desc':
        return second.price - first.price;
      case 'rating-desc':
        return second.rating - first.rating;
      case 'stock-desc':
        return second.stock - first.stock;
      case 'updated-desc':
        return new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime();
    }
  });

  return sorted;
}

export function calculateInventoryStats(products: Product[]): InventoryStats {
  const matchingProducts = products.length;
  const totalInventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0,
  );
  const totalStock = products.reduce((total, product) => total + product.stock, 0);
  const ratingTotal = products.reduce((total, product) => total + product.rating, 0);
  const priceTotal = products.reduce((total, product) => total + product.price, 0);
  const outOfStockCount = products.filter((product) => product.stock === 0).length;
  const lowStockCount = products.filter(
    (product) => product.stock > 0 && product.stock <= 20,
  ).length;
  const highestPricedProduct = [...products].sort((first, second) => second.price - first.price)[0] ?? null;
  const mostReviewedProduct = [...products].sort(
    (first, second) => second.reviewCount - first.reviewCount,
  )[0] ?? null;

  return {
    matchingProducts,
    totalInventoryValue,
    totalStock,
    averageRating: matchingProducts === 0 ? 0 : ratingTotal / matchingProducts,
    averagePrice: matchingProducts === 0 ? 0 : priceTotal / matchingProducts,
    outOfStockCount,
    lowStockCount,
    highestPricedProduct,
    mostReviewedProduct,
  };
}
