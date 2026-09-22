import { useMemo, useState } from "react";
import { generateInventoryRecords } from "./data/generateInventoryRecords";
import {
  processInventoryBatch,
  processInventoryBatchInMicrotasks,
} from "./domain/processInventoryBatch";
import type {
  DatasetSize,
  InventoryBatchResult,
  ProcessingStrategy,
} from "./domain/types";

const datasetSizes: DatasetSize[] = [5_000, 20_000, 50_000];

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatWarehouseName(warehouse: string) {
  return warehouse.replace(/\b\w/gu, (letter) => letter.toUpperCase());
}

export function BrowserSchedulingExperiment() {
  const [datasetSize, setDatasetSize] = useState<DatasetSize>(20_000);
  const [strategy, setStrategy] =
    useState<ProcessingStrategy>("synchronous");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Ready");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<InventoryBatchResult | null>(null);
  const [lastDuration, setLastDuration] = useState<number | null>(null);
  const records = useMemo(
    () => generateInventoryRecords(datasetSize),
    [datasetSize],
  );

  const setDataset = (nextDatasetSize: DatasetSize) => {
    setDatasetSize(nextDatasetSize);
    setProgress(0);
    setStatus("Ready");
    setResult(null);
    setLastDuration(null);
  };

  const completeProcessing = (nextResult: InventoryBatchResult) => {
    performance.mark("inventory-processing:end");
    performance.measure(
      "inventory-processing",
      "inventory-processing:start",
      "inventory-processing:end",
    );
    const duration =
      performance.getEntriesByName("inventory-processing").at(-1)?.duration ??
      0;

    setResult(nextResult);
    setProgress(100);
    setStatus("Complete");
    setLastDuration(duration);
    setIsProcessing(false);
  };

  const failProcessing = () => {
    performance.mark("inventory-processing:end");
    performance.measure(
      "inventory-processing",
      "inventory-processing:start",
      "inventory-processing:end",
    );
    setStatus("Processing could not be completed");
    setIsProcessing(false);
  };

  const processBatch = () => {
    performance.clearMarks("inventory-processing:start");
    performance.clearMarks("inventory-processing:end");
    performance.clearMeasures("inventory-processing");
    performance.mark("inventory-processing:start");
    setStatus("Processing inventory batch");
    setProgress(0);
    setIsProcessing(true);
    setResult(null);
    setLastDuration(null);

    if (strategy === "synchronous") {
      try {
        completeProcessing(processInventoryBatch(records, setProgress));
      } catch {
        failProcessing();
      }
      return;
    }

    void processInventoryBatchInMicrotasks(records, setProgress).then(
      completeProcessing,
      failProcessing,
    );
  };

  const cancelProcessing = () => {
    setStatus(
      isProcessing
        ? "Cancellation requested"
        : "No active batch to cancel",
    );
  };

  return (
    <div className="experiment-layout browser-scheduling-experiment">
      <section className="task-panel" aria-labelledby="scheduling-task-heading">
        <p className="section-label">Warehouse inventory</p>
        <h2 id="scheduling-task-heading">Batch processing workspace</h2>
        <p>
          Prepare an imported inventory batch for upload by normalizing,
          validating, reconciling duplicates, and producing a warehouse review
          preview.
        </p>
      </section>

      <section
        className="reproduction-panel scheduling-reproduction-panel"
        aria-labelledby="scheduling-reproduction-heading"
      >
        <p className="section-label" id="scheduling-reproduction-heading">
          Suggested tool
        </p>
        <p>Chrome Performance</p>
        <ol>
          <li>Select 20,000 records.</li>
          <li>Start a Performance recording.</li>
          <li>Click Process Inventory Batch.</li>
          <li>While processing, click Cancel.</li>
          <li>Stop recording after the workspace becomes responsive.</li>
          <li>Inspect the main thread and rendering opportunities.</li>
          <li>Repeat with Microtask chain.</li>
        </ol>
      </section>

      <section className="controls-panel" aria-labelledby="scheduling-controls-heading">
        <p className="section-label" id="scheduling-controls-heading">
          Batch controls
        </p>
        <div className="control-groups">
          <fieldset>
            <legend>Dataset</legend>
            {datasetSizes.map((size) => (
              <label key={size}>
                <input
                  checked={datasetSize === size}
                  name="inventory-dataset"
                  onChange={() => setDataset(size)}
                  type="radio"
                />{" "}
                {formatNumber(size)} records
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Processing strategy</legend>
            <label>
              <input
                checked={strategy === "synchronous"}
                name="inventory-processing-strategy"
                onChange={() => setStrategy("synchronous")}
                type="radio"
              />{" "}
              Single synchronous task
            </label>
            <label>
              <input
                checked={strategy === "microtask-chain"}
                name="inventory-processing-strategy"
                onChange={() => setStrategy("microtask-chain")}
                type="radio"
              />{" "}
              Microtask chain
            </label>
          </fieldset>
        </div>
        <div className="actions">
          <button className="primary-button" onClick={processBatch} type="button">
            Process Inventory Batch
          </button>
          <button className="secondary-button" onClick={cancelProcessing} type="button">
            Cancel
          </button>
        </div>
      </section>

      <section
        aria-busy={isProcessing}
        className="results-panel inventory-results-panel"
        aria-labelledby="inventory-results-heading"
      >
        <div className="results-heading">
          <div>
            <p className="section-label">Upload preparation</p>
            <h2 id="inventory-results-heading">Batch status</h2>
          </div>
          {lastDuration !== null && (
            <p className="diagnostic">
              Last processing duration: {lastDuration.toFixed(1)} ms
            </p>
          )}
        </div>

        <div className="inventory-progress-status">
          <div>
            <div className="inventory-progress-label">
              <span>Progress: {progress}%</span>
              <span>{formatNumber(records.length)} imported records</span>
            </div>
            <div
              aria-label={`Processing progress: ${progress}%`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={progress}
              className="inventory-progress-track"
              role="progressbar"
            >
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
          <p className="inventory-status" role="status">
            Status: {status}
          </p>
        </div>

        {result ? (
          <div className="inventory-summary">
            <div className="inventory-summary-grid">
              <div>
                <span>Accepted</span>
                <strong>{formatNumber(result.acceptedRecords)}</strong>
              </div>
              <div>
                <span>Validation exceptions</span>
                <strong>{formatNumber(result.invalidRecords)}</strong>
              </div>
              <div>
                <span>Duplicates flagged</span>
                <strong>{formatNumber(result.duplicateRecords)}</strong>
              </div>
              <div>
                <span>Warehouses</span>
                <strong>{formatNumber(result.warehouseSummaries.length)}</strong>
              </div>
            </div>

            <div className="inventory-review-grid">
              <div>
                <h3>Warehouse totals</h3>
                <div className="inventory-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Warehouse</th>
                        <th>Accepted</th>
                        <th>Available units</th>
                        <th>Inventory value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.warehouseSummaries.map((summary) => (
                        <tr key={summary.warehouse}>
                          <td>{formatWarehouseName(summary.warehouse)}</td>
                          <td>{formatNumber(summary.acceptedRecords)}</td>
                          <td>{formatNumber(summary.availableUnits)}</td>
                          <td>{formatCurrency(summary.inventoryValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="inventory-issues">
                <h3>Validation review</h3>
                <ul>
                  {result.validationIssues.map(({ issue, count }) => (
                    <li key={issue}>
                      <span>{issue}</span>
                      <strong>{formatNumber(count)}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="inventory-preview">
              <h3>Upload preview</h3>
              <div className="inventory-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Product</th>
                      <th>Warehouse</th>
                      <th>Available</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.previewRows.map((row) => (
                      <tr key={row.id}>
                        <td>{row.sku}</td>
                        <td>{row.productName}</td>
                        <td>{formatWarehouseName(row.warehouse)}</td>
                        <td>{formatNumber(row.availableQuantity)}</td>
                        <td>
                          <span className={`inventory-stock-status ${row.stockStatus.toLowerCase().replace(/\s+/gu, "-")}`}>
                            {row.stockStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <p className="inventory-empty-state">
            Process the imported batch to review validation and warehouse totals.
          </p>
        )}
      </section>
    </div>
  );
}
