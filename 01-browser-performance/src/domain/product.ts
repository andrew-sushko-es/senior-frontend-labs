export type ProductCategory =
  | 'Electronics'
  | 'Home'
  | 'Sports'
  | 'Books'
  | 'Clothing'
  | 'Food'
  | 'Automotive'
  | 'Garden';

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  category: ProductCategory;
  brand: string;
  price: number;
  stock: number;
  rating: number;
  reviewCount: number;
  warehouse: string;
  updatedAt: string;
}
