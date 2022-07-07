import { useContext } from 'react';
import { BrandsContext } from '../context/BrandsContext';

export const useBrands = () => {
  return useContext(BrandsContext);
};
