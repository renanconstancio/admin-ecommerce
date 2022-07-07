import React, { createContext, useCallback, useState } from 'react';
import api from '../api/api';

export interface ICustomers {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  prev_page: number | null;
  next_page: number | null;
  last_page: number;
  data: ICustomerItems[];
}

export interface ICustomerItems {
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

export interface ICustomerRequest {
  first_name: string;
  last_name: string;
  cpf: string;
  email: string;
  check_email: string;
  birth_date: string;
  password?: string;
}

export interface ICustomresContextData {
  loading: boolean;
  customers: ICustomers;
  customer: ICustomerItems;
  fetchCustomers: () => Promise<void>;
  fetchFindCustomer: (id: string) => Promise<void>;
  addCustomer: (post: ICustomerRequest) => Promise<void>;
  editCustomer: (id: string, put: ICustomerRequest) => Promise<void>;
  delCustomer: (id: string) => Promise<unknown>;
}

export const CustomersContext = createContext<ICustomresContextData>(
  {} as ICustomresContextData,
);

export const CustomersProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<ICustomers>({} as ICustomers);
  const [customer, setCustomer] = useState<ICustomerItems>(
    {} as ICustomerItems,
  );

  const fetchCustomers = useCallback(async (): Promise<void> => {
    await api
      .get('/customers')
      .then(async res => setCustomers(await res.data))
      .finally(() => setLoading(false));
  }, [setCustomers, setLoading]);

  const fetchFindCustomer = useCallback(
    async (id: string): Promise<void> => {
      if (id) {
        await api
          .get(`/customers/${id}`)
          .then(async res => setCustomer(await res.data))
          .finally(() => setLoading(false));
      } else {
        setCustomer({} as ICustomerItems);
        setLoading(false);
      }
    },
    [setCustomer, setLoading],
  );

  const addCustomer = useCallback(
    async (postCustomer: ICustomerRequest): Promise<void> => {
      await api
        .post('/customers', postCustomer)
        .finally(() => setLoading(false))
        .then(async res => setCustomer(await res.data));
    },
    [setCustomer, setLoading],
  );

  const editCustomer = useCallback(
    async (id: string, putCustomer: ICustomerRequest): Promise<void> => {
      await api
        .put(`/customers/${id}`, putCustomer)
        .then(async res => setCustomer(await res.data))
        .finally(() => setLoading(false));
    },
    [setCustomer, setLoading],
  );

  const delCustomer = useCallback(
    async (id: string): Promise<void> => {
      if (!confirm('Deseja realmente excluir?')) return;

      await api
        .delete(`/customers/${id}`)
        .then(async () => {
          const newCustomers = customers.data.filter(item => item.id !== id);
          setCustomers({ ...customers, ...{ ['data']: newCustomers } });
        })
        .finally(() => setLoading(false));
    },
    [customers, setCustomers, setLoading],
  );

  return (
    <CustomersContext.Provider
      value={{
        loading,
        customers,
        customer,
        fetchCustomers,
        fetchFindCustomer,
        addCustomer,
        editCustomer,
        delCustomer,
      }}
    >
      {children}
    </CustomersContext.Provider>
  );
};
