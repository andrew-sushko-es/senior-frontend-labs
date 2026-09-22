# Browser Performance Lab

A hands-on frontend performance lab for learning how to diagnose browser and React performance problems using real profiling tools.

The goal of this lab is not to apply optimization techniques from a checklist.

The goal is to practice a repeatable engineering process:

```text
Reproduce
   ↓
Measure
   ↓
Profile
   ↓
Identify the bottleneck
   ↓
Form a hypothesis
   ↓
Optimize
   ↓
Benchmark again
   ↓
Document trade-offs
```

Each experiment contains an intentionally problematic **baseline implementation**.

The task is to investigate the problem with browser tooling before changing the code.

---

# Goals

This lab focuses on practical experience with:

- Chrome DevTools Performance;
- React DevTools Profiler;
- main-thread CPU bottlenecks;
- Long Tasks;
- Long Animation Frames;
- React rendering performance;
- browser layout and rendering;
- forced synchronous layout;
- Largest Contentful Paint;
- Cumulative Layout Shift;
- network waterfalls;
- JavaScript bundle analysis;
- unused JavaScript;
- memory profiling;
- detached DOM nodes;
- retaining paths;
- event loop behavior;
- task and microtask scheduling;
- reproducible performance benchmarking.

The main questions throughout the lab are:

> What exactly is slow?

> Is the bottleneck JavaScript, React, layout, loading, memory, or scheduling?

> What evidence supports that conclusion?

> How can the same problem be reproduced consistently?

> Did the optimization actually improve the user-visible behavior?

---

# Lab Shell

All experiments are accessed through a shared Browser Performance Lab shell.

On first launch, choose an experiment from the menu.

The selected experiment is stored in:

```text
sessionStorage
```

using:

```text
senior-frontend-labs:browser-performance:selected-task
```

Refreshing the page reopens the selected experiment.

Use:

```text
Choose another experiment
```

to clear the current selection and return to the lab menu.

The shell is intentionally lightweight so it does not materially affect profiling results.

---

# Experiments

## 01 — CPU Long Task

Investigate a data-processing interaction that blocks the main thread.

The experiment contains a realistic B2B company search workflow with search, filtering, sorting, lookup data, nested taxonomies, text normalization, and result rendering.

The objective is to learn how to find expensive synchronous JavaScript using:

```text
Performance
→ Main Thread
→ Long Task
→ Bottom-Up
→ Call Tree
→ Flame Chart
```

### Suggested tools

- Chrome DevTools Performance
- Bottom-Up
- Call Tree
- Flame Chart

### Metrics

- interaction duration;
- longest task;
- main-thread CPU time;
- p50 / p75 / p95 across repeated runs.

---

## 02 — React Rendering

Investigate why relatively small UI changes trigger large amounts of React work.

The scenario uses a company marketplace with search, filters, company cards, statistics, watchlist, compare selection, and unrelated toolbar state.

The goal is to answer:

```text
Which components rendered?
Why did they render?
How expensive was the commit?
Which renders were actually necessary?
```

### Suggested tools

- React DevTools Profiler
- Chrome DevTools Performance
- Highlight updates

### Recommended build

Use a React profiling build when collecting React Profiler measurements.

Use the normal production build for browser-level Performance measurements.

### Metrics

- commit duration;
- number of commits;
- components rendered per interaction;
- CompanyCard render count;
- CompanyStats render count;
- total interaction duration.

---

## 03 — Layout Thrashing

Investigate why resizing a dense dashboard causes frame drops.

The scenario contains a resizable analytics panel with adaptive cards.

The developer should investigate:

- Style Recalculation;
- Layout;
- frame duration;
- browser rendering work;
- JavaScript-triggered synchronous layout.

### Suggested tools

- Chrome DevTools Performance
- Rendering panel
- FPS meter
- Bottom-Up
- Call Tree

### Metrics

- interaction duration;
- Layout total time;
- Recalculate Style total time;
- number of frames above 16.7 ms;
- number of frames above 50 ms;
- longest frame.

---

## 04 — LCP & Critical Loading

Investigate why the primary above-the-fold content appears too late.

The experiment uses a realistic application landing page and a local hero/dashboard preview asset.

The objective is to study the critical loading path:

```text
document
→ application startup
→ resource discovery
→ request
→ download
→ render
→ LCP
```

### Suggested tools

- Chrome DevTools Network
- Chrome DevTools Performance
- Lighthouse
- Performance Insights

### Metrics

- LCP;
- TTFB;
- LCP resource discovery delay;
- resource request start;
- resource download duration;
- render delay;
- transferred asset size.

---

## 05 — Cumulative Layout Shift

Investigate why visible content moves unexpectedly during page load.

The experiment contains several realistic sources of layout instability that occur during a cold load.

The goal is to identify individual Layout Shift events and connect them to affected DOM elements.

### Suggested tools

- Chrome DevTools Performance
- Layout Shift track
- Rendering → Layout Shift Regions
- Lighthouse
- PerformanceObserver

### Metrics

- total CLS;
- largest individual layout shift;
- number of layout shift entries;
- largest shift cluster;
- time of each shift;
- affected elements.

---

## 06 — Bundle & Network

Investigate why an application downloads large amounts of JavaScript before optional functionality is used.

The experiment contains a lightweight dashboard plus optional product features such as spreadsheet export, document preview, report template editing, and advanced analytics.

The goal is to analyze what enters the initial JavaScript graph and how much of it is unused during startup.

### Suggested tools

- Chrome DevTools Network
- Coverage
- Chrome DevTools Performance
- Bundle Analyzer
- Lighthouse

### Metrics

- initial JavaScript transferred;
- production bundle size;
- compressed size;
- number of initial chunks;
- unused JavaScript bytes / percentage;
- JavaScript parse/compile time;
- JavaScript execution time.

---

## 07 — Memory Leaks

Investigate why memory continues to grow after repeatedly opening and closing an SPA workspace.

The scenario uses a fleet monitoring application with a Vehicle Detail workspace.

The objective is to learn how to prove that objects remain reachable after the feature has unmounted.

### Suggested tools

- Chrome DevTools Memory
- Heap Snapshot
- Allocation instrumentation
- Performance Monitor

### Investigation workflow

```text
Snapshot A
→ open / close workspace repeatedly
→ force GC
→ Snapshot B
→ compare
→ inspect retainers
```

### Metrics

- JS heap after GC;
- heap delta after repeated cycles;
- retained workspace objects;
- retained telemetry objects;
- detached DOM nodes;
- retained-size paths.

---

## 08 — Browser Scheduling

Investigate why legitimate CPU work temporarily makes the entire interface unresponsive.

The experiment contains a bulk inventory-processing workflow.

The application performs realistic work such as normalization, validation, duplicate detection, grouping, aggregation, and preview generation.

The important distinction is:

```text
Total computation time
        ≠
UI responsiveness during computation
```

The experiment also includes a microtask-based baseline for studying why a long microtask chain may still starve rendering.

### Suggested tools

- Chrome DevTools Performance
- Main Thread
- Frames
- Long Tasks
- Long Animation Frames
- Event Log

### Metrics

- total processing duration;
- longest task;
- number of Long Tasks;
- Long Animation Frame duration;
- time to first visible feedback;
- input delay;
- frame duration;
- rendering opportunities during processing.

---

# How to Run

Use the repository's package manager.

Typical workflow:

```bash
npm install
npm run dev
```

or:

```bash
pnpm install
pnpm dev
```

Check `package.json` for the exact commands.

For performance measurements, prefer the production build:

```bash
npm run build
npm run preview
```

or the equivalent package-manager commands.

Development mode is useful for implementation and debugging, but production-like measurements should not rely on the development server.

---

# Recommended Profiling Environment

Document the environment for every benchmark.

Example:

```text
Build: Production
Browser: Chrome
Viewport: 1440 × 900
CPU throttling: 4× / 6× where specified
Network: Fast 3G where specified
Cache: Disabled for cold-load experiments
Warmup runs: 3
Measured runs: 10–20
```

Exact settings depend on the experiment.

Do not compare numbers collected under different conditions without documenting the difference.

---

# Development vs Production vs Profiling Build

Different experiments require different build modes.

## Development build

Useful for:

- debugging;
- warnings;
- implementation work;
- quick React inspection.

Not authoritative for performance numbers.

## Production build

Preferred for:

- Chrome Performance;
- Network;
- Memory;
- Lighthouse;
- bundle analysis;
- LCP;
- CLS;
- scheduling;
- layout profiling.

## React profiling build

Use when collecting detailed React Profiler measurements for Experiment 02.

This gives React profiling instrumentation while staying closer to production behavior than a normal development build.

---

# Benchmark Methodology

A single before/after measurement is not considered sufficient evidence.

Avoid conclusions such as:

```text
Before: 120 ms
After:   90 ms

Therefore: 25% faster
```

based on one run.

Performance varies because of:

- JIT compilation;
- garbage collection;
- CPU scheduling;
- background applications;
- caching;
- browser extensions;
- thermal throttling;
- network variability.

Prefer repeated measurements.

Example:

```text
Warmup runs:   3
Measured runs: 20
```

Record distributions where appropriate:

```text
p50
p75
p95
min
max
standard deviation
```

---

# Benchmark Environment Template

Use this template in experiment notes:

```text
OS:
Hardware:
Browser:
Browser version:
Build:
Viewport:
Dataset:
CPU throttling:
Network throttling:
Cache:
Warmup runs:
Measured runs:
```

---

# Performance Investigation Process

For every experiment, follow the same process.

## 1. Reproduce

Confirm that the problem is visible and deterministic.

## 2. Measure

Record an initial baseline.

## 3. Profile

Use the appropriate browser tooling.

## 4. Identify the bottleneck

Do not assume the cause from the symptom.

## 5. Form a hypothesis

Explain why the observed behavior is happening.

## 6. Optimize

Only after the hypothesis is supported by profiling evidence.

## 7. Benchmark again

Repeat the same workload in the same environment.

## 8. Document trade-offs

Every optimization should explain:

```text
Benefit
Cost
Complexity
Maintenance impact
When the approach should not be used
```

---

# Experiment Documentation

Each experiment maintains its own README / case-study document.

Suggested structure:

```text
# Experiment

## Goal
## Scenario
## How to Run
## Reproduction Steps
## Recommended DevTools Setup
## Benchmark Environment
## Baseline Measurements
## Profiling Evidence
## Findings
## Hypothesis
## Optimization
## Reference Measurements
## Before / After
## Trade-offs
## What I Learned
```

Baseline implementations intentionally do not include the final answer.

Profiling results and optimizations should be filled in as the experiment is completed.

---

# Repository Structure

The lab is expected to evolve roughly as:

```text
01-browser-performance/
├── src/
│   ├── lab/
│   │   ├── LabShell.tsx
│   │   ├── ExperimentMenu.tsx
│   │   ├── ExperimentHeader.tsx
│   │   └── experiments.ts
│   │
│   └── experiments/
│       ├── 01-cpu-long-task/
│       ├── 02-react-rendering/
│       ├── 03-layout-thrashing/
│       ├── 04-lcp-critical-loading/
│       ├── 05-cls/
│       ├── 06-bundle-network/
│       ├── 07-memory-leaks/
│       └── 08-browser-scheduling/
│
├── public/
│   └── experiments/
│
├── docs/
│
└── README.md
```

The exact structure may differ slightly depending on the implementation.

---

# What This Lab Is Not

This lab is not intended to demonstrate:

- arbitrary CPU-burning loops;
- artificial `sleep()` delays;
- giant fake JavaScript files;
- random use of `useMemo`;
- optimization before measurement;
- perfect Lighthouse scores for their own sake;
- performance tricks without understanding the browser behavior;
- benchmark numbers invented without measurements.

Every problem should come from a realistic frontend architecture or lifecycle mistake.

---

# Definition of Done

An experiment is not considered complete when the optimized code merely "feels faster".

It should have:

```text
✓ reproducible baseline
✓ documented benchmark environment
✓ profiling evidence
✓ identified root cause
✓ explicit hypothesis
✓ optimized implementation
✓ repeated benchmark
✓ before / after results
✓ explanation of why the change worked
✓ documented trade-offs
```

The final goal is not simply to produce faster code.

The goal is to develop a repeatable process for diagnosing complex frontend performance problems with evidence.
