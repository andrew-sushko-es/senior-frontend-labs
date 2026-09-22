export type DatasetSize = 5_000 | 20_000 | 50_000;

export type ProcessingStrategy = "synchronous" | "microtask-chain";

export type RawInventoryRecord = {
  id: string;
  sku: string;
  productName: string;
  warehouse: string;
  location: string;
  supplier: string;
  quantity: number;
  reservedQuantity: number;
  unitPrice: number;
  status: string;
  updatedAt: string;
  tags: string[];
};

export type StockStatus = "Available" | "Reorder" | "Out of stock" | "On hold";

export type ValidationIssue =
  | "Missing SKU"
  | "Missing product name"
  | "Missing warehouse"
  | "Invalid location"
  | "Invalid quantity"
  | "Invalid reserved quantity"
  | "Invalid unit price"
  | "Invalid update timestamp";

export type NormalizedInventoryRecord = {
  id: string;
  sku: string;
  productName: string;
  productKey: string;
  warehouse: string;
  location: string;
  supplier: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  unitPrice: number;
  stockStatus: StockStatus;
  updatedAt: string;
  updatedAtTimestamp: number;
  tags: string[];
};

export type WarehouseSummary = {
  warehouse: string;
  acceptedRecords: number;
  availableUnits: number;
  reservedUnits: number;
  inventoryValue: number;
  reorderRecords: number;
  outOfStockRecords: number;
};

export type InventoryPreviewRow = {
  id: string;
  sku: string;
  productName: string;
  warehouse: string;
  location: string;
  availableQuantity: number;
  stockStatus: StockStatus;
  inventoryValue: number;
  updatedAt: string;
};

export type InventoryBatchResult = {
  processedRecords: number;
  acceptedRecords: number;
  invalidRecords: number;
  duplicateRecords: number;
  warehouseSummaries: WarehouseSummary[];
  previewRows: InventoryPreviewRow[];
  validationIssues: Array<{ issue: ValidationIssue; count: number }>;
};
