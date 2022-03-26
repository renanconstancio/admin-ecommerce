import { useCallback, useMemo, useState } from 'react';
import api from '../api/api';
import { BrandList, Brands, BrandsContextData } from '../context/BrandsContext';

export const useBrands = (): BrandsContextData => {
  const [brands, setBrands] = useState<Brands>({} as Brands);
  const [brand, setBrand] = useState<BrandList>({} as BrandList);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBrands = useCallback(async (): Promise<void> => {
    await api
      .get('/brands')
      .then(async res => setBrands(await res.data))
      .catch(err => {
        const { message } = err.toJSON();
        setError(`Não foi possivel carregar a lista! -> ${message}`);
      })
      .finally(() => setLoading(false));
  }, [setBrands, setLoading]);

  const fetchFindBrand = useCallback(
    async (id: string): Promise<void> => {
      if (id) {
        await api
          .get(`/brands/${id}`)
          .then(async res => setBrand(await res.data))
          .catch(err => {
            const { message } = err.toJSON();
            setError(`Não foi possivel carregar a lista! -> ${message}`);
          })
          .finally(() => setLoading(false));
      } else {
        setBrand({} as BrandList);
        setLoading(false);
      }
    },
    [setBrand, setLoading],
  );

  const addBrand = useCallback(
    async (postBrand: BrandList): Promise<void> => {
      await api
        .post('/brands', postBrand)
        .finally(() => setLoading(false))
        .then(async res => setBrand(await res.data))
        .catch(err => {
          const { message, request } = err;
          if (request) {
            const message2 = JSON.parse(request.response).message;
            setError(`${message}, ${message2}`);
          }
        });
    },
    [setBrand, setLoading],
  );

  const editBrand = useCallback(
    async (id, putBrand): Promise<void> => {
      await api
        .put(`/brands/${id}`, putBrand)
        .then(async res => {
          setBrands(await res.data);
        })
        .catch(err => {
          const { message } = err.toJSON();
          setError(`${message}`);
        })
        .finally(() => setLoading(false));
    },
    [setBrand, setLoading],
  );

  const delBrand = useCallback(
    async (id: string) => {
      if (!confirm('Deseja realmente excluir?')) return;

      await api
        .delete(`/brands/${id}`)
        .then(async () => {
          const newBrands = brands.data.filter(item => item.id !== id);
          setBrands({ ...brands, ...{ ['data']: newBrands } });
        })
        .catch(err => {
          const { message } = err.toJSON();
          setError(`${message}`);
        })
        .finally(() => setLoading(false));
    },
    [brands, setBrands],
  );

  return useMemo(
    () => ({
      error,
      loading,
      brands,
      brand,
      fetchBrands,
      fetchFindBrand,
      addBrand,
      editBrand,
      delBrand,
    }),
    [
      error,
      loading,
      brands,
      brand,
      fetchBrands,
      fetchFindBrand,
      addBrand,
      editBrand,
      delBrand,
    ],
  );
};
