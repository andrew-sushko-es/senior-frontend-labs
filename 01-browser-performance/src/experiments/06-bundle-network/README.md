# Experiment 06 — Bundle & Network

## Goal

Investigate the JavaScript requested before the initial Operations Reporting Console dashboard is used.

## Scenario

The dashboard provides report filters, summary metrics, and a recent-report table. Product tools can export a spreadsheet, preview a document, edit a report template, and show advanced analytics.

## How to Run

Run the production build and preview it locally before recording measurements.

## Reproduction Steps

1. Select Experiment 06 in the Browser Performance Lab Shell.
2. Reload once so the session selection opens Experiment 06 directly.
3. Keep every optional product tool closed.
4. Disable cache, then perform a cold reload.

## Production Build

```sh
npm run build
npm run preview
```

## Bundle Analyzer

```sh
npm run analyze
```

The report is written to `dist/bundle-analysis.html`.

## Recommended DevTools Setup

Use Network with a JavaScript filter, Coverage, and a reload Performance trace. Inspect the production bundle report alongside these tools.

## Network Throttling Profile

Use Disable cache, Fast 3G (or an equivalent profile), and 4× CPU slowdown when comparing cold loads.

## Metrics to Collect

- Initial JavaScript transferred and resource size.
- Gzip and brotli sizes from the production build output.
- Number of initial JavaScript chunks.
- Unused JavaScript bytes and percentage before opening a product tool.
- JavaScript parse, compile, and execution time.
- Time until the initial dashboard is interactive.
- Largest dependency/module sizes.
- Optional tools left unopened during the measurement.

## Benchmark Environment

TODO: record browser version, device profile, network profile, CPU slowdown, and cache state.

## Baseline Measurements

TODO: record total JavaScript transferred during a cold Experiment 06 load.

## Network Evidence

TODO: capture the JavaScript requests and timings from a cache-disabled cold reload.

## Coverage Evidence

TODO: capture Coverage before opening optional product tools.

## Bundle Composition Evidence

TODO: identify the largest modules in the production bundle report.

## Performance Trace Evidence

TODO: capture parse, compile, and evaluation work from a reload trace.

## Findings

TODO: record investigation findings.

## Hypothesis

TODO: record the hypothesis formed from the evidence.

## Optimization

TODO: record a future optimization plan after the investigation.

## Reference Measurements

TODO: record future reference measurements.

## Before / After

TODO: record future before-and-after results.

## Trade-offs

TODO: record future trade-offs.

## What I Learned

TODO: record learning notes after the investigation.
