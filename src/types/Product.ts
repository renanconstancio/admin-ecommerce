export interface IProduct {
  id: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface IProducts<T> {
  product: T;
  loading: boolean;
  error: string;
}
