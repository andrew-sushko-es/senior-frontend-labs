import type { Product } from '../../domain/product';
import { formatCurrency, formatNumber, formatRating } from '../../utils/formatters';

interface ProductRowProps {
  product: Product;
}

export function ProductRow({ product }: ProductRowProps) {
  const updatedAt = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(product.updatedAt));

  return (
    <tr>
      <td className="product-table__sku">{product.sku}</td>
      <td>
        <strong>{product.name}</strong>
      </td>
      <td>{product.brand}</td>
      <td><span className="category-tag">{product.category}</span></td>
      <td>{formatCurrency(product.price)}</td>
      <td>{formatNumber(product.stock)}</td>
      <td>{formatRating(product.rating)}</td>
      <td>{formatNumber(product.reviewCount)}</td>
      <td>{product.warehouse}</td>
      <td>{updatedAt}</td>
    </tr>
  );
}
