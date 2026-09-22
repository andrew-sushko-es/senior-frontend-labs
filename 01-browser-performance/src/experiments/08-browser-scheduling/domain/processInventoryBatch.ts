import type {
  InventoryBatchResult,
  InventoryPreviewRow,
  NormalizedInventoryRecord,
  RawInventoryRecord,
  StockStatus,
  ValidationIssue,
  WarehouseSummary,
} from "./types";

type WarehouseAccumulator = WarehouseSummary;

type BatchAccumulator = {
  acceptedRecords: number;
  duplicateKeys: Set<string>;
  duplicateRecords: number;
  invalidRecords: number;
  issueCounts: Map<ValidationIssue, number>;
  previewCandidates: InventoryPreviewRow[];
  warehouses: Map<string, WarehouseAccumulator>;
};

const previewStatusOrder: Record<StockStatus, number> = {
  "Out of stock": 0,
  "On hold": 1,
  Reorder: 2,
  Available: 3,
};

function normalizeDisplayText(value: string) {
  return value.normalize("NFKC").trim().replace(/\s+/gu, " ");
}

function normalizeSearchText(value: string) {
  return normalizeDisplayText(value).toLocaleLowerCase("en-US");
}

function normalizeSku(value: string) {
  return normalizeDisplayText(value)
    .toLocaleUpperCase("en-US")
    .replace(/[\s_]+/gu, "-")
    .replace(/[^A-Z0-9-]/gu, "");
}

function normalizeLocation(value: string) {
  return normalizeDisplayText(value)
    .toLocaleUpperCase("en-US")
    .replace(/\s+/gu, "");
}

export function normalizeRecord(
  record: RawInventoryRecord,
): NormalizedInventoryRecord {
  const productName = normalizeDisplayText(record.productName);
  const quantity = Number(record.quantity);
  const reservedQuantity = Number(record.reservedQuantity);
  const unitPrice = Number(record.unitPrice);
  const updatedAtTimestamp = Date.parse(record.updatedAt);
  const availableQuantity = quantity - reservedQuantity;
  const normalizedStatus = normalizeSearchText(record.status);
  const tags = [...new Set(record.tags.map(normalizeSearchText))].sort();

  return {
    id: record.id,
    sku: normalizeSku(record.sku),
    productName,
    productKey: normalizeSearchText(productName),
    warehouse: normalizeSearchText(record.warehouse),
    location: normalizeLocation(record.location),
    supplier: normalizeSearchText(record.supplier),
    quantity,
    reservedQuantity,
    availableQuantity,
    unitPrice,
    stockStatus: deriveStockStatus(availableQuantity, quantity, normalizedStatus),
    updatedAt: record.updatedAt,
    updatedAtTimestamp,
    tags,
  };
}

export function validateRecord(record: NormalizedInventoryRecord) {
  const issues: ValidationIssue[] = [];

  if (!record.sku) issues.push("Missing SKU");
  if (!record.productName) issues.push("Missing product name");
  if (!record.warehouse) issues.push("Missing warehouse");
  if (!/^[A-Z]-\d{2}-\d{2}$/u.test(record.location)) {
    issues.push("Invalid location");
  }
  if (!Number.isInteger(record.quantity) || record.quantity < 0) {
    issues.push("Invalid quantity");
  }
  if (
    !Number.isInteger(record.reservedQuantity) ||
    record.reservedQuantity < 0 ||
    record.reservedQuantity > record.quantity
  ) {
    issues.push("Invalid reserved quantity");
  }
  if (!Number.isFinite(record.unitPrice) || record.unitPrice <= 0) {
    issues.push("Invalid unit price");
  }
  if (Number.isNaN(record.updatedAtTimestamp)) {
    issues.push("Invalid update timestamp");
  }

  return issues;
}

export function deriveStockStatus(
  availableQuantity: number,
  quantity: number,
  sourceStatus: string,
): StockStatus {
  if (sourceStatus.includes("hold")) return "On hold";
  if (availableQuantity <= 0) return "Out of stock";
  if (availableQuantity <= Math.max(12, Math.ceil(quantity * 0.2))) {
    return "Reorder";
  }
  return "Available";
}

function createBatchAccumulator(): BatchAccumulator {
  return {
    acceptedRecords: 0,
    duplicateKeys: new Set(),
    duplicateRecords: 0,
    invalidRecords: 0,
    issueCounts: new Map(),
    previewCandidates: [],
    warehouses: new Map(),
  };
}

function recordValidationIssues(
  issues: ValidationIssue[],
  accumulator: BatchAccumulator,
) {
  if (issues.length === 0) return;

  accumulator.invalidRecords += 1;
  for (const issue of issues) {
    accumulator.issueCounts.set(
      issue,
      (accumulator.issueCounts.get(issue) ?? 0) + 1,
    );
  }
}

function createWarehouseSummary(warehouse: string): WarehouseAccumulator {
  return {
    warehouse,
    acceptedRecords: 0,
    availableUnits: 0,
    reservedUnits: 0,
    inventoryValue: 0,
    reorderRecords: 0,
    outOfStockRecords: 0,
  };
}

function addToWarehouseSummary(
  record: NormalizedInventoryRecord,
  accumulator: BatchAccumulator,
) {
  const summary =
    accumulator.warehouses.get(record.warehouse) ??
    createWarehouseSummary(record.warehouse);

  summary.acceptedRecords += 1;
  summary.availableUnits += record.availableQuantity;
  summary.reservedUnits += record.reservedQuantity;
  summary.inventoryValue += record.quantity * record.unitPrice;
  if (record.stockStatus === "Reorder") summary.reorderRecords += 1;
  if (record.stockStatus === "Out of stock") summary.outOfStockRecords += 1;

  accumulator.warehouses.set(record.warehouse, summary);
}

function buildPreviewRow(record: NormalizedInventoryRecord): InventoryPreviewRow {
  return {
    id: record.id,
    sku: record.sku,
    productName: record.productName,
    warehouse: record.warehouse,
    location: record.location,
    availableQuantity: record.availableQuantity,
    stockStatus: record.stockStatus,
    inventoryValue: record.quantity * record.unitPrice,
    updatedAt: record.updatedAt,
  };
}

function processRecord(record: RawInventoryRecord, accumulator: BatchAccumulator) {
  const normalizedRecord = normalizeRecord(record);
  const validationIssues = validateRecord(normalizedRecord);
  recordValidationIssues(validationIssues, accumulator);

  const duplicateKey = `${normalizedRecord.sku}:${normalizedRecord.warehouse}:${normalizedRecord.location}`;
  const isDuplicate = accumulator.duplicateKeys.has(duplicateKey);
  accumulator.duplicateKeys.add(duplicateKey);
  if (isDuplicate) accumulator.duplicateRecords += 1;

  if (validationIssues.length > 0 || isDuplicate) return;

  accumulator.acceptedRecords += 1;
  addToWarehouseSummary(normalizedRecord, accumulator);
  accumulator.previewCandidates.push(buildPreviewRow(normalizedRecord));
}

function finalizeBatch(
  recordCount: number,
  accumulator: BatchAccumulator,
): InventoryBatchResult {
  const previewRows = accumulator.previewCandidates
    .sort((left, right) => {
      const statusDifference =
        previewStatusOrder[left.stockStatus] - previewStatusOrder[right.stockStatus];
      if (statusDifference !== 0) return statusDifference;
      return right.inventoryValue - left.inventoryValue;
    })
    .slice(0, 12);

  return {
    processedRecords: recordCount,
    acceptedRecords: accumulator.acceptedRecords,
    invalidRecords: accumulator.invalidRecords,
    duplicateRecords: accumulator.duplicateRecords,
    warehouseSummaries: [...accumulator.warehouses.values()].sort((left, right) =>
      left.warehouse.localeCompare(right.warehouse),
    ),
    previewRows,
    validationIssues: [...accumulator.issueCounts.entries()]
      .map(([issue, count]) => ({ issue, count }))
      .sort((left, right) => right.count - left.count),
  };
}

export function processInventoryBatch(
  records: RawInventoryRecord[],
  onProgress: (progress: number) => void,
): InventoryBatchResult {
  const accumulator = createBatchAccumulator();
  const progressInterval = Math.max(1, Math.floor(records.length / 100));

  for (let index = 0; index < records.length; index += 1) {
    processRecord(records[index], accumulator);
    const processed = index + 1;
    if (processed % progressInterval === 0 || processed === records.length) {
      onProgress(Math.round((processed / records.length) * 100));
    }
  }

  return finalizeBatch(records.length, accumulator);
}

export function processInventoryBatchInMicrotasks(
  records: RawInventoryRecord[],
  onProgress: (progress: number) => void,
): Promise<InventoryBatchResult> {
  const accumulator = createBatchAccumulator();
  const progressInterval = Math.max(1, Math.floor(records.length / 100));
  const recordsPerMicrotask = 250;
  let nextIndex = 0;

  return new Promise((resolve, reject) => {
    const processNextMicrotask = () => {
      try {
        const endIndex = Math.min(nextIndex + recordsPerMicrotask, records.length);

        while (nextIndex < endIndex) {
          processRecord(records[nextIndex], accumulator);
          nextIndex += 1;
          if (
            nextIndex % progressInterval === 0 ||
            nextIndex === records.length
          ) {
            onProgress(Math.round((nextIndex / records.length) * 100));
          }
        }

        if (nextIndex < records.length) {
          queueMicrotask(processNextMicrotask);
          return;
        }

        resolve(finalizeBatch(records.length, accumulator));
      } catch (error) {
        reject(error);
      }
    };

    queueMicrotask(processNextMicrotask);
  });
}
