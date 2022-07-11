import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loading } from '../../components/Loading';
import { ICategory, ICategories } from '../../types/Category';
import { IPagination } from '../../types/Pagination';
import { toast } from 'react-toastify';
import api from '../../api/api';

export function Categories() {
  const [{ category, loading }, fetch] = useState<
    ICategories<IPagination<ICategory>>
  >({
    category: {} as IPagination<ICategory>,
    loading: true,
    error: '',
  });

  useEffect(() => {
    (async () => {
      await api.get('/categories').then(async res =>
        fetch({
          category: await res.data,
          loading: false,
          error: '',
        }),
      );
    })();
  }, [fetch]);

  const resolveDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir!')) return;

    toast.promise(
      api.delete(`/categories/${id}`).then(() =>
        fetch({
          category: {
            ...category,
            data: category?.data?.filter(elem => elem.id !== id),
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

  return (
    <div className="content">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="help-buttons-flex">
            <h1>Categorias</h1>
            <Link to="/categories/new" className="btn btn-primary">
              novo <i className="fa-solid fa-plus"></i>
            </Link>
          </div>
          <ul className="ul-content-list">
            <li>
              <span>Nome</span>
              <span>Ações</span>
            </li>
            {category?.data?.map(items => (
              <li key={items.id}>
                <span className="flex-1">
                  <Link
                    to={`/categories/${items.id}/edit`}
                    className="btn btn-default"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </Link>
                  <span
                    onClick={() => resolveDelete(`${items.id}`)}
                    className="btn btn-danger"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </span>
                </span>
                <span className="flex-11">{items.name}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
