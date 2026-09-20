import type { Product } from '../../domain/product';
import { formatNumber } from '../../utils/formatters';
import { ProductRow } from './ProductRow';
import './ProductTable.css';

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  const visibleProducts = products.slice(0, 100);

  return (
    <section className="product-table-section" aria-labelledby="product-table-heading">
      <div className="product-table-section__heading">
        <div>
          <p className="section-heading__eyebrow">Matching inventory</p>
          <h2 id="product-table-heading">Products</h2>
        </div>
        <p>Showing first {formatNumber(visibleProducts.length)} of {formatNumber(products.length)} matching products</p>
      </div>

      <div className="product-table__scroll">
        <table className="product-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Reviews</th>
              <th>Warehouse</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {visibleProducts.map((product) => <ProductRow key={product.id} product={product} />)}
          </tbody>
        </table>
      </div>
    </section>
  );
}
