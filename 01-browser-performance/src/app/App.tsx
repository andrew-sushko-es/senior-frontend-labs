import { generateProducts } from '../data/generateProducts';
import { InventoryPage } from '../pages/InventoryPage/InventoryPage';

const products = generateProducts(100_000);

export function App() {
  return <InventoryPage products={products} />;
}
