# Senior Frontend Engineering Labs

A collection of hands-on frontend engineering labs focused on performance, browser internals, large-scale UI architecture, real-time systems, observability, and benchmarking.

The goal of this repository is not to build production-ready products.

The goal is to create controlled environments where frontend engineering problems can be intentionally introduced, measured, diagnosed, optimized, and documented.

Each lab follows the same engineering process:

```text
Problem
  ↓
Baseline
  ↓
Measurement
  ↓
Profiling
  ↓
Hypothesis
  ↓
Optimization
  ↓
Benchmark
  ↓
Results
  ↓
Trade-offs
```

The repository is designed as a practical study of topics expected from a Senior Frontend Engineer, with a strong emphasis on understanding **why** a solution works rather than simply applying common optimization techniques.

---

## Goals

This project is intended to develop practical experience in:

- frontend performance profiling;
- browser rendering internals;
- React rendering performance;
- Core Web Vitals;
- Chrome DevTools;
- large dataset rendering;
- virtualization;
- memory profiling;
- real-time WebSocket applications;
- backpressure and batching;
- frontend architecture;
- monorepos;
- microfrontends;
- observability;
- Real User Monitoring;
- performance budgets;
- reproducible benchmarking;
- regression detection.

A major goal is to be able to answer questions such as:

> Why is this interaction slow?

> How do we know which part of the system is responsible?

> Is the bottleneck JavaScript, React, rendering, layout, network, or memory?

> How much did the optimization actually improve performance?

> Is the benchmark reproducible?

> What trade-offs did the optimization introduce?

> How do we prevent the regression from happening again?

---

# Labs

## 01 — Browser Performance Lab

A deliberately unoptimized React application designed for practicing browser performance diagnostics.

The application contains intentionally introduced issues such as:

- large JavaScript bundles;
- poor LCP;
- layout shifts;
- long tasks;
- expensive JavaScript;
- forced synchronous layout;
- layout thrashing;
- unnecessary React renders;
- excessive DOM size;
- memory leaks;
- detached DOM nodes;
- unused JavaScript and CSS;
- heavy dependencies;
- inefficient image loading;
- font loading problems;
- network waterfalls;
- render-blocking resources.

### Topics

```text
Browser Rendering Pipeline

JavaScript
   ↓
Style Calculation
   ↓
Layout
   ↓
Paint
   ↓
Composite
```

Additional topics include:

- Event Loop;
- Tasks and Microtasks;
- requestAnimationFrame;
- Long Tasks;
- Long Animation Frames;
- Reflow vs Repaint;
- compositor thread;
- GPU-accelerated animations;
- garbage collection.

### Tools

- Chrome DevTools Performance
- Chrome DevTools Memory
- Chrome DevTools Network
- Chrome DevTools Coverage
- Lighthouse
- React DevTools Profiler
- Performance API
- PerformanceObserver

### Expected output

A full optimization case study containing:

```text
Baseline
→ profiling evidence
→ identified bottleneck
→ hypothesis
→ optimization
→ benchmark
→ before/after results
→ trade-offs
```

---

## 02 — High Performance Inventory Grid

A data-heavy inventory management interface used to explore performance limits of large React applications.

Example dataset:

```text
100,000 – 1,000,000 inventory records
```

Each record may contain:

- SKU;
- warehouse;
- location;
- quantity;
- price;
- supplier;
- status;
- last update timestamp.

Features include:

- sorting;
- filtering;
- search;
- grouping;
- editable cells;
- row selection;
- bulk operations;
- live updates;
- column resizing.

The lab starts with a deliberately naive implementation and gradually introduces more scalable approaches.

### Experiments

Different rendering strategies will be compared:

```text
Naive React Table

vs

Virtualized Table

vs

AG Grid
```

Potential dataset sizes:

```text
10k rows
50k rows
100k rows
1M backend records
```

### Topics

- React reconciliation;
- component rendering;
- unnecessary rerenders;
- React Profiler;
- component boundaries;
- memoization;
- normalized state;
- selectors;
- virtualization;
- server-side pagination;
- server-side filtering;
- server-side sorting;
- incremental updates;
- Web Workers;
- memory pressure;
- garbage collection.

### Metrics

Possible measurements include:

```text
Initial Render Time

React Commit Duration

DOM Node Count

Filter Latency

Sort Latency

Search Latency

Frame Time

Memory Usage

JS Heap Size

Interaction Latency
```

---

## 03 — Real-Time Trading Dashboard

A real-time frontend performance lab based on simulated financial market data.

The system consists of a frontend dashboard and a backend market-data simulator.

Possible frontend components include:

- Market Watch;
- Order Book;
- Trades Tape;
- Price Charts;
- Connection Status.

The server can generate increasing message rates:

```text
10 messages/sec

100 messages/sec

1,000 messages/sec

5,000+ messages/sec
```

The first implementation intentionally follows the naive approach:

```text
WebSocket Message
       ↓
setState()
       ↓
React Render
```

This architecture is then profiled under load and gradually replaced with a more scalable data pipeline.

Example:

```text
WebSocket
    ↓
Parser
    ↓
Validation
    ↓
Buffer
    ↓
Data Store
    ↓
Aggregation
    ↓
Scheduled UI Update
    ↓
React
```

### Topics

- WebSocket lifecycle;
- subscriptions;
- reconnect;
- exponential backoff;
- jitter;
- heartbeat;
- stale connections;
- sequence numbers;
- snapshot + delta;
- duplicate messages;
- missing messages;
- out-of-order messages;
- resynchronization;
- batching;
- buffering;
- throttling;
- backpressure;
- requestAnimationFrame scheduling;
- event loop pressure;
- GC pressure.

One of the central experiments is understanding the difference between:

```text
Data Update Rate
       ≠
UI Refresh Rate
```

For example:

```text
2000 market updates/sec
          ↓
state aggregation
          ↓
60 visual updates/sec
```

### Metrics

- messages/sec;
- renders/sec;
- CPU utilization;
- JS heap;
- frame duration;
- dropped frames;
- event loop lag;
- input responsiveness;
- WebSocket-to-UI latency.

---

## 04 — Frontend Architecture Lab

A practical exploration of frontend architecture and organizational scalability.

The purpose of this lab is not to demonstrate as many architectural patterns as possible.

Instead, each architecture should solve a concrete problem and introduce measurable trade-offs.

Example system:

```text
apps/
  trading/
  inventory/
  fleet/
  analytics/

packages/
  ui/
  auth/
  api-client/
  websocket/
  telemetry/
  validation/
  config/
```

### Topics

- modular frontend architecture;
- feature-based architecture;
- domain boundaries;
- shared libraries;
- package boundaries;
- dependency rules;
- API clients;
- authentication;
- shared state;
- design systems;
- monorepos;
- workspaces;
- build caching;
- affected builds;
- CI optimization;
- code ownership.

---

### Microfrontend Experiment

A separate experiment explores Microfrontends using an architecture similar to:

```text
Application Shell

├── Trading
├── Inventory
└── Analytics
```

Topics include:

- Module Federation;
- host and remote applications;
- runtime module loading;
- shared dependencies;
- singleton React;
- authentication;
- routing;
- design systems;
- shared state;
- application communication;
- independent deployment;
- version compatibility;
- error isolation;
- observability.

The goal is not to conclude that Microfrontends are inherently better.

Instead, the experiment focuses on questions such as:

> What organizational problem are Microfrontends solving?

> When is a modular monolith simpler?

> What happens when a remote application cannot be loaded?

> How should applications communicate?

> How do independently deployed applications maintain compatibility?

---

## Architecture Decision Records

Major architectural decisions are documented using ADRs.

Example:

```text
docs/adr/

001-monorepo-vs-multiple-repositories.md

002-shared-ui-library.md

003-state-ownership.md

004-microfrontend-adoption.md

005-cross-application-communication.md
```

Each ADR follows:

```text
Context

Options

Decision

Consequences

Trade-offs
```

---

# 05 — Performance Observatory

A small frontend observability and Real User Monitoring system.

The goal is to understand how frontend performance can be measured continuously rather than only during development.

Example API:

```ts
trackWebVitals();

trackRouteChange();

trackInteraction();

trackApiRequest();

trackLongTask();

trackCustomMetric();
```

### Browser APIs

The project explores:

- Performance API;
- PerformanceObserver;
- Navigation Timing;
- Resource Timing;
- User Timing;
- Long Tasks;
- Long Animation Frames;
- Web Vitals.

Example custom measurement:

```ts
performance.mark("inventory-search:start");

await searchInventory();

performance.mark("inventory-search:end");

performance.measure(
  "inventory-search",
  "inventory-search:start",
  "inventory-search:end",
);
```

Potential metrics:

```text
LCP

INP

CLS

TTFB

Route Transition Time

API Latency

Search Latency

Grid Filter Latency

Order Submission Latency

WebSocket → UI Latency
```

---

# Benchmarking

A key part of the repository is learning how to build reproducible performance benchmarks.

A single measurement is not considered sufficient evidence of an improvement.

For example:

```text
Before: 124 ms
After:   98 ms
```

does not automatically mean that performance improved by 21%.

Measurements can be affected by:

- JIT compilation;
- CPU scheduling;
- background processes;
- garbage collection;
- caching;
- browser extensions;
- network variability;
- thermal throttling.

Benchmarks therefore use controlled environments whenever possible.

---

## Benchmark Environment

Each experiment should document:

```text
Application Build
Browser Version
Hardware
Dataset Size
CPU Throttling
Network Throttling
Cache State
Warmup Runs
Measured Runs
```

Example:

```text
Production build

Chrome

4× CPU slowdown

Fast 3G network

Cold cache

3 warmup runs

20 measured runs
```

---

## Statistics

Measurements should prefer distributions rather than a single value.

Common statistics:

```text
p50
p75
p95
p99

min
max

standard deviation
```

Example:

| Metric             |   Before | After |
| ------------------ | -------: | ----: |
| Filter latency p50 |   185 ms | 42 ms |
| Filter latency p95 |   247 ms | 61 ms |
| React commit p95   |    74 ms | 14 ms |
| DOM nodes          | 100,000+ |   120 |
| JS heap            |   230 MB | 92 MB |

Actual benchmark results will be added as experiments are completed.

---

# Performance Methodology

Every performance optimization should answer four questions.

### 1. What is slow?

Identify the user-visible problem.

For example:

```text
Search freezes the interface for ~500 ms.
```

### 2. Why is it slow?

Use profiling tools to identify the bottleneck.

For example:

```text
80% of the interaction is spent filtering
100,000 records on the main thread.
```

### 3. What can be changed?

Form a hypothesis.

Example:

```text
Move filtering to a Web Worker
to remove the computation from the main thread.
```

### 4. Did it actually improve?

Run the same benchmark again.

Example:

```text
Before

p50: 480 ms
p95: 620 ms

After

p50: 74 ms
p95: 101 ms
```

Only then is the optimization considered successful.

---

# Performance Budgets

Eventually the projects will include automated performance budgets.

Possible examples:

```text
Initial JS < 350 KB gzip

LCP < 2500 ms

CLS < 0.1

TBT < 300 ms

Custom interaction p95 < 200 ms
```

CI may eventually follow:

```text
Pull Request
     ↓
Production Build
     ↓
Performance Tests
     ↓
Performance Budget
     ↓
Pass / Fail
```

Possible tools:

- Lighthouse CI;
- bundle size checks;
- Playwright;
- custom benchmark scripts.

---

# Lab vs Production Performance

An important distinction throughout this repository is:

```text
Lab Performance
       ≠
Real User Performance
```

Synthetic tests provide controlled and reproducible environments.

Real User Monitoring shows what users experience across:

- different devices;
- different networks;
- different geographic locations;
- different datasets;
- different usage patterns.

Both are useful, but they answer different questions.

---

# Repository Structure

The repository is expected to evolve roughly into:

```text
senior-frontend-engineering-labs/

├── 01-browser-performance/
│
├── 02-inventory-grid/
│
├── 03-realtime-trading/
│
├── 04-architecture/
│
├── 05-performance-observatory/
│
├── docs/
│   ├── benchmarking.md
│   ├── browser-performance.md
│   ├── devtools-guide.md
│   │
│   └── adr/
│
└── README.md
```

The exact structure may change as the experiments evolve.

---

# Engineering Principles

Several rules are intentionally followed throughout these projects.

## Measure before optimizing

Do not optimize based on assumptions.

```text
Profile first.
Optimize second.
```

---

## Understand the bottleneck

Using:

```ts
useMemo(...)
```

is not considered a performance optimization by itself.

It is only useful when profiling demonstrates that repeated computation or rendering is an actual bottleneck.

---

## Prefer user-facing metrics

Technical metrics should eventually connect to user experience.

Instead of only measuring:

```text
function execution time
```

prefer metrics such as:

```text
time until search results become interactive

click → visual response latency

WebSocket message → UI update latency
```

---

## Document trade-offs

Performance improvements often introduce complexity.

Every significant optimization should document:

```text
Benefits

Costs

Complexity

Maintenance Impact

When This Approach Should Not Be Used
```

---

## Prevent regressions

A successful optimization should eventually become a constraint.

```text
Optimize
   ↓
Measure
   ↓
Define Budget
   ↓
Automate
   ↓
Prevent Regression
```

---

# What This Repository Is Not

This repository is not intended to demonstrate:

- premature optimization;
- random use of memoization;
- artificially perfect Lighthouse scores;
- framework-specific tricks without understanding them;
- architectural complexity for its own sake;
- Microfrontends simply because they are considered "advanced".

The focus is on engineering reasoning.

---

# Expected Outcome

By completing these labs I want to be able to confidently investigate situations such as:

> Our INP suddenly became worse. How do we investigate it?

> A React screen renders slowly. Is React actually the bottleneck?

> A table must support 500,000 records. What architecture should we use?

> The backend sends 3,000 WebSocket updates per second. Should React render 3,000 times?

> Memory usage increases every time a route is opened. How do we find the leak?

> The bundle is 4 MB. Where should optimization start?

> Should this application use Microfrontends?

> How do we prove that an optimization actually improved performance?

> How can we detect performance regressions automatically?

The final goal is not simply faster applications.

It is developing a repeatable engineering process for understanding, measuring, and improving complex frontend systems.
