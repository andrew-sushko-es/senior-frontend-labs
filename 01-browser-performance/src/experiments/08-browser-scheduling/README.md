# Experiment 08 — Browser Scheduling

## Goal

Practice investigating how a useful main-thread inventory preparation workflow affects input handling and rendering opportunities.

## Scenario

A warehouse operator prepares a deterministic imported inventory batch for upload. The workspace normalizes records, validates the import, flags duplicates, groups inventory by warehouse, calculates totals, and creates a review preview.

## How to Run

From `01-browser-performance`, run `npm run build` and `npm run preview`. Select **08 — Browser Scheduling** in the Browser Performance Lab shell. The selected experiment is retained for the browser session.

## Reproduction Steps

1. Select 20,000 records and Single synchronous task.
2. In Chrome Performance, set CPU throttling to 4× or 6× and begin a recording.
3. Click Process Inventory Batch, then click Cancel while the batch is being processed.
4. Stop recording after the workspace becomes responsive.
5. Inspect the main thread, task boundaries, frames, and event timing.
6. Repeat the recording with Microtask chain.

## Recommended DevTools Setup

- Chrome Performance
- Main thread and Frames tracks
- Event Log, Bottom-Up, and Call Tree
- Long Tasks and Long Animation Frames where supported

## Benchmark Environment

Chrome production build, desktop viewport around 1440 × 900, and 4× or 6× CPU throttling. Use 20,000 records for the standard case and 50,000 records for a stronger trace.

## Metrics to Collect

- Processing duration from the displayed timing and Performance measure
- Longest main-thread task
- Rendering opportunity gap
- Long Task and Long Animation Frame evidence where available
- Delay between the Cancel interaction and its event handling

## Baseline Measurements

TODO: record baseline measurements in Chrome on the target machine.

## Performance Trace Evidence

TODO: capture a production trace for each available strategy.

## Findings

TODO: document evidence after inspecting the traces.

## Hypothesis

TODO: write a scheduling hypothesis after reviewing the evidence.
