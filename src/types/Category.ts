export interface ICategory {
  id: string;
  category_id: string | null;
  name: string;
  keywords: string;
  description: string;
  position: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ICategories<T> {
  category: T;
  loading: boolean;
  error: string;
}
