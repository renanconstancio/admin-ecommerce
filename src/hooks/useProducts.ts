import { useCallback, useMemo, useState } from 'react';
import api from '../api/api';
import {
  ProductList,
  Products,
  ProductsContextData,
} from '../context/ProductsContext';

export const useProducts = (): ProductsContextData => {
  const [products, setProducts] = useState<Products>({} as Products);
  const [product, setProduct] = useState<ProductList>({} as ProductList);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = useCallback(async (): Promise<void> => {
    await api
      .get('/products')
      .then(async res => setProducts(await res.data))
      .catch(err => {
        const { message } = err.toJSON();
        setError(`Não foi possivel carregar a lista! -> ${message}`);
      })
      .finally(() => setLoading(false));
  }, [setProducts, setLoading]);

  const fetchFindProduct = useCallback(
    async (id: string): Promise<void> => {
      if (id) {
        await api
          .get(`/products/${id}`)
          .then(async res => setProduct(await res.data))
          .catch(err => {
            const { message } = err.toJSON();
            setError(`Não foi possivel carregar a lista! -> ${message}`);
          })
          .finally(() => setLoading(false));
      } else {
        setProduct({} as ProductList);
        setLoading(false);
      }
    },
    [setProduct, setLoading],
  );

  const addProduct = useCallback(
    async (postProduct: ProductList): Promise<void> => {
      await api
        .post('/products', postProduct)
        .finally(() => setLoading(false))
        .then(async res => setProduct(await res.data))
        .catch(err => {
          const { message, request } = err;
          if (request) {
            const message2 = JSON.parse(request.response).message;
            setError(`${message}, ${message2}`);
          }
          // console.log('request: %O', JSON.parse(err.request.response).message);
        });
    },
    [setProduct, setLoading],
  );

  const editProduct = useCallback(
    async (id, putProduct): Promise<void> => {
      await api
        .put(`/products/${id}`, putProduct)
        .then(async res => {
          setProducts(await res.data);
        })
        .catch(err => {
          const { message } = err.toJSON();
          setError(`${message}`);
        })
        .finally(() => setLoading(false));
    },
    [setProduct, setLoading],
  );

  const delProduct = useCallback(
    async (id: string): Promise<void> => {
      if (!confirm('Deseja realmente excluir?')) return;

      await api
        .delete(`/products/${id}`)
        .then(async () => {
          const newProducts = products.data.filter(item => item.id !== id);
          setProducts({ ...products, ...{ ['data']: newProducts } });
        })
        .catch(err => {
          const { message } = err.toJSON();
          setError(`${message}`);
        })
        .finally(() => setLoading(false));
    },
    [products, setProducts, setLoading],
  );

  return useMemo(
    () => ({
      error,
      loading,
      products,
      product,
      fetchProducts,
      fetchFindProduct,
      addProduct,
      editProduct,
      delProduct,
    }),
    [
      error,
      loading,
      products,
      product,
      fetchProducts,
      fetchFindProduct,
      addProduct,
      editProduct,
      delProduct,
    ],
  );
};
