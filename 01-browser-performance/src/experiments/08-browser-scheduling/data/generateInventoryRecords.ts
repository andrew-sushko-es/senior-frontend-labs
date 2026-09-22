import type { RawInventoryRecord } from "../domain/types";

const warehouses = [
  "North Hub",
  "Central Hub",
  "East Hub",
  "South Hub",
  "West Hub",
  "Returns Hub",
];
const suppliers = [
  "Aster Industrial",
  "Crestline Supply",
  "Méridian Components",
  "Northwind Materials",
  "Pioneer Wholesale",
  "Veridian Trade",
];
const productFamilies = [
  "Cold-Chain Tote",
  "Dock Sensor",
  "Ergonomic Scanner",
  "Forklift Battery",
  "Label Roll",
  "Pallet Wrap",
  "Safety Barrier",
  "Stocking Bin",
  "Warehouse Tablet",
  "Zone Beacon",
];
const tagSets = [
  ["Fast Moving", "Cycle Count", "Priority"],
  ["Fragile", "Quality Hold", "Inspected"],
  ["Seasonal", "High Value", "Replenishment"],
  ["Hazmat", "Bulk Storage", "Reviewed"],
];

function createSeededRandom(seed: number) {
  let state = seed;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function sourceIndexFor(index: number) {
  return index > 0 && index % 97 === 0 ? index - 1 : index;
}

/** Creates the same imported inventory batch for every run and dataset size. */
export function generateInventoryRecords(count: number): RawInventoryRecord[] {
  const random = createSeededRandom(0x8c4f_18a7);

  return Array.from({ length: count }, (_, index) => {
    const sourceIndex = sourceIndexFor(index);
    const warehouse = warehouses[sourceIndex % warehouses.length];
    const quantity = 18 + Math.floor(random() * 640);
    const reservedQuantity = Math.floor(random() * Math.min(quantity, 110));
    const tags = tagSets[sourceIndex % tagSets.length];
    const productName = `${productFamilies[sourceIndex % productFamilies.length]} ${String(
      Math.floor(sourceIndex / productFamilies.length) + 1,
    ).padStart(5, "0")}`;

    return {
      id: `import-${String(index + 1).padStart(6, "0")}`,
      sku: sourceIndex % 29 === 0
        ? ` wms_${String(sourceIndex % 8_000).padStart(6, "0")} `
        : `WMS-${String(sourceIndex % 8_000).padStart(6, "0")}`,
      productName:
        index % 211 === 0
          ? `  ${productName.replace(" ", "\u00a0")}  `
          : productName,
      warehouse: index % 43 === 0 ? ` ${warehouse} ` : warehouse,
      location: ` ${String.fromCharCode(65 + (sourceIndex % 8))}-${String(
        (sourceIndex % 48) + 1,
      ).padStart(2, "0")}-${String((sourceIndex % 24) + 1).padStart(2, "0")} `,
      supplier: index % 61 === 0 ? ` ${suppliers[sourceIndex % suppliers.length]} ` : suppliers[sourceIndex % suppliers.length],
      quantity: index % 419 === 0 ? -quantity : quantity,
      reservedQuantity:
        index % 271 === 0 ? quantity + 5 : reservedQuantity,
      unitPrice: index % 613 === 0 ? 0 : Number((4.5 + random() * 390).toFixed(2)),
      status: index % 37 === 0 ? " Quality Hold " : " Available ",
      updatedAt: index % 509 === 0
        ? "not-a-timestamp"
        : new Date(
            Date.UTC(
              2026,
              sourceIndex % 9,
              (sourceIndex % 27) + 1,
              sourceIndex % 23,
              sourceIndex % 59,
            ),
          ).toISOString(),
      tags: tags.map((tag, tagIndex) =>
        tagIndex === 0 && index % 31 === 0 ? ` ${tag.toUpperCase()} ` : tag,
      ),
    };
  });
}
