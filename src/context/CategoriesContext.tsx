import React, { createContext } from 'react';
import { useBrands } from '../hooks/useBrands';

export interface Brands {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  prev_page: number | null;
  next_page: number | null;
  last_page: number;
  data: BrandList[];
}

export interface BrandList {
  id: string;
  name: string;
  description: string;
  discount_value: number | string;
  discount_type: string;
  actived: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface BrandsContextData {
  loading: boolean;
  error: string;
  brands: Brands;
  brand: BrandList;
  fetchBrands: () => Promise<void>;
  fetchFindBrand: (id: string) => Promise<void>;
  addBrand: (post: BrandList) => Promise<void>;
  editBrand: (id: string, put: BrandList) => Promise<void>;
  delBrand: (id: string) => Promise<unknown>;
}

export const BrandsContext = createContext<BrandsContextData>(
  {} as BrandsContextData,
);

export const BrandsProvider: React.FC = ({ children }) => {
  const customersContext = useBrands();

  return (
    <BrandsContext.Provider value={customersContext}>
      {children}
    </BrandsContext.Provider>
  );
};
