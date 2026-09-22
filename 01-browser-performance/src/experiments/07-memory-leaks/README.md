# Experiment 07 — Memory Leaks

## Goal

Practice using Chrome DevTools to determine why memory remains retained after a SPA-style workspace closes.

## Scenario

Fleet Monitoring lets an operator open a vehicle workspace with live telemetry, route context, activity, alerts, and handoff notes before returning to Fleet Overview.

## How to Run

From `01-browser-performance`, run `npm run build` and `npm run preview`. Select **07 — Memory Leaks** in the Browser Performance Lab shell. A full browser reload is the clean reset between profiling sessions.

## Reproduction Steps

1. Open Experiment 07.
2. Take Heap Snapshot A.
3. Open Vehicle Detail and leave it open for about 5 seconds.
4. Select **Review alert**, then close the workspace.
5. Repeat the open/close cycle 10 times.
6. Force garbage collection and take Heap Snapshot B.
7. Repeat another 10 cycles, force garbage collection, and take Heap Snapshot C.
8. Compare snapshots and inspect retaining paths.

## Recommended DevTools Setup

- Chrome Memory panel with Heap Snapshot selected
- Allocation instrumentation on timeline for a second run
- Performance Monitor with JS heap size visible

## Benchmark Environment

Use Chrome against the normal production build at a desktop viewport around 1440 × 900. Do not use a full page reload between the cycles in one snapshot comparison.

## Baseline Snapshot

TODO: take Snapshot A before opening a workspace.

## Snapshot Comparison

TODO: compare Snapshot B after 10 cycles.

TODO: compare Snapshot C after 20 cycles.

## Allocation Evidence

TODO: record allocation instrumentation while opening, interacting with, and closing a workspace.

## Detached DOM Evidence

TODO: inspect detached DOM nodes after repeated workspace cycles.

## Retaining Paths

TODO: inspect retainers for objects belonging to closed workspaces.

## Findings

TODO: document evidence gathered during the investigation.

## Hypothesis

TODO: write a hypothesis after reviewing snapshots and retaining paths.

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

## Metrics to Collect Later

- JS heap after GC
- heap delta after 10 cycles
- heap delta after 20 cycles
- retained workspace-related objects
- retained telemetry objects
- detached DOM node count
- listener or subscriber count where observable
- largest retained-size paths
