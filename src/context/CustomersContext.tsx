import React, { createContext } from 'react';
import { useCustomer } from '../hooks/useCustomers';

export interface Customers {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  prev_page: number | null;
  next_page: number | null;
  last_page: number;
  data: CustomerList[];
}

export interface CustomerList {
  id: string;
  first_name: string;
  last_name: string;
  cpf: string;
  email: string;
  check_email: string;
  birth_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  password?: string;
}

export interface CustomresContextData {
  loading: boolean;
  error: string;
  customers: Customers;
  customer: CustomerList;
  fetchCustomers: () => Promise<void>;
  fetchFindCustomer: (id: string) => Promise<void>;
  addCustomer: (post: CustomerList) => Promise<void>;
  editCustomer: (id: string, put: CustomerList) => Promise<void>;
  delCustomer: (id: string) => Promise<unknown>;
}

export const CustomersContext = createContext<CustomresContextData>(
  {} as CustomresContextData,
);

export const CustomersProvider: React.FC = ({ children }) => {
  const customersContext = useCustomer();

  return (
    <CustomersContext.Provider value={customersContext}>
      {children}
    </CustomersContext.Provider>
  );
};
