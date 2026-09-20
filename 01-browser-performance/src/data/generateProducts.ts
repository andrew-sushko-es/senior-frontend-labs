import {
  BRANDS,
  PRODUCT_ADJECTIVES,
  PRODUCT_CATEGORIES,
  PRODUCT_NOUNS,
  WAREHOUSES,
} from "./constants";
import type { Product } from "../domain/product";
import { normalizeSearchValue } from "../utils/productProcessing";

function createSeededRandom(seed: number) {
  let value = seed >>> 0;

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function pick<T>(items: T[], random: () => number): T {
  return items[Math.floor(random() * items.length)] as T;
}

export function generateProducts(count: number): Product[] {
  const random = createSeededRandom(204893);
  const products: Product[] = [];
  const startDate = Date.UTC(2023, 0, 1);
  const dateRange = 1000 * 60 * 60 * 24 * 960;

  for (let index = 0; index < count; index += 1) {
    const adjective = pick(PRODUCT_ADJECTIVES, random);
    const noun = pick(PRODUCT_NOUNS, random);
    const brand = pick(BRANDS, random);
    const category = pick(PRODUCT_CATEGORIES, random);
    const warehouse = pick(WAREHOUSES, random);
    const price = Math.round((5 + random() * 2495) * 100) / 100;
    const stock = Math.floor(random() * 501);
    const rating = Math.round((1 + random() * 4) * 10) / 10;
    const updatedAt = new Date(
      startDate + Math.floor(random() * dateRange),
    ).toISOString();
    const sku = `${category.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(6, "0")}`;
    const name = `${adjective} ${noun}`;
    const description = `${brand} ${noun.toLowerCase()} for professional operations, everyday work, and reliable home use.`;

    products.push({
      id: index + 1,
      sku,
      name,
      description,
      category,
      brand,
      price,
      stock,
      rating,
      reviewCount: Math.floor(random() * 10001),
      searchValues: [name, sku, brand, description, warehouse].map(
        normalizeSearchValue,
      ),
      warehouse,
      updatedAt,
    });
  }

  return products;
}
