import React, { createContext, useCallback, useState } from 'react';
import api from '../api/api';

export interface IProducts {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  prev_page: number | null;
  next_page: number | null;
  last_page: number;
  data: IProductItems[];
}

export interface IProductItems {
  id?: string;
  brands_id: string;
  categories_id: string;
  name: string;
  description: string;
  description_text: string;
  in_stock: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface IProductsContextData {
  loading: boolean;
  product: IProductItems;
  products: IProducts;
  fetchProducts: () => Promise<void>;
  findProducts: (id: string) => Promise<void>;
  addProduct: (post: IProductItems) => Promise<void>;
  editProduct: (id: string, put: IProductItems) => Promise<void>;
  delProduct: (id: string) => Promise<unknown>;
}

export const ProductsContext = createContext<IProductsContextData>(
  {} as IProductsContextData,
);

export const ProductsProvider: React.FC = ({ children }) => {
  const [product, setProduct] = useState<IProductItems>({} as IProductItems);
  const [products, setProducts] = useState<IProducts>({} as IProducts);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async (): Promise<void> => {
    await api
      .get(`/products`)
      .then(async res => setProducts(await res.data))
      .finally(() => setLoading(false));
  }, [setProducts, setLoading]);

  const findProducts = useCallback(
    async (idProduct: string): Promise<void> => {
      await api
        .get(`/products/${idProduct}`)
        .then(async res => setProduct(await res.data))
        .finally(() => setLoading(false));
    },
    [setProduct, setLoading],
  );

  const addProduct = useCallback(
    async (postProduct: IProductItems): Promise<void> => {
      await api
        .post('/products', postProduct)
        .then(async res => setProduct(await res.data))
        .finally(() => setLoading(false));
    },
    [setProduct, setLoading],
  );

  const editProduct = useCallback(
    async (id, putProduct): Promise<void> => {
      await api
        .put(`/products/${id}`, putProduct)
        .then(async res => setProduct(await res.data))
        .finally(() => setLoading(false));
    },
    [setProduct, setLoading],
  );

  const delProduct = useCallback(
    async (idProduct: string): Promise<void> => {
      if (!confirm('Deseja realmente excluir?')) return;

      await api
        .delete(`/products/${idProduct}`)
        .finally(() => setLoading(false));
    },
    [setLoading],
  );

  return (
    <ProductsContext.Provider
      value={{
        loading,
        product,
        products,
        findProducts,
        fetchProducts,
        addProduct,
        editProduct,
        delProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
