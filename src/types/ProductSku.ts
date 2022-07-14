export interface IProductSku {
  id: string;
  product_id: string;
  sku: string;
  cost_price: number;
  sale_price: number;
  price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface IProductsSkus<T> {
  product: T;
  loading: boolean;
  error: string;
}
