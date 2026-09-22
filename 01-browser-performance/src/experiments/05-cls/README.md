# Experiment 05 — Cumulative Layout Shift

## Goal

Practice identifying unexpected movement during page load and connecting Layout Shift evidence to the affected interface.

## Scenario

Fleetline is an operations dashboard for a team coordinating locations, handoffs, and daily work.

## How to Run

From `01-browser-performance`, run `npm run build` and `npm run preview`. Open the Browser Performance Lab shell and select **05 — Cumulative Layout Shift**. The selection persists for the current browser session, so reload to repeat a cold-load investigation.

## Reproduction Steps

1. Open Chrome DevTools and enable Disable cache.
2. Select Fast 3G, or use the documented custom profile.
3. Start a Performance recording and reload the selected experiment.
4. Wait until the page stabilizes, then stop recording.
5. Inspect Layout Shift events and their affected regions.

## Recommended DevTools Setup

- Chrome Performance with the Layout Shifts track visible
- Rendering → Layout Shift Regions
- Lighthouse / Performance Insights

## Network Throttling Profile

Use Fast 3G. If it is unavailable, use approximately 1.6 Mbps download, 750 Kbps upload, and 150 ms latency. CPU slowdown is optional; use a desktop viewport around 1440 × 900.

## Metrics to Collect

Collect total CLS, largest individual layout shift, layout shift entry count, largest shift-cluster score, time of each shift, and affected elements. Prefer 10 cold-load runs with cache disabled; record p50, p75, and p95 for total CLS where useful.

## Benchmark Environment

Chrome production build, production application build, Disable cache enabled, Fast 3G (or the documented custom profile), and a desktop viewport around 1440 × 900.

## Baseline Measurements

TODO: capture CLS across repeated cold-load runs.

## Layout Shift Evidence

TODO: record a cold-load trace and identify each Layout Shift event.

## Affected Elements

TODO: identify affected DOM nodes for the largest shift cluster.

## Findings

TODO: document evidence gathered during the investigation.

## Hypothesis

TODO: write a hypothesis after reviewing the trace and affected elements.

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
