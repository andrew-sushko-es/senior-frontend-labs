# Experiment 04 — LCP & Critical Loading

## Goal

Practice investigating the critical loading path for the main above-the-fold content.

## Scenario

Northstar Ops is an operations analytics platform entry page for teams coordinating transport, facilities, and fulfillment work.

## How to Run

From `01-browser-performance`, run `npm run build` and `npm run preview`. Open the Browser Performance Lab shell and select **04 — LCP & Critical Loading**. The selection persists for the current browser session, so reload to repeat a cold-load investigation.

## Reproduction Steps

1. Open Chrome DevTools and enable Disable cache.
2. Select Fast 3G, or use the documented custom profile.
3. Reload the selected experiment.
4. Record the load in Network, Performance, or Lighthouse.
5. Identify the LCP element and inspect its request chain.

## Recommended DevTools Setup

- Chrome Network with Priority and Initiator columns visible
- Chrome Performance recording
- Lighthouse / Performance Insights

## Network Throttling Profile

Use Fast 3G. If it is unavailable, use approximately 1.6 Mbps download, 750 Kbps upload, and 150 ms latency. Use a 4× CPU slowdown where applicable.

## Metrics to Collect

Record LCP, TTFB, resource discovery delay, LCP request start, LCP resource download duration, LCP render delay, transferred image size, and the document-to-LCP-request gap. Prefer multiple runs; use 3 environment checks and 10 cold-load measurements, then record p50, p75, and p95 where useful.

## Benchmark Environment

Chrome production build, Disable cache enabled, Fast 3G (or the documented custom profile), 4× CPU slowdown, and a desktop viewport around 1440 × 900.

## Baseline Measurements

TODO: record cold-load measurements in Chrome.

## LCP Element

TODO: identify the final LCP candidate from a Performance trace or Lighthouse report.

## Network Waterfall Evidence

TODO: capture the request waterfall and identify the LCP resource initiator.

## Performance Trace Evidence

TODO: record a production-build trace and annotate the LCP phases.

## Findings

TODO: document evidence gathered during the investigation.

## Hypothesis

TODO: write a hypothesis after reviewing the trace and waterfall.

## Optimization

TODO: complete only after the baseline has been profiled and explained.

## Reference Measurements

TODO: add measurements only after a later optimization is implemented.

## Before / After

TODO: compare measurements only after a later optimization is implemented.

## Trade-offs

TODO: document trade-offs after evaluating a later optimization.

## What I Learned

TODO: summarize the completed investigation.
