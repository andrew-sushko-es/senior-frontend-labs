# Lab 01 — Main Thread / Expensive JavaScript

## Observations

## Hypothesis

Profiling showed that approximately 91% of the interaction time
was spent inside the name-sorting comparator.

The application used `String.prototype.localeCompare()` with an
explicit locale and comparison options on every comparator call.

Because sorting 100,000 items invokes the comparator a very large
number of times, repeated locale-aware comparison setup was
suspected to be the dominant cost.

The hypothesis was that creating a reusable `Intl.Collator` once
per sort operation and reusing `collator.compare()` would
significantly reduce comparator cost.

### Experiment — Reusing `Intl.Collator`

## Optimization

The original comparator:

```ts
a.name.localeCompare(b.name, "en-US", {
  sensitivity: "base",
});

const collator = new Intl.Collator("en-US", {
  sensitivity: "base",
});

collator.compare(a.name, b.name);
```

## Results

Median of three runs under 6× CPU throttling:

| Metric            |  Before |  After |
| ----------------- | ------: | -----: |
| Total interaction | 20.81 s | 1.96 s |
| Sorting           | 19.89 s | 479 ms |
| Comparator        | 18.95 s | 400 ms |
| Filtering         |  886 ms | 855 ms |

The total interaction became approximately 10.6× faster.

Sorting time decreased by approximately 97.6%, while filtering
time remained effectively unchanged.

### Optimization — Precomputed Search Values

Profiling showed that most filtering time was spent repeatedly
normalizing immutable product fields during every search.

Normalized search representations were therefore computed once
during dataset creation and reused during filtering.

Median results under 6× CPU throttling:

| Metric            | Before |  After |
| ----------------- | -----: | -----: |
| Total interaction | 1.96 s | 1.32 s |
| Filtering         | 855 ms |  73 ms |
| Sorting           | 479 ms | 507 ms |

Filtering became approximately 11× faster while sorting remained
effectively unchanged, confirming that repeated normalization was
the dominant filtering cost.

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
