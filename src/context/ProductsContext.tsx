import React, { createContext } from 'react';
import { useProducts } from '../hooks/useProducts';

export interface Products {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  prev_page: number | null;
  next_page: number | null;
  last_page: number;
  data: ProductList[];
}

export interface ProductList {
  id: string;
  brands_id?: string;
  categories_id?: string;
  name: string;
  description: string;
  description_text: string;
  in_stock: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ProductsContextData {
  loading: boolean;
  error: string;
  products: Products;
  product: ProductList;
  fetchProducts: () => Promise<void>;
  fetchFindProduct: (id: string) => Promise<void>;
  addProduct: (post: ProductList) => Promise<void>;
  editProduct: (id: string, put: ProductList) => Promise<void>;
  delProduct: (id: string) => Promise<unknown>;
}

export const ProductsContext = createContext<ProductsContextData>(
  {} as ProductsContextData,
);

export const ProductsProvider: React.FC = ({ children }) => {
  const customersContext = useProducts();

  return (
    <ProductsContext.Provider value={customersContext}>
      {children}
    </ProductsContext.Provider>
  );
};
