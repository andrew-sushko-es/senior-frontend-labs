# Browser Performance Lab — Codex Project Specification

## Role

You are generating the initial codebase for a learning project called **Browser Performance Lab**.

The project is used to train a Senior Frontend Engineer in:

- Chrome DevTools Performance profiling;
- browser main-thread analysis;
- long tasks;
- expensive JavaScript;
- React rendering behavior;
- performance benchmarks;
- later labs covering layout, memory, network, bundle size, Web Vitals, and browser rendering.

The first version of the application must be **intentionally inefficient**, but the inefficiencies must look like plausible application code rather than artificial benchmark loops.

Do **not** optimize the application.

Do **not** add comments such as:

```ts
// BAD PERFORMANCE
// intentionally slow
// bottleneck here
```

Do not reveal the intended bottlenecks in the UI, README, variable names, or comments.

The developer using this project must discover the problems through profiling.

---

# 1. Tech stack

Use:

- React
- TypeScript
- Vite
- plain CSS or CSS Modules
- ESLint

Do not use:

- Next.js
- Redux
- Zustand
- MobX
- React Query
- Material UI
- AG Grid
- Tailwind
- lodash
- charting libraries
- Web Workers
- virtualization libraries

Keep dependencies minimal.

The app must work with:

```bash
npm install
npm run dev
npm run build
npm run preview
```

The production build must succeed without TypeScript errors.

---

# 2. Application idea

Build an internal dashboard called:

# Inventory Explorer

The application represents a large product inventory used by an operations team.

The user can:

- search products;
- filter by category;
- filter by stock status;
- select minimum rating;
- select a price range;
- sort results;
- click `Apply filters`;
- reset filters;
- inspect summary statistics;
- view the first 100 matching rows.

The dataset should contain approximately **100,000 products**.

The application is deliberately CPU-heavy when applying filters.

The UI itself should remain simple and professional.

---

# 3. Main learning objective of this baseline

This initial version is primarily for investigating:

- main-thread blocking;
- long tasks;
- JavaScript execution time;
- interaction latency;
- synchronous data processing;
- expensive derived computations;
- React work happening around the interaction.

Do not make DOM size the dominant bottleneck yet.

Only render the first 100 matching products.

Do not intentionally create layout thrashing, memory leaks, huge images, or bundle-size problems in this first baseline.

Those will be separate labs later.

---

# 4. Project structure

Create approximately this structure:

```text
src/
├── app/
│   └── App.tsx
│
├── pages/
│   └── InventoryPage/
│       ├── InventoryPage.tsx
│       └── InventoryPage.css
│
├── components/
│   ├── FiltersPanel/
│   │   ├── FiltersPanel.tsx
│   │   └── FiltersPanel.css
│   │
│   ├── InventoryStats/
│   │   ├── InventoryStats.tsx
│   │   └── InventoryStats.css
│   │
│   ├── ProductTable/
│   │   ├── ProductTable.tsx
│   │   ├── ProductRow.tsx
│   │   └── ProductTable.css
│   │
│   └── PageHeader/
│       └── PageHeader.tsx
│
├── data/
│   ├── generateProducts.ts
│   └── constants.ts
│
├── domain/
│   ├── product.ts
│   └── filters.ts
│
├── utils/
│   ├── productProcessing.ts
│   └── formatters.ts
│
├── main.tsx
└── index.css

docs/
└── benchmarks/
    └── 01-expensive-js.md

README.md
```

Small deviations are acceptable if the architecture remains clean.

---

# 5. Product model

Use a TypeScript model similar to:

```ts
export type ProductCategory =
  | 'Electronics'
  | 'Home'
  | 'Sports'
  | 'Books'
  | 'Clothing'
  | 'Food'
  | 'Automotive'
  | 'Garden';

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  category: ProductCategory;
  brand: string;
  price: number;
  stock: number;
  rating: number;
  reviewCount: number;
  warehouse: string;
  updatedAt: string;
}
```

Generate approximately:

```ts
100_000
```

products.

---

# 6. Deterministic data generation

The dataset must be deterministic.

Do not use plain `Math.random()` directly for product creation.

Implement a tiny seeded pseudo-random generator so that every application run generates the same dataset.

For example:

```ts
createSeededRandom(seed: number)
```

Use a fixed seed.

The exact dataset must remain stable between benchmark runs.

Use predefined arrays for:

- category;
- brand;
- warehouse;
- adjective;
- product noun.

Example names:

```text
Wireless Keyboard
Compact Garden Lamp
Professional Running Shoes
Smart Coffee Grinder
Portable Bluetooth Speaker
```

Fields should have realistic ranges:

```text
price:       5 - 2500
stock:       0 - 500
rating:      1.0 - 5.0
reviewCount: 0 - 10000
```

Use multiple warehouses such as:

```text
Warsaw Central
Berlin North
Prague Hub
Vienna South
Amsterdam West
```

Generate ISO date strings for `updatedAt`.

---

# 7. Filter model

Create a filter type similar to:

```ts
export type StockFilter =
  | 'all'
  | 'in-stock'
  | 'low-stock'
  | 'out-of-stock';

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
```

---

# 8. UI layout

Create a dashboard approximately like:

```text
┌──────────────────────────────────────────────────────────────┐
│ Inventory Explorer                                           │
│ Browser Performance Lab                                      │
├──────────────────────────────────────────────────────────────┤
│ Search            Category         Stock                     │
│ [..............]  [All ▼]          [All ▼]                   │
│                                                              │
│ Min rating        Min price        Max price                  │
│ [3 ▼]             [0]              [2500]                     │
│                                                              │
│ Sort                                                         │
│ [Price ascending ▼]                                          │
│                                                              │
│ [Apply filters] [Reset]                                      │
├──────────────────────────────────────────────────────────────┤
│ Matching products        Inventory value     Avg rating       │
│ 38,421                   $12,819,231          4.12             │
│                                                              │
│ Total stock              Out of stock        Avg price        │
│ ...                      ...                 ...              │
├──────────────────────────────────────────────────────────────┤
│ Product table                                                 │
│ SKU | Name | Category | Price | Stock | Rating | Updated      │
│ ...                                                           │
└──────────────────────────────────────────────────────────────┘
```

Desktop-first is enough.

It should still be usable around tablet width.

Do not spend excessive effort on design.

---

# 9. Interaction model

Filters must use two layers of state:

```text
draft filters
applied filters
```

Changing an input should update only the draft state.

Heavy processing should happen when the user clicks:

```text
Apply filters
```

This gives us a clear interaction to record in Chrome Performance.

The flow should approximately be:

```text
edit filters
    ↓
click Apply filters
    ↓
set applied filters
    ↓
synchronous processing
    ↓
React render
    ↓
updated stats and table
```

Reset should restore default filters and apply them.

---

# 10. Intentionally inefficient processing

This section is important.

Implement plausible but deliberately inefficient synchronous data processing.

Do not use artificial loops whose only purpose is to burn CPU.

The code should look like something a real application developer might have written before profiling.

## 10.1 Multiple full-array passes

Instead of combining filters efficiently, use several sequential passes.

Example conceptual flow:

```ts
let result = products;

result = result.filter(searchPredicate);
result = result.filter(categoryPredicate);
result = result.filter(stockPredicate);
result = result.filter(ratingPredicate);
result = result.filter(pricePredicate);
```

Each filter should create a new array.

Do not optimize them into one predicate.

---

# 10.2 Expensive search normalization

Search across several fields:

- name;
- sku;
- brand;
- description;
- warehouse.

Inside the filtering callback, repeatedly normalize strings.

Use operations such as:

```ts
value
  .trim()
  .toLocaleLowerCase()
  .replace(...)
  .normalize('NFD')
```

Do not precompute normalized searchable fields.

Do not cache normalized values.

Do not create a search index.

The work should happen while applying filters.

---

# 10.3 Sorting

Sort the entire filtered result synchronously.

Copy the array before sorting:

```ts
const sorted = [...result].sort(...)
```

For some sort modes, use relatively expensive comparison work.

For name sorting, use:

```ts
localeCompare
```

For updated date sorting, parse dates inside the comparator:

```ts
new Date(a.updatedAt).getTime()
new Date(b.updatedAt).getTime()
```

Do not precompute timestamps.

---

# 10.4 Statistics

Calculate these values:

- matching product count;
- total inventory value;
- total stock;
- average rating;
- average price;
- out-of-stock count;
- low-stock count;
- highest-priced product;
- most-reviewed product.

Intentionally calculate statistics using **separate passes** over the filtered array.

For example, prefer several calls to:

```ts
reduce
filter
sort
```

rather than a single optimized aggregation pass.

For `highest-priced product` and `most-reviewed product`, it is acceptable to create copied arrays and sort them separately.

This is intentionally inefficient.

Do not mention that in code comments.

---

# 10.5 Repeated derived work

Keep the processing architecture slightly naive.

It is acceptable for separate parts of the UI to derive related values independently from the same result set.

For example:

```text
InventoryPage
  -> processed products

InventoryStats
  -> calculates statistics from all processed products

ProductTable
  -> derives first 100 rows
```

Do not introduce memoization.

Do not use:

```ts
useMemo
memo
useCallback
```

unless React requires something for correctness.

---

# 10.6 Date formatting

In visible rows, format `updatedAt` at render time using `Intl.DateTimeFormat` or similar logic.

Do not pre-format values in the data generator.

Keep the implementation reasonable and readable.

---

# 11. Processing utilities

Create utilities in:

```text
src/utils/productProcessing.ts
```

Suggested exported functions:

```ts
filterProducts(
  products: Product[],
  filters: InventoryFilters
): Product[]

sortProducts(
  products: Product[],
  sort: SortOption
): Product[]

calculateInventoryStats(
  products: Product[]
): InventoryStats
```

The implementation should remain intentionally unoptimized as described above.

Do not hide all logic in one giant component.

We want meaningful function names to appear in Chrome DevTools call stacks.

That is important for profiling.

---

# 12. Inventory statistics type

Use something similar to:

```ts
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
```

---

# 13. Product table

Render only:

```ts
products.slice(0, 100)
```

Do not render all 100,000 products.

Columns:

```text
SKU
Name
Brand
Category
Price
Stock
Rating
Reviews
Warehouse
Updated
```

Show a note such as:

```text
Showing first 100 of 38,421 matching products
```

Do not add pagination yet.

Do not add virtualization yet.

---

# 14. React behavior

Use ordinary React components and props.

Do not deliberately create absurd React anti-patterns.

However:

- do not memoize components;
- do not memoize derived values;
- allow parent renders to naturally rerender children;
- inline callbacks are acceptable;
- inline derived objects are acceptable.

The **primary baseline problem must still be synchronous JavaScript processing**, not thousands of React components.

---

# 15. Dataset initialization

Generate the product dataset synchronously in application startup.

Use something conceptually similar to:

```ts
const products = generateProducts(100_000);
```

Keep the generated data stable for the application lifetime.

Do not fetch it from a backend.

Do not persist it to IndexedDB/localStorage.

The main experiment is local CPU work.

---

# 16. Styling

Create a neutral professional dashboard.

Requirements:

- light background;
- centered content;
- readable table;
- clear form controls;
- simple cards for statistics;
- responsive enough for normal desktop widths.

Avoid visual effects that themselves introduce performance noise.

Do not use:

- animated gradients;
- large box-shadow animations;
- canvas;
- SVG animations;
- CSS transitions on large layout properties.

---

# 17. Benchmark document

Create:

```text
docs/benchmarks/01-expensive-js.md
```

with exactly these sections:

```md
# Lab 01 — Main Thread / Expensive JavaScript

## Problem

TBD

## Test Scenario

TBD

## Environment

TBD

## Baseline

TBD

## Performance Trace

TBD

## Observations

TBD

## Hypothesis

TBD

## Optimization

TBD

## Results

TBD

## Trade-offs

TBD
```

Do not fill in results.

The developer must do that after profiling.

---

# 18. README

Create a small README.

It should contain only:

- project name;
- short description;
- tech stack;
- commands;
- explanation that this repository is a browser-performance learning lab;
- current lab: `01 — Main Thread / Expensive JavaScript`.

Do not explain where the performance bottlenecks are.

Do not list the intentional implementation mistakes.

Do not spoil the exercise.

---

# 19. Performance measurement preparation

Do not install a benchmark framework yet.

However, structure the app so we can later add:

```ts
performance.mark()
performance.measure()
PerformanceObserver
```

Do not add these APIs in the initial baseline unless needed for a tiny generic helper.

For now Chrome DevTools will be the primary measurement tool.

---

# 20. Important implementation constraints

The final generated application must satisfy all of these:

- React + TypeScript + Vite;
- approximately 100,000 deterministic products;
- production build works;
- filter interaction is synchronous;
- filtering performs several array passes;
- text normalization happens repeatedly while searching;
- sorting operates on the full matching result;
- statistics use multiple independent passes;
- no memoization;
- no Web Workers;
- no virtualization;
- only 100 table rows rendered;
- no artificial busy-wait loops;
- no random infinite loops;
- no intentionally broken UX;
- no performance hints in code comments;
- no comments revealing the intended bottleneck.

---

# 21. Default filters

Use defaults similar to:

```ts
{
  search: '',
  category: 'all',
  stock: 'all',
  minRating: 0,
  minPrice: 0,
  maxPrice: 2500,
  sort: 'name-asc'
}
```

---

# 22. Useful initial benchmark scenario

The application does not need to display these instructions in the UI, but make sure this scenario produces meaningful processing work:

```text
Search:
pro

Category:
All

Stock:
All

Minimum rating:
3

Price:
20 - 1800

Sort:
Name ascending
```

The result set should be large enough that filtering and sorting still perform meaningful work.

If the generated dataset makes this query too restrictive, adjust product-name generation so common fragments such as:

```text
pro
smart
wire
home
sport
```

occur frequently.

---

# 23. Avoid making the app unusably slow

The app should expose measurable main-thread work, especially under Chrome CPU throttling, but it should still be usable on a normal desktop.

Do not create multi-second freezes on every normal interaction.

The target is a realistic performance problem that becomes obvious in a throttled Performance trace.

If necessary, tune dataset generation and string-processing complexity so the `Apply filters` interaction is clearly measurable without making development painful.

---

# 24. Code quality

Even though the performance is intentionally poor, the code itself should be:

- strongly typed;
- readable;
- consistently named;
- split into sensible modules;
- free of TypeScript errors;
- free of obvious correctness bugs.

Bad performance must not mean bad engineering hygiene everywhere.

We want to later compare different implementations cleanly.

---

# 25. Do not optimize automatically

This is crucial.

After generating the working project:

**STOP.**

Do not:

- suggest `useMemo`;
- implement memoization;
- move work into a Web Worker;
- merge array passes;
- add caching;
- optimize sorting;
- add virtualization;
- add debouncing;
- add performance fixes;
- generate a second optimized implementation.

The repository must remain at the intentionally inefficient baseline.

The next phase will be manual profiling in Chrome DevTools.

---

# 26. Final Codex task

Generate the complete working project described above.

Then verify:

```bash
npm install
npm run build
```

Fix only correctness, TypeScript, lint, and build issues.

Do not fix performance issues.

At the end, provide a short summary containing only:

- created project structure;
- commands to run the app;
- confirmation that the production build succeeds.

Do not explain the hidden performance bottlenecks.
