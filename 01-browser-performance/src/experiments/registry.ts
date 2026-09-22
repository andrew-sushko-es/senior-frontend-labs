import type { ComponentType } from "react";
import { CpuLongTaskExperiment } from "./01-cpu-long-task/CpuLongTaskExperiment";

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
];

export function findExperiment(id: string | null) {
  return experimentRegistry.find((experiment) => experiment.id === id);
}
