# Lab 01 — Main Thread / Expensive JavaScript

## Problem

The initial version of **Inventory Explorer** processed a deterministic dataset of **100,000 products** entirely on the browser main thread.

A broad filter interaction caused the UI to become unresponsive for roughly 20 seconds under CPU throttling.

The goal of this lab was not to guess which code looked inefficient. The goal was to:

1. reproduce the slow interaction;
2. capture a Chrome Performance trace;
3. identify the dominant main-thread work;
4. form and test hypotheses;
5. optimize one bottleneck at a time;
6. re-profile after every meaningful change;
7. validate correctness;
8. benchmark the initial and optimized versions under the same conditions.

The main rule throughout the investigation was:

> **Suspicion is not evidence.**

---

## Test Scenario

The application contains approximately:

```text
100,000 products
```

The investigated interaction was:

```text
Apply Filters
```

The final benchmark scenario used:

```text
Dataset:      100,000 deterministic products
Search:       empty
Sort:         Name ascending
Visible rows: 100
```

The UI displays only the first 100 products, while statistics are calculated over all matching products.

---

## Environment

Benchmark conditions:

```text
Build:               production
Bundler:             Vite
Browser:             Chrome
CPU throttling:      6× slowdown
Network throttling:  none
Dataset:             deterministic / fixed seed
Runs per version:    20
```

Development-server results were not used as final benchmark numbers.

Production source maps were enabled during profiling so application functions could be identified in Chrome DevTools.

The same dataset and user scenario were used when comparing the initial and optimized implementations.

---

## Baseline

The initial implementation performed several expensive synchronous operations during a single user interaction.

The processing pipeline was approximately:

```text
Click Apply Filters
        ↓
Filter 100,000 products
        ↓
Normalize searchable fields repeatedly
        ↓
Fully sort all matching products
        ↓
Calculate statistics
        ↓
Perform additional full sorts for max-value statistics
        ↓
React update
```

Only the first 100 sorted products were ultimately displayed.

### Initial 20-run benchmark

Interaction duration:

```text
1.  19.79 s
2.  19.62 s
3.  19.97 s
4.  21.09 s
5.  21.12 s
6.  19.63 s
7.  19.72 s
8.  19.67 s
9.  21.30 s
10. 19.88 s
11. 22.86 s
12. 21.19 s
13. 20.67 s
14. 21.09 s
15. 19.92 s
16. 19.70 s
17. 20.96 s
18. 21.02 s
19. 21.02 s
20. 21.55 s
```

Summary:

| Metric |      Initial |
| ------ | -----------: |
| Median | **20.815 s** |
| Mean   |     20.589 s |
| p75    |     21.098 s |
| p95    |     21.616 s |
| Min    |     19.620 s |
| Max    |     22.860 s |

---

## Performance Trace

The initial Chrome Performance trace showed one very large main-thread task covering almost the entire interaction.

During the task:

```text
Main thread busy
████████████████████████████████████████
~20–23 seconds
```

The browser could not process other user interactions until the synchronous work completed.

This was therefore primarily a:

```text
main-thread JavaScript computation problem
```

rather than an initial React-rendering problem.

---

## Observations

### Initial Bottom-Up analysis

A broad search that retained most of the 100,000-product dataset showed that the dominant cost was name sorting.

Representative exploratory measurements:

| Operation         |    Time |
| ----------------- | ------: |
| Total interaction | ~20.8 s |
| `sortProducts`    | ~19.9 s |
| sort comparator   | ~18.9 s |
| `filterProducts`  |  ~0.9 s |

The comparator alone accounted for roughly 90% of the interaction.

This changed the initial mental model of the problem.

The source code contained multiple `.filter()` calls, so repeated filtering initially looked suspicious. Profiling showed that filtering was measurable but was not the dominant bottleneck.

---

# Investigation 1 — Sorting Comparator

## Hypothesis

The original name comparator used locale-aware comparison directly inside the hot sorting path:

```ts
first.name.localeCompare(second.name, "en-US", {
  sensitivity: "base",
});
```

Sorting a large result set invokes the comparator a very large number of times.

The hypothesis was:

> Reusing a prepared locale-aware comparator may significantly reduce the cost of name sorting.

---

## Controlled Experiment — Name vs Numeric Sorting

Before changing the implementation, the same dataset and filters were tested with two sort modes.

### Name ascending

Median of 3 exploratory runs:

| Metric            |    Value |
| ----------------- | -------: |
| Total interaction |  20.81 s |
| `sortProducts`    |  19.89 s |
| comparator        | 18.945 s |
| `filterProducts`  |   886 ms |

### Price ascending

Median of 3 exploratory runs:

| Metric            |  Value |
| ----------------- | -----: |
| Total interaction | 1.57 s |
| `sortProducts`    | 323 ms |
| `filterProducts`  | 870 ms |

The filtering cost stayed approximately constant while sorting changed dramatically.

This showed that:

```text
Array.sort itself was not enough to explain the bottleneck.
```

The specific comparator was the dominant factor.

---

## Optimization 1 — Reusable `Intl.Collator`

The comparator was changed to reuse an `Intl.Collator`:

```ts
const collator = new Intl.Collator("en-US", {
  sensitivity: "base",
});

sorted.sort((first, second) => collator.compare(first.name, second.name));
```

The implementation deliberately avoided making assumptions about browser internals such as claiming that `localeCompare()` necessarily creates a new collator object per call.

The only claim made from the benchmark is that reusing `Intl.Collator` dramatically reduced the observed comparator cost in this Chrome workload.

### Result

Median of 3 exploratory runs:

| Metric            |   Before |      After |
| ----------------- | -------: | ---------: |
| Total interaction |  20.81 s | **1.96 s** |
| `sortProducts`    |  19.89 s | **479 ms** |
| comparator        | 18.945 s | **400 ms** |
| `filterProducts`  |   886 ms | **855 ms** |

The sorting phase became roughly 40× cheaper in this scenario.

After this optimization, sorting was no longer the overwhelming bottleneck.

The application was profiled again instead of continuing to optimize the same function.

---

# Investigation 2 — Search Normalization

## New Profiling Result

After the sorting fix, `normalizeSearchValue()` became one of the most expensive functions in Bottom-Up analysis.

The original search path normalized multiple immutable product fields during every filter interaction:

```ts
[
  product.name,
  product.sku,
  product.brand,
  product.description,
  product.warehouse,
].some((value) => normalizeSearchValue(value).includes(searchTerm));
```

The normalization pipeline included operations such as:

```text
trim
toLocaleLowerCase
replace
Unicode normalization
remove combining marks
```

These operations were repeated across a large dataset even though product fields did not change.

---

## Controlled Experiment — Search Enabled vs Disabled

The same 100,000-product dataset was tested with search enabled and with an empty query.

### Search `"a"`

Representative results:

```text
filterProducts:       ~829–930 ms
normalizeSearchValue: ~788–841 ms
```

### Search `""`

Representative results:

```text
filterProducts:       ~39 ms
normalizeSearchValue: absent from the hot path
```

Sorting and statistics stayed in approximately the same range.

This strongly indicated that repeated normalization was responsible for most filtering time.

---

## Optimization 2 — Precomputed Search Values

Normalized searchable fields were moved from interaction time to dataset creation time.

Instead of normalizing fields on every search:

```ts
normalizeSearchValue(product.name)
normalizeSearchValue(product.sku)
normalizeSearchValue(product.brand)
...
```

the generated product stores normalized search values:

```ts
searchValues: [name, sku, brand, description, warehouse].map(
  normalizeSearchValue,
);
```

Runtime filtering became approximately:

```ts
product.searchValues.some((value) => value.includes(searchTerm));
```

The query itself is still normalized once per interaction.

### Why separate search values?

A single concatenated `searchValue` would also reduce work, but it could change search semantics by allowing matches across field boundaries.

Keeping separate normalized fields preserved the original behavior and made the experiment cleaner.

### Result

Median of 3 exploratory runs:

| Metric            |  Before |       After |
| ----------------- | ------: | ----------: |
| Total interaction | ~1.96 s |  **1.32 s** |
| `filterProducts`  | ~855 ms |  **~73 ms** |
| `sortProducts`    | ~479 ms | **~507 ms** |

`normalizeSearchValue()` disappeared from the interaction hot path.

Filtering became approximately an order of magnitude cheaper.

---

# Investigation 3 — Statistics Calculation

## New Profiling Result

After search optimization, statistics calculation became one of the largest remaining costs.

The function performed multiple full passes over the product array and also contained:

```ts
[...products].sort((a, b) => b.price - a.price)[0];

[...products].sort((a, b) => b.reviewCount - a.reviewCount)[0];
```

These operations fully sorted the entire matching result set only to retrieve one maximum value.

---

## Hypothesis

Finding the highest-priced and most-reviewed products does not require full ordering.

The original work was approximately:

```text
2 × O(n log n)
```

for values that can be found with:

```text
2 × O(n)
```

linear scans.

---

## Optimization 3 — Replace Full Sorts With Linear Maximum Lookup

The two full sorts were replaced with linear reductions.

Conceptually:

```ts
const highestPricedProduct = products.reduce(/* keep current maximum */);

const mostReviewedProduct = products.reduce(/* keep current maximum */);
```

Other statistics passes were intentionally left unchanged so this remained a controlled experiment.

### Result

Before:

```text
calculateInventoryStats:
~620–665 ms
```

After:

```text
Run 1: 91.7 ms
Run 2: 97.2 ms
```

The statistics calculation became roughly 6–7× cheaper.

At this point, combining every remaining statistics pass into a single loop was possible, but profiling showed that statistics were no longer the dominant bottleneck.

The additional complexity was therefore not prioritized.

---

# Investigation 4 — Full Sort vs Top-K

## New Profiling Result

After the previous optimizations, the application still fully sorted all matching products:

```text
100,000 products
        ↓
full sort
        ↓
take first 100
```

However, the UI rendered only:

```text
100 products
```

The application was computing the exact ordering of tens of thousands of products that were never displayed.

---

## Hypothesis

The UI does not need the full ordering.

It only needs:

> the best 100 products according to the selected comparator.

A bounded Top-K algorithm can inspect every matching product while maintaining only the current best 100 candidates.

---

## Correctness Requirement

The optimized result must match:

```ts
[...products].sort(comparator).slice(0, 100);
```

A performance optimization is not valid if it produces different visible results.

A deterministic secondary comparison key was used when needed so equal names could still produce a stable total ordering.

---

## Optimization 4 — Bounded Max Heap

A generic binary heap was introduced.

For ascending name order:

```text
Heap capacity: 100
Heap root:     worst current Top-100 candidate
```

Processing logic:

```text
for every product:

  if heap has fewer than 100 elements
      insert product

  otherwise
      compare product with current worst candidate

      if new product is better
          replace heap root
          restore heap property

      otherwise
          ignore product
```

The heap still inspects the entire dataset.

It does **not** incorrectly perform:

```ts
products.slice(0, 100).sort(...)
```

Instead, it avoids computing the complete order of products that the UI will never display.

### Complexity

Full sorting:

```text
O(n log n)
```

Bounded Top-K:

```text
O(n log k)
```

where:

```text
n = number of matching products
k = 100
```

The final 100 heap elements are sorted before rendering.

---

## Data-Flow Change

Statistics must still represent **all matching products**, not only the visible Top-100.

The processing flow was therefore separated:

```text
                    ┌─→ calculate statistics over all matches
                    │
products → filtering
                    │
                    └─→ select Top-100 → render table
```

This prevented the performance optimization from changing application semantics.

---

## Top-K Profiling Result

One representative trace showed:

```text
selectTopProducts
Self Time:  9.4 ms
Total Time: 68 ms
```

The full-sort implementation previously required roughly:

```text
~475–537 ms
```

for the corresponding result selection phase.

This was an algorithmic optimization: the comparator itself did not need to become dramatically faster again; the application simply performed less unnecessary work.

---

# Optimized Benchmark

The final optimized version was measured over 20 runs.

Interaction duration:

```text
1.  364 ms
2.  299 ms
3.  283 ms
4.  312 ms
5.  281 ms
6.  281 ms
7.  292 ms
8.  277 ms
9.  271 ms
10. 284 ms
11. 283 ms
12. 277 ms
13. 279 ms
14. 278 ms
15. 328 ms
16. 272 ms
17. 290 ms
18. 259 ms
19. 363 ms
20. 387 ms
```

Summary:

| Metric |  Optimized |
| ------ | ---------: |
| Median | **283 ms** |
| Mean   |     298 ms |
| p75    |     302 ms |
| p95    |     365 ms |
| Min    |     259 ms |
| Max    |     387 ms |

---

# Results

Final 20-run comparison:

| Metric |  Initial |  Optimized |      Improvement |
| ------ | -------: | ---------: | ---------------: |
| Median | 20.815 s | **283 ms** | **73.6× faster** |
| Mean   | 20.589 s | **298 ms** |     69.1× faster |
| p75    | 21.098 s | **302 ms** |     69.8× faster |
| p95    | 21.616 s | **365 ms** |     59.2× faster |
| Min    | 19.620 s | **259 ms** |                — |
| Max    | 22.860 s | **387 ms** |                — |

Median interaction duration decreased by approximately:

```text
98.64%
```

from:

```text
20.815 s
```

to:

```text
283 ms
```

under the controlled benchmark conditions.

---

## Optimization Summary

The final result was not produced by one optimization.

It came from several profiling-driven changes:

| Problem                                               | Optimization                         |
| ----------------------------------------------------- | ------------------------------------ |
| Extremely expensive locale-aware comparator           | Reused `Intl.Collator`               |
| Repeated normalization of immutable search fields     | Precomputed normalized search values |
| Full sorting to find maximum statistics               | Linear maximum lookup                |
| Full ordering of 100k results when only 100 are shown | Bounded Top-K heap                   |

The most important pattern was:

```text
Profile
↓
Find dominant bottleneck
↓
Form hypothesis
↓
Change one variable
↓
Measure
↓
Profile again
```

Each optimization changed the performance profile and exposed a new dominant cost.

---

# Trade-offs

## `Intl.Collator`

### Benefit

Dramatically reduced comparator cost in this Chrome benchmark.

### Trade-offs

Locale-aware ordering is a product requirement, not only a performance decision.

The application must decide whether sorting rules should follow:

```text
UI locale
data locale
business-defined locale
```

Different locales can produce different ordering.

---

## Precomputed Search Values

### Benefit

Moved expensive string normalization out of repeated interactions.

### Trade-offs

The application trades runtime CPU for:

```text
additional memory
upfront preprocessing
cache/invalidation complexity
```

If a searchable product field changes, its precomputed search representation must also be updated.

---

## Linear Maximum Lookup

### Benefit

Avoided full `O(n log n)` sorting where only a maximum value was required.

### Trade-offs

Very low implementation cost.

This was primarily an algorithm-selection improvement rather than a complex optimization.

---

## Top-K Heap

### Benefit

Avoided computing the complete ordering of 100,000 products when only the first 100 were displayed.

### Trade-offs

Implementation complexity is higher than `Array.sort()`.

The optimization depends on product requirements.

It works particularly well when the application needs only a small fixed Top-K result set.

If the application later requires:

```text
arbitrary pagination
deep page navigation
complete sorted export
```

the architecture may need to change.

For a real large-scale inventory application, server-side filtering, sorting, and pagination may be more appropriate than transferring and processing the complete dataset in the browser.

---

# Benchmark Lessons

This lab also exposed several benchmarking lessons.

## Always benchmark the intended build

During one intermediate experiment, the source code had been modified but the production bundle had not been rebuilt.

This produced a false conclusion that an optimization had no effect.

The benchmark workflow was therefore reinforced as:

```text
change code
↓
production build
↓
serve production artifact
↓
verify scenario
↓
record measurement
```

---

## One run is not a benchmark

Individual measurements varied because of factors such as:

```text
browser scheduling
JIT behavior
garbage collection
profiling overhead
background system activity
```

Exploratory profiling used a small number of runs.

The final comparison used:

```text
20 initial runs
20 optimized runs
```

Median was chosen as the primary headline metric because it is less sensitive to occasional slow runs than the arithmetic mean.

---

## Do not add nested Total Times

Chrome Bottom-Up `Total Time` values can include child calls.

For example:

```text
filterProducts Total Time
```

can already contain:

```text
normalizeSearchValue
```

Adding both values would double-count execution time.

`Self Time` is useful for identifying direct CPU hotspots, while `Total Time` is useful for understanding the cost of an entire call subtree.

---

## Profiling overhead is not application work

Chrome Performance may display profiling overhead.

That work is introduced by the profiler itself and should not be interpreted as application CPU cost.

---

# Key Engineering Lessons

### 1. Source code appearance is not enough

Multiple `.filter()` passes looked suspicious.

Profiling showed that they were initially insignificant compared with the sorting comparator.

---

### 2. Optimize the dominant cost first

Improving a function responsible for 4% of execution time cannot produce the same impact as fixing one responsible for ~90%.

---

### 3. Re-profile after every major optimization

The dominant bottleneck changed several times:

```text
sorting comparator
↓
search normalization
↓
statistics
↓
full result sorting
```

Performance work is iterative.

---

### 4. Prefer doing less work over doing unnecessary work faster

Examples:

```text
full sort to find max
→ linear max lookup

full sort of 100,000
→ Top-100 selection
```

These were algorithmic improvements rather than micro-optimizations.

---

### 5. Responsiveness and computation time are different metrics

Moving the original work to a Web Worker could have kept the UI responsive, but it would not necessarily have reduced the amount of CPU work.

This lab first focused on reducing the computation itself.

A Worker remains a possible architectural option when expensive work cannot be eliminated and main-thread responsiveness must be protected.

---

### 6. Correctness is part of performance engineering

Optimized Top-K results were compared against the original:

```ts
fullSort.slice(0, 100);
```

Performance improvements must preserve required behavior.

---

### 7. Stop when the trade-off is no longer attractive

After the final changes, work was spread across several comparatively small operations instead of one dominant multi-second hotspot.

Further optimization remained possible, such as combining all statistics into one pass, but profiling no longer justified prioritizing it.

This is an important distinction:

> Code can be theoretically more efficient without being worth making more complex.

---

# Interview Story

A concise version of this lab for a Senior Frontend interview:

> I built a reproducible browser performance scenario around a 100,000-record React inventory dashboard. A filter interaction initially produced a single ~21-second main-thread task under Chrome 6× CPU throttling. I used the Performance panel, Bottom-Up view, and Call Tree to identify the dominant hotspots rather than optimizing based on source-code assumptions.
>
> The first major bottleneck was a locale-aware string comparator responsible for roughly 90% of the interaction. Reusing `Intl.Collator` reduced sorting from roughly 20 seconds to hundreds of milliseconds. After re-profiling, repeated search normalization became dominant, so I precomputed normalized representations for immutable product fields. I then replaced two full sorts used only to find maxima with linear scans, and finally replaced the full ordering of 100,000 results with a bounded Top-100 heap because the UI displayed only 100 rows.
>
> I validated correctness against the original implementation and ran a controlled 20-run production benchmark. Median interaction time decreased from 20.815 seconds to 283 milliseconds under the same 6× CPU throttling conditions — approximately a 98.6% reduction.

---

# Final Takeaway

The main outcome of this lab was not any individual optimization.

It was establishing a repeatable performance-engineering workflow:

```text
Problem
→ Measurement
→ Profiling
→ Evidence
→ Hypothesis
→ Controlled experiment
→ Optimization
→ Re-profile
→ Benchmark
→ Trade-off analysis
```

The final performance improvement was a consequence of repeatedly following that process rather than applying optimization techniques blindly.
