import { useContext } from 'react';
import { ProductsContext } from '../context/ProductsContext';

export const useProducts = () => {
  return useContext(ProductsContext);
};
