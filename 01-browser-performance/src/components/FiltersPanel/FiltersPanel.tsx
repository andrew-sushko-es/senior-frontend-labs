import { useState } from 'react';
import {
  DEFAULT_FILTERS,
  PRODUCT_CATEGORIES,
  SORT_OPTION_LABELS,
  STOCK_FILTER_LABELS,
} from '../../data/constants';
import type { InventoryFilters, SortOption, StockFilter } from '../../domain/filters';
import './FiltersPanel.css';

interface FiltersPanelProps {
  onApply: (filters: InventoryFilters) => void;
}

export function FiltersPanel({ onApply }: FiltersPanelProps) {
  const [draftFilters, setDraftFilters] = useState<InventoryFilters>({ ...DEFAULT_FILTERS });

  function updateNumberFilter(name: 'minRating' | 'minPrice' | 'maxPrice', value: string) {
    setDraftFilters({ ...draftFilters, [name]: Number(value) || 0 });
  }

  function resetFilters() {
    const resetValues = { ...DEFAULT_FILTERS };
    setDraftFilters(resetValues);
    onApply(resetValues);
  }

  return (
    <section className="filters-panel" aria-labelledby="filters-heading">
      <div className="section-heading">
        <div>
          <p className="section-heading__eyebrow">Product inventory</p>
          <h2 id="filters-heading">Filters</h2>
        </div>
        <p>Update the criteria, then apply them to refresh the inventory view.</p>
      </div>

      <div className="filters-panel__grid">
        <label className="field field--wide">
          <span>Search products</span>
          <input
            type="search"
            value={draftFilters.search}
            onChange={(event) => setDraftFilters({ ...draftFilters, search: event.target.value })}
            placeholder="Name, SKU, brand, warehouse..."
          />
        </label>

        <label className="field">
          <span>Category</span>
          <select
            value={draftFilters.category}
            onChange={(event) => setDraftFilters({
              ...draftFilters,
              category: event.target.value as InventoryFilters['category'],
            })}
          >
            <option value="all">All categories</option>
            {PRODUCT_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>

        <label className="field">
          <span>Stock status</span>
          <select
            value={draftFilters.stock}
            onChange={(event) => setDraftFilters({
              ...draftFilters,
              stock: event.target.value as StockFilter,
            })}
          >
            {Object.entries(STOCK_FILTER_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Minimum rating</span>
          <select
            value={draftFilters.minRating}
            onChange={(event) => updateNumberFilter('minRating', event.target.value)}
          >
            {[0, 1, 2, 3, 4, 4.5].map((rating) => <option key={rating} value={rating}>{rating.toFixed(1)} and up</option>)}
          </select>
        </label>

        <label className="field">
          <span>Minimum price</span>
          <input
            type="number"
            min="0"
            max="2500"
            value={draftFilters.minPrice}
            onChange={(event) => updateNumberFilter('minPrice', event.target.value)}
          />
        </label>

        <label className="field">
          <span>Maximum price</span>
          <input
            type="number"
            min="0"
            max="2500"
            value={draftFilters.maxPrice}
            onChange={(event) => updateNumberFilter('maxPrice', event.target.value)}
          />
        </label>

        <label className="field field--wide">
          <span>Sort results</span>
          <select
            value={draftFilters.sort}
            onChange={(event) => setDraftFilters({
              ...draftFilters,
              sort: event.target.value as SortOption,
            })}
          >
            {Object.entries(SORT_OPTION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="filters-panel__actions">
        <button type="button" className="button button--primary" onClick={() => onApply(draftFilters)}>
          Apply filters
        </button>
        <button type="button" className="button button--secondary" onClick={resetFilters}>
          Reset
        </button>
      </div>
    </section>
  );
}
