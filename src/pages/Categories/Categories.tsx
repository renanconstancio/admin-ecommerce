import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Loading } from '../../components/Loading';
import { ICategory, ICategories } from '../../types/Category';
import { IPagination } from '../../types/Pagination';
import { toast } from 'react-toastify';
import api from '../../api/api';
import { Pagination } from '../../components/Pagination';

export function Categories() {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get('page') ? Number(queryParams.get('page')) : 1;
  const limit = queryParams.get('limit') ? Number(queryParams.get('limit')) : 1;

  const [query, setSearch] = useState<string>('');
  const [{ category, loading }, fetch] = useState<
    ICategories<IPagination<ICategory>>
  >({
    category: {} as IPagination<ICategory>,
    loading: true,
    error: '',
  });

  const loadListining = useCallback(
    async (query, limit, page) => {
      await api
        .get(
          `/categories?categories[name]=${query}&limit=${limit}&page=${page}`,
        )
        .then(async res =>
          fetch({
            category: await res.data,
            loading: false,
            error: '',
          }),
        )
        .catch(err => {
          if (err.response?.data?.msg) alert(err.response.data.msg);
          else
            alert(
              'Erro ao tentar recuperar a lista. Tente novamente mais tarde',
            );
        });
    },
    [fetch, query, limit, page],
  );

  useEffect(() => {
    loadListining(query, limit, page);
  }, [query, limit, page]);

  const resolveDelete = async (item: ICategory) => {
    if (!confirm(`Deseja realmente excluir ${item.name}!`)) return;

    toast.promise(
      api.delete(`/categories/${item.id}`).then(() =>
        fetch({
          category: {
            ...category,
            data: category?.data?.filter(elem => elem.id !== item.id),
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
          <div className="help-buttons-flex" style={{ alignItems: 'center' }}>
            <h1 className="flex-1">Categorias</h1>
            <div className="form-style flex-10">
              <div
                className="form-input"
                style={{ width: '100%', flexDirection: 'row' }}
              >
                <input
                  type="search"
                  placeholder="Pesquisar Categoria"
                  style={{ width: '100%' }}
                  onChange={e => setSearch(e.target.value)}
                />
                <button
                  className="btn"
                  style={{ borderRadius: 6, marginLeft: 6 }}
                  onClick={() => loadListining(query, page, limit)}
                >
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </div>
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
                    onClick={() => resolveDelete(items)}
                    className="btn btn-danger"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </span>
                </span>
                <span className="flex-11">{items.name}</span>
              </li>
            ))}
          </ul>

          <Pagination
            params={{
              query: `${query}`,
              limit: `${limit}`,
              page: `${page}`,
            }}
            pathname={location.pathname}
            total={category.total}
          />
        </>
      )}
    </div>
  );
}
