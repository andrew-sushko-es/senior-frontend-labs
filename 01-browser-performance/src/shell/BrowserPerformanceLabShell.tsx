import { useEffect, useState, type ComponentType } from "react";
import { experimentRegistry, findExperiment } from "../experiments/registry";

const selectedTaskKey =
  "senior-frontend-labs:browser-performance:selected-task";

function readStoredExperimentId() {
  const storedId = sessionStorage.getItem(selectedTaskKey);
  if (storedId && !findExperiment(storedId)) {
    sessionStorage.removeItem(selectedTaskKey);
    return null;
  }
  return storedId;
}

export function BrowserPerformanceLabShell() {
  const [selectedId, setSelectedId] = useState(readStoredExperimentId);
  const selectedExperiment = findExperiment(selectedId);
  const [LoadedExperiment, setLoadedExperiment] =
    useState<ComponentType | null>(null);

  useEffect(() => {
    let isCurrent = true;

    if (!selectedExperiment) {
      setLoadedExperiment(null);
      return () => {
        isCurrent = false;
      };
    }

    setLoadedExperiment(null);
    selectedExperiment.load().then(({ default: Experiment }) => {
      if (isCurrent) {
        setLoadedExperiment(() => Experiment);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [selectedExperiment]);

  const selectExperiment = (id: string) => {
    sessionStorage.setItem(selectedTaskKey, id);
    setSelectedId(id);
  };

  const chooseAnotherExperiment = () => {
    sessionStorage.removeItem(selectedTaskKey);
    setSelectedId(null);
  };

  if (!selectedExperiment) {
    return (
      <main className="shell shell-menu">
        <p className="eyebrow">Browser Performance Lab</p>
        <h1>Choose an experiment</h1>
        <div className="experiment-grid">
          {experimentRegistry.map((experiment) => (
            <button
              className="experiment-card"
              key={experiment.id}
              onClick={() => selectExperiment(experiment.id)}
              type="button"
            >
              <span className="card-number">{experiment.number}</span>
              <span className="card-title">{experiment.title}</span>
              <span className="card-description">{experiment.description}</span>
              <span className="card-tools">
                Tools: {experiment.tools.join(", ")}
              </span>
            </button>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="shell">
      <header className="shell-header">
        <div>
          <p className="eyebrow">Browser Performance Lab</p>
          <h1>
            {selectedExperiment.number} — {selectedExperiment.title}
          </h1>
        </div>
        <button
          className="secondary-button"
          onClick={chooseAnotherExperiment}
          type="button"
        >
          Choose another experiment
        </button>
      </header>
      {LoadedExperiment ? (
        <LoadedExperiment />
      ) : (
        <p className="experiment-loading" role="status">
          Loading experiment…
        </p>
      )}
    </main>
  );
}
