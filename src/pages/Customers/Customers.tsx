import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/api';
import { Loading } from '../../components/Loading';
import { ICustomer, ICustomers } from '../../types/Customer';
import { IPagination } from '../../types/Pagination';

export function Customers() {
  const [{ customer, loading }, fetch] = useState<
    ICustomers<IPagination<ICustomer>>
  >({
    customer: {} as IPagination<ICustomer>,
    loading: true,
    error: '',
  });

  useEffect(() => {
    (async () => {
      await api.get('/customers').then(async res =>
        fetch({
          customer: await res.data,
          loading: false,
          error: '',
        }),
      );
    })();
  }, [fetch]);

  const resolveDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir!')) return;

    toast.promise(
      api.delete(`/customers/${id}`).then(() =>
        fetch({
          customer: {
            ...customer,
            data: customer?.data?.filter(elem => elem.id !== id),
          },
          loading: false,
          error: '',
        }),
      ),
      {
        pending: 'Um momento por favor...',
        success: 'Removido com sucesso!',
        error: 'Algo deu errado, tente novamente!',
      },
    );
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="content">
      <div className="help-buttons-flex">
        <h1>Clientes</h1>
        <Link to="/customers/new" className="btn btn-primary">
          novo <i className="fa-solid fa-plus"></i>
        </Link>
      </div>
      <ul className="ul-content-list">
        <li>
          <span>Nome</span>
          <span>Ações</span>
        </li>
        {customer?.data?.map(items => (
          <li key={items.id}>
            <span className="flex-1">
              <Link
                to={`/customers/${items.id}/edit`}
                className="btn btn-default"
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </Link>
              <span
                onClick={() => resolveDelete(items.id)}
                className="btn btn-danger"
              >
                <i className="fa-solid fa-trash"></i>
              </span>
            </span>
            <span className="flex-11">{items.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
