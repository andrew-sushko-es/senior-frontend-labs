# Experiment 02 — React Rendering

## Goal

Practice using React DevTools Profiler and Chrome Performance to investigate a marketplace interaction.

## Scenario

A B2B company marketplace supports searching, filtering, comparison, a compact display preference, and a watchlist over a deterministic company fixture.

## How to Run

From `01-browser-performance`, install dependencies and run `npm run dev`. Open the Browser Performance Lab shell and select **02 — React Rendering**.

## Reproduction Steps

1. Select 500 companies (the default) or 1000 companies.
2. Start a React DevTools Profiler recording.
3. Enter `biopharma` in Search, then stop the recording.
4. Repeat the recording after changing Compact mode.
5. Repeat the recording after adding one company to the Watchlist.

## Recommended DevTools Setup

TODO: record Search, Watchlist, and Compact mode interactions in React Profiler. React DevTools Highlight updates is also useful while exploring the screen.

## Metrics to Collect

TODO: record commit duration, number of commits, components rendered per interaction, CompanyCard render count, CompanyStats render count, interaction duration, and main-thread render work.

## Benchmark Environment

TODO: record browser version, production-build status, CPU throttling level, dataset size, and machine details.

## Baseline Measurements

TODO: record baseline measurements after profiling on the target machine.

## React Profiler Evidence

TODO: attach or describe traces for Search, Watchlist, and Compact mode.

## Chrome Performance Evidence

TODO: attach or describe browser main-thread evidence for the same interactions.

## Findings

TODO: document the evidence gathered during investigation.

## Hypothesis

TODO: write a hypothesis after reviewing the profiling evidence.

## Optimization

TODO: complete only after the baseline has been profiled and explained.

## Reference Measurements

TODO: add measurements after an optimization is implemented in a later phase.

## Before / After

TODO: add a comparison after a later optimization phase.

## Trade-offs

TODO: document trade-offs after a later optimization phase.

## What I Learned

TODO: complete after the investigation.
