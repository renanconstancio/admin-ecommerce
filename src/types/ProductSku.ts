import { IProductImage } from './ProductImage';

export interface IProductSku {
  id: string;
  product_id: string;
  sku: string;
  cost_price: number;
  sale_price: number;
  price: number;
  quantity: number;
  images?: IProductImage[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface IProductsSkus<T> {
  sku: T;
  loading: boolean;
  error: string;
}
