import type { ComponentType } from "react";

type ExperimentModule = { default: ComponentType };

export type ExperimentDefinition = {
  id: string;
  number: string;
  title: string;
  description: string;
  tools: string[];
  load: () => Promise<ExperimentModule>;
};

export const experimentRegistry: ExperimentDefinition[] = [
  {
    id: "01-cpu-long-task",
    number: "01",
    title: "CPU Long Task",
    description: "Investigate a blocking data-processing interaction.",
    tools: ["Chrome Performance"],
    load: () =>
      import("./01-cpu-long-task/CpuLongTaskExperiment").then(
        ({ CpuLongTaskExperiment }) => ({ default: CpuLongTaskExperiment }),
      ),
  },
  {
    id: "02-react-rendering",
    number: "02",
    title: "React Rendering",
    description: "Investigate why small UI changes become expensive at scale.",
    tools: ["React DevTools Profiler", "Chrome Performance"],
    load: () =>
      import("./02-react-rendering/ReactRenderingExperiment").then(
        ({ ReactRenderingExperiment }) => ({
          default: ReactRenderingExperiment,
        }),
      ),
  },
  {
    id: "03-layout-thrashing",
    number: "03",
    title: "Layout Thrashing",
    description:
      "Investigate why resizing a dense dashboard causes frame drops.",
    tools: ["Chrome Performance", "Rendering"],
    load: () =>
      import("./03-layout-thrashing/LayoutThrashingExperiment").then(
        ({ LayoutThrashingExperiment }) => ({
          default: LayoutThrashingExperiment,
        }),
      ),
  },
  {
    id: "04-lcp-critical-loading",
    number: "04",
    title: "LCP & Critical Loading",
    description:
      "Investigate why the primary above-the-fold content appears too late.",
    tools: ["Network", "Performance", "Lighthouse"],
    load: () =>
      import("./04-lcp-critical-loading/LcpCriticalLoadingExperiment").then(
        ({ LcpCriticalLoadingExperiment }) => ({
          default: LcpCriticalLoadingExperiment,
        }),
      ),
  },
  {
    id: "05-cls",
    number: "05",
    title: "Cumulative Layout Shift",
    description:
      "Investigate why visible content moves unexpectedly during page load.",
    tools: ["Performance", "Rendering", "Lighthouse"],
    load: () =>
      import("./05-cls/CumulativeLayoutShiftExperiment").then(
        ({ CumulativeLayoutShiftExperiment }) => ({
          default: CumulativeLayoutShiftExperiment,
        }),
      ),
  },
  {
    id: "06-bundle-network",
    number: "06",
    title: "Bundle & Network",
    description:
      "Investigate why the application downloads so much JavaScript before optional features are used.",
    tools: ["Network", "Coverage", "Performance", "Bundle Analyzer"],
    load: () =>
      import("./06-bundle-network/BundleNetworkExperiment").then(
        ({ BundleNetworkExperiment }) => ({
          default: BundleNetworkExperiment,
        }),
      ),
  },
];

export function findExperiment(id: string | null) {
  return experimentRegistry.find((experiment) => experiment.id === id);
}
