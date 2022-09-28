export interface IBrand {
  id: string;
  name: string;
  description: string;
  discount_value: number | string;
  discount_type: string;
  actived: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface IBrands<T> {
  brand: T;
  loading: boolean;
  error: string;
}
