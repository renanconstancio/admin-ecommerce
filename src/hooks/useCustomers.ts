import { useContext } from 'react';
import { CustomersContext } from '../context/CustomersContext';

export const useCustomer = () => {
  return useContext(CustomersContext);
};
