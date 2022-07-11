import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loading } from '../../components/Loading';
import { ICategory, ICategories } from '../../types/Category';
import { IPagination } from '../../types/Pagination';
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
                <span>{items.name}</span>
                <span>
                  <Link
                    to={`/categories/${items.id}/edit`}
                    className="btn btn-default"
                  >
                    editar <i className="fa-solid fa-pen-to-square"></i>
                  </Link>
                  <span
                    // onClick={() => delBrand(`${items.id}`)}
                    className="btn btn-danger"
                  >
                    excluir <i className="fa-solid fa-trash"></i>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
