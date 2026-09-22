import { CompanyList } from "./components/CompanyList";
import { FilterBar } from "./components/FilterBar";
import { MarketplaceToolbar } from "./components/MarketplaceToolbar";
import { SearchInput } from "./components/SearchInput";
import { WatchlistSummary } from "./components/WatchlistSummary";
import { MarketplaceProvider } from "./context/MarketplaceContext";
import { useMarketplace } from "./context/useMarketplace";

function DatasetControls() {
  const { datasetSize, setDatasetSize } = useMarketplace();

  return (
    <fieldset className="marketplace-dataset">
      <legend>Dataset</legend>
      {([100, 500, 1000] as const).map((size) => (
        <label key={size}>
          <input
            checked={datasetSize === size}
            name="rendering-dataset"
            onChange={() => setDatasetSize(size)}
            type="radio"
          />{" "}
          {size} companies
        </label>
      ))}
    </fieldset>
  );
}

function MarketplacePage() {
  return (
    <div className="experiment-layout rendering-experiment">
      <section className="task-panel" aria-labelledby="rendering-task-heading">
        <p className="section-label">Task</p>
        <h2 id="rendering-task-heading">
          Inspect a marketplace interaction at scale
        </h2>
        <p>
          Explore a B2B company marketplace and use developer tools to examine
          the work triggered by common interactions.
        </p>
      </section>

      <section
        className="reproduction-panel"
        aria-labelledby="rendering-tools-heading"
      >
        <p className="section-label" id="rendering-tools-heading">
          Suggested tools
        </p>
        <ul>
          <li>React DevTools Profiler</li>
          <li>Chrome Performance</li>
        </ul>
        <p>
          Record, change Search, then inspect the rendered components. Repeat
          with Compact mode and Watchlist.
        </p>
      </section>

      <section
        className="marketplace-controls"
        aria-label="Marketplace controls"
      >
        <div className="marketplace-control-topline">
          <DatasetControls />
          <WatchlistSummary />
        </div>
        <SearchInput />
        <FilterBar />
        <MarketplaceToolbar />
      </section>

      <CompanyList />
    </div>
  );
}

export function ReactRenderingExperiment() {
  return (
    <MarketplaceProvider>
      <MarketplacePage />
    </MarketplaceProvider>
  );
}
