import { useCallback, useMemo, useState } from 'react';
import api from '../api/api';
import {
  CustomerList,
  Customers,
  CustomresContextData,
} from '../context/CustomersContext';

export const useCustomer = (): CustomresContextData => {
  const [customers, setCustomers] = useState<Customers>({} as Customers);
  const [customer, setCustomer] = useState<CustomerList>({} as CustomerList);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCustomers = useCallback(async () => {
    await api
      .get('/customers')
      .then(res => setCustomers(res.data))
      .catch(err => {
        const { message } = err.toJSON();
        setError(`Não foi possivel carregar a lista! -> ${message}`);
      })
      .finally(() => setLoading(false));
  }, [setCustomers]);

  const fetchFindCustomer = useCallback(
    async (id: string) => {
      if (id) {
        await api
          .get(`/customers/${id}`)
          .then(res => setCustomer(res.data))
          .catch(err => {
            const { message } = err.toJSON();
            setError(`Não foi possivel carregar a lista! -> ${message}`);
          })
          .finally(() => setLoading(false));
      } else {
        setCustomer({} as CustomerList);
        setLoading(false);
      }
    },
    [setCustomer],
  );

  const addCustomer = useCallback(
    async (postCustomer: CustomerList) => {
      await api
        .post('/customers', postCustomer)
        .finally(() => setLoading(false))
        .then(res => setCustomers(res.data))
        .catch(err => {
          const { message, request } = err;
          if (request) {
            const message2 = JSON.parse(request.response).message;
            setError(`${message}, ${message2}`);
          }
          // console.log('request: %O', JSON.parse(err.request.response).message);
        });
    },
    [setCustomer],
  );

  const editCustomer = useCallback(
    async (id, putCustomer) => {
      await api
        .put(`/customers/${id}`, putCustomer)
        .then(res => {
          setCustomers(res.data);
        })
        .catch(err => {
          const { message } = err.toJSON();
          setError(`${message}`);
        })
        .finally(() => setLoading(false));
    },
    [setCustomer],
  );

  const delCustomer = useCallback(
    async (id: string) => {
      if (!confirm('Deseja realmente excluir?')) return;

      await api
        .delete(`/customers/${id}`)
        .then(() => {
          const newCustomers = customers.data.filter(item => item.id !== id);
          setCustomers({ ...customers, ...{ ['data']: newCustomers } });
        })
        .catch(err => {
          const { message } = err.toJSON();
          setError(`${message}`);
        })
        .finally(() => setLoading(false));
    },
    [customers, setCustomers],
  );

  return useMemo(
    () => ({
      error,
      loading,
      customers,
      customer,
      fetchCustomers,
      fetchFindCustomer,
      addCustomer,
      editCustomer,
      delCustomer,
    }),
    [
      error,
      loading,
      customers,
      customer,
      fetchCustomers,
      fetchFindCustomer,
      addCustomer,
      editCustomer,
      delCustomer,
    ],
  );
};
