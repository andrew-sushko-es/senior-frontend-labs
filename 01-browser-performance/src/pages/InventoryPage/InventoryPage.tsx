import { useState } from "react";
import { FiltersPanel } from "../../components/FiltersPanel/FiltersPanel";
import { InventoryStats } from "../../components/InventoryStats/InventoryStats";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import { ProductTable } from "../../components/ProductTable/ProductTable";
import { DEFAULT_FILTERS, SORT_OPTION_LABELS } from "../../data/constants";
import type { InventoryFilters } from "../../domain/filters";
import type { Product } from "../../domain/product";
import {
  filterProducts,
  selectTopProducts,
} from "../../utils/productProcessing";
import "./InventoryPage.css";

interface InventoryPageProps {
  products: Product[];
}

function processProducts(
  products: Product[],
  filters: InventoryFilters,
): { filteredProducts: Product[]; visibleProducts: Product[] } {
  const filteredProducts = filterProducts(products, filters);
  const visibleProducts = selectTopProducts(
    filteredProducts,
    filters.sort,
    100,
  );
  return { filteredProducts, visibleProducts };
}

export function InventoryPage({ products }: InventoryPageProps) {
  const [appliedFilters, setAppliedFilters] = useState<InventoryFilters>({
    ...DEFAULT_FILTERS,
  });

  const [processedProducts, setProcessedProducts] = useState<{
    filteredProducts: Product[];
    visibleProducts: Product[];
  }>(() => processProducts(products, DEFAULT_FILTERS));

  function applyFilters(filters: InventoryFilters) {
    setAppliedFilters(filters);
    setProcessedProducts(processProducts(products, filters));
  }

  return (
    <main className="inventory-page">
      <PageHeader />
      <FiltersPanel onApply={applyFilters} />
      <p className="applied-sort">
        Applied sort: {SORT_OPTION_LABELS[appliedFilters.sort]}
      </p>
      <InventoryStats products={processedProducts.filteredProducts} />
      <ProductTable products={processedProducts.visibleProducts} />
    </main>
  );
}
