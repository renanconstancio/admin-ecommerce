import React, { createContext, useCallback, useEffect, useState } from 'react';
import api from '../api/api';

export interface IBrands {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  prev_page: number | null;
  next_page: number | null;
  last_page: number;
  data: IBrandItems[];
}

export interface IBrandItems {
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

export interface IBrandRequest {
  name: string;
  description: string;
  discount_value: number | string;
  discount_type: string;
  actived: string;
}

export interface IBrandsContextData {
  loading: boolean;
  brands: IBrands;
  brand: IBrandItems;
  brandsAll: IBrandItems[];
  fetchBrands: () => Promise<void>;
  findBrand: (id: string) => Promise<void>;
  addBrand: (post: IBrandRequest) => Promise<void>;
  editBrand: (id: string, put: IBrandRequest) => Promise<void>;
  delBrand: (id: string) => Promise<unknown>;
}

export const BrandsContext = createContext<IBrandsContextData>(
  {} as IBrandsContextData,
);

export const BrandsProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<IBrands>({} as IBrands);
  const [brandsAll, setBrandsAll] = useState<IBrandItems[]>([]);
  const [brand, setBrand] = useState<IBrandItems>({} as IBrandItems);
  // const { setError } = useError();

  useEffect(() => {
    (async () => {
      await api
        .get('/brands/all')
        .then(async res => setBrandsAll(await res.data))
        .finally(() => setLoading(false));
    })();
  }, [setBrandsAll, setLoading]);

  const fetchBrands = useCallback(async (): Promise<void> => {
    await api
      .get('/brands')
      .then(async res => setBrands(await res.data))
      .finally(() => setLoading(false));
  }, [setBrands, setLoading]);

  const findBrand = useCallback(
    async (id: string): Promise<void> => {
      if (id) {
        await api
          .get(`/brands/${id}`)
          .then(async res => setBrand(await res.data))

          .finally(() => setLoading(false));
      } else {
        setBrand({} as IBrandItems);
        setLoading(false);
      }
    },
    [setBrand, setLoading],
  );

  const addBrand = useCallback(
    async (postBrand: IBrandRequest): Promise<void> => {
      setLoading(true);
      await api
        .post('/brands', postBrand)
        .then(async res => setBrand(await res.data))

        .finally(() => setLoading(false));
    },
    [setBrand, setLoading],
  );

  const editBrand = useCallback(
    async (id: string, putBrand: IBrandRequest): Promise<void> => {
      setLoading(true);
      await api
        .put(`/brands/${id}`, putBrand)
        .then(async res => setBrands(await res.data))

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

        .finally(() => setLoading(false));
    },
    [brands, setBrands],
  );

  return (
    <BrandsContext.Provider
      value={{
        loading,
        brands,
        brand,
        brandsAll,
        fetchBrands,
        findBrand,
        addBrand,
        editBrand,
        delBrand,
      }}
    >
      {children}
    </BrandsContext.Provider>
  );
};
