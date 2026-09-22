# Experiment 03 — Layout Thrashing

## Goal

TODO: describe the learning objective after completing the investigation.

## Scenario

Portfolio analytics dashboard with a resizable results panel and deterministic account cards.

## How to Run

From `01-browser-performance`, run `npm run dev` or build and preview the application.

## Reproduction Steps

1. Select 150 cards.
2. Start a Chrome Performance recording.
3. Drag the results-panel splitter continuously for 3–5 seconds.
4. Stop the recording and inspect the interaction.

## Recommended DevTools Setup

- Chrome Performance
- Rendering / FPS meter
- Optional 6× CPU slowdown

## Metrics to Collect

- Interaction duration
- Frame duration
- Number of frames over 16.7 ms
- Number of frames over 50 ms
- Layout total time
- Recalculate Style total time
- Longest frame
- Main-thread utilization

## Benchmark Environment

TODO: record browser version, machine details, build mode, and CPU throttling.

## Baseline Measurements

TODO: record measurements for the resize interaction.

## Performance Trace Evidence

TODO: record the resize interaction and inspect rendering activity.

## Findings

TODO: document what the trace shows.

## Hypothesis

TODO: write a hypothesis after profiling.

## Optimization

TODO: document a future optimization after the baseline investigation.

## Reference Measurements

TODO: collect reference measurements only after an optimization is implemented.

## Before / After

TODO: compare measurements only after an optimization is implemented.

## Trade-offs

TODO: document trade-offs after evaluating an optimization.

## What I Learned

TODO: summarize the completed investigation.
