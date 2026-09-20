import { Heap } from "../data-structures/Heap";
import type {
  InventoryFilters,
  InventoryStats,
  SortOption,
} from "../domain/filters";
import type { Product } from "../domain/product";

export function normalizeSearchValue(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("en-US")
    .replace(/[._-]/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function filterProducts(
  products: Product[],
  filters: InventoryFilters,
): Product[] {
  const searchTerm = normalizeSearchValue(filters.search);

  let result = products.filter((product) => {
    if (searchTerm.length === 0) {
      return true;
    }

    return product.searchValues.some((value) => value.includes(searchTerm));
  });

  result = result.filter(
    (product) =>
      filters.category === "all" || product.category === filters.category,
  );
  result = result.filter((product) => {
    if (filters.stock === "in-stock") return product.stock > 0;
    if (filters.stock === "low-stock")
      return product.stock > 0 && product.stock <= 20;
    if (filters.stock === "out-of-stock") return product.stock === 0;
    return true;
  });
  result = result.filter((product) => product.rating >= filters.minRating);
  result = result.filter(
    (product) =>
      product.price >= filters.minPrice && product.price <= filters.maxPrice,
  );

  return result;
}

export function selectTopProducts(
  products: Product[],
  sort: SortOption,
  limit: number,
): Product[] {
  const comparator = getComparator(sort);
  const heap = new Heap(limit, comparator);
  for (const product of products) {
    heap.insert(product);
  }
  return heap.toArray();
}

function getComparator(sort: SortOption) {
  const collator = new Intl.Collator("en-US", { sensitivity: "base" });
  function compareProducts(a: Product, b: Product) {
    const result = collator.compare(a.name, b.name);

    if (result !== 0) {
      return result;
    }

    return a.id - b.id;
  }

  return (first: Product, second: Product) => {
    switch (sort) {
      case "name-asc":
        return compareProducts(first, second);
      case "name-desc":
        return compareProducts(second, first);
      case "price-asc":
        return first.price - second.price;
      case "price-desc":
        return second.price - first.price;
      case "rating-desc":
        return second.rating - first.rating;
      case "stock-desc":
        return second.stock - first.stock;
      case "updated-desc":
        return (
          new Date(second.updatedAt).getTime() -
          new Date(first.updatedAt).getTime()
        );
    }
  };
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];
  console.log(products);
  const comparator = getComparator(sort);
  sorted.sort(comparator);

  return sorted;
}

export function calculateInventoryStats(products: Product[]): InventoryStats {
  const matchingProducts = products.length;
  const totalInventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0,
  );
  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0,
  );
  const ratingTotal = products.reduce(
    (total, product) => total + product.rating,
    0,
  );
  const priceTotal = products.reduce(
    (total, product) => total + product.price,
    0,
  );
  const outOfStockCount = products.filter(
    (product) => product.stock === 0,
  ).length;
  const lowStockCount = products.filter(
    (product) => product.stock > 0 && product.stock <= 20,
  ).length;
  const highestPricedProduct = products.reduce<Product | null>(
    (highest, product) => {
      if (highest === null || product.price > highest.price) {
        return product;
      }

      return highest;
    },
    null,
  );

  const mostReviewedProduct = products.reduce<Product | null>(
    (mostReviewed, product) => {
      if (
        mostReviewed === null ||
        product.reviewCount > mostReviewed.reviewCount
      ) {
        return product;
      }

      return mostReviewed;
    },
    null,
  );

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
