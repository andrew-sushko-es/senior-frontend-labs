import type { Product } from '../../domain/product';
import { calculateInventoryStats } from '../../utils/productProcessing';
import { formatCurrency, formatNumber, formatRating } from '../../utils/formatters';
import './InventoryStats.css';

interface InventoryStatsProps {
  products: Product[];
}

export function InventoryStats({ products }: InventoryStatsProps) {
  const stats = calculateInventoryStats(products);

  const cards = [
    ['Matching products', formatNumber(stats.matchingProducts)],
    ['Inventory value', formatCurrency(stats.totalInventoryValue)],
    ['Average rating', formatRating(stats.averageRating)],
    ['Total stock', formatNumber(stats.totalStock)],
    ['Out of stock', formatNumber(stats.outOfStockCount)],
    ['Average price', formatCurrency(stats.averagePrice)],
  ];

  return (
    <section className="inventory-stats" aria-labelledby="inventory-summary-heading">
      <div className="section-heading section-heading--compact">
        <div>
          <p className="section-heading__eyebrow">Inventory overview</p>
          <h2 id="inventory-summary-heading">Summary</h2>
        </div>
      </div>
      <div className="inventory-stats__grid">
        {cards.map(([label, value]) => (
          <article className="stat-card" key={label}>
            <p>{label}</p>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
      <div className="inventory-stats__details">
        <p><span>Low stock</span><strong>{formatNumber(stats.lowStockCount)}</strong></p>
        <p><span>Highest priced</span><strong>{stats.highestPricedProduct ? `${stats.highestPricedProduct.name} (${formatCurrency(stats.highestPricedProduct.price)})` : '—'}</strong></p>
        <p><span>Most reviewed</span><strong>{stats.mostReviewedProduct ? `${stats.mostReviewedProduct.name} (${formatNumber(stats.mostReviewedProduct.reviewCount)})` : '—'}</strong></p>
      </div>
    </section>
  );
}
