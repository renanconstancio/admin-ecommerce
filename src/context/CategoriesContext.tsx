import React, { createContext, useCallback, useEffect, useState } from 'react';
import api from '../api/api';

export interface ICategories {
  id: string;
  name: string;
  description: string;
  discount_value: number | string;
  discount_type: string;
  actived: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  chidrens: ICategories[];
}

export interface ICategoriesContextData {
  loading: boolean;
  categories: ICategories[];
  category: ICategories;
  findCategory: (id: string) => Promise<void>;
  addCategory: (post: ICategories) => Promise<void>;
  editCategory: (id: string, put: ICategories) => Promise<void>;
  delCategory: (id: string) => Promise<unknown>;
}

export const CategoriesContext = createContext<ICategoriesContextData>(
  {} as ICategoriesContextData,
);

export const CategoriesProvider: React.FC = ({ children }) => {
  const [categories, setCategories] = useState<ICategories[]>([]);
  const [category, setCategory] = useState<ICategories>({} as ICategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await api
        .get('/categories')
        .then(async res => setCategories(await res.data))
        .finally(() => setLoading(false));
    })();
  }, [setCategories, setLoading]);

  const findCategory = useCallback(
    async (id: string): Promise<void> => {
      if (id) {
        await api
          .get(`/categories/${id}`)
          .then(async res => setCategory(await res.data))
          .finally(() => setLoading(false));
      } else {
        setCategory({} as ICategories);
        setLoading(false);
      }
    },
    [setCategory, setLoading],
  );

  const addCategory = useCallback(
    async (postCategory: ICategories): Promise<void> => {
      await api
        .post('/categories', postCategory)
        .finally(() => setLoading(false))
        .then(async res => setCategory(await res.data));
    },
    [setCategory, setLoading],
  );

  const editCategory = useCallback(
    async (id, putCategory): Promise<void> => {
      await api
        .put(`/categories/${id}`, putCategory)
        .then(async res => setCategory(await res.data))
        .finally(() => setLoading(false));
    },
    [setCategory, setLoading],
  );

  const delCategory = useCallback(
    async (id: string) => {
      if (!confirm('Deseja realmente excluir?')) return;

      await api
        .delete(`/categories/${id}`)
        .then(async () => {
          const newCategories = categories.filter(item => item.id !== id);
          setCategories({ ...categories, ...{ ['data']: newCategories } });
        })
        .finally(() => setLoading(false));
    },
    [categories, setCategories],
  );

  return (
    <CategoriesContext.Provider
      value={{
        loading,
        categories,
        category,
        findCategory,
        addCategory,
        editCategory,
        delCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};
