import { IProductSku } from './ProductSku';

export interface IProduct {
  id: string;
  name: string;
  keywords: string;
  description: string;
  description_text: string;
  visible: string;
  skus?: IProductSku[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface IProducts<T> {
  product: T;
  loading: boolean;
  error: string;
}
