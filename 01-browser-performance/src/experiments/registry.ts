import type { ComponentType } from "react";
import { CpuLongTaskExperiment } from "./01-cpu-long-task/CpuLongTaskExperiment";
import { ReactRenderingExperiment } from "./02-react-rendering/ReactRenderingExperiment";
import { LayoutThrashingExperiment } from "./03-layout-thrashing/LayoutThrashingExperiment";

export type ExperimentDefinition = {
  id: string;
  number: string;
  title: string;
  description: string;
  tools: string[];
  component: ComponentType;
};

export const experimentRegistry: ExperimentDefinition[] = [
  {
    id: "01-cpu-long-task",
    number: "01",
    title: "CPU Long Task",
    description: "Investigate a blocking data-processing interaction.",
    tools: ["Chrome Performance"],
    component: CpuLongTaskExperiment,
  },
  {
    id: "02-react-rendering",
    number: "02",
    title: "React Rendering",
    description: "Investigate why small UI changes become expensive at scale.",
    tools: ["React DevTools Profiler", "Chrome Performance"],
    component: ReactRenderingExperiment,
  },
  {
    id: "03-layout-thrashing",
    number: "03",
    title: "Layout Thrashing",
    description: "Investigate why resizing a dense dashboard causes frame drops.",
    tools: ["Chrome Performance", "Rendering"],
    component: LayoutThrashingExperiment,
  },
];

export function findExperiment(id: string | null) {
  return experimentRegistry.find((experiment) => experiment.id === id);
}
