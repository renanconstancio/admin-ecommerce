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

  const qParams = new URLSearchParams(location.search);
  const page = qParams.get('page') ? Number(qParams.get('page')) : 1;
  const limit = qParams.get('limit') ? Number(qParams.get('limit')) : 25;

  const [query, setQuery] = useState<string>('');

  const [{ data, loading, total }, fetch] = useState<IPagination<ICategory>>(
    {} as IPagination<ICategory>,
  );

  const loadList = useCallback(
    async (query, limit, page) => {
      await api
        .get(
          `/categories?categories[name]=${query}&limit=${limit}&page=${page}`,
        )
        .then(async resp => {
          fetch({
            ...(await resp.data),
            loading: true,
            error: '',
          });
        })
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
    loadList('', limit, page);
  }, [limit, page]);

  const resolveDelete = async (item: ICategory) => {
    if (!confirm(`Deseja realmente excluir ${item.name}!`)) return;

    toast.promise(
      api.delete(`/categories/${item.id}`).then(() => {
        loadList('', limit, page);
      }),
      {
        pending: 'Um momento por favor...',
        success: 'Removido com sucesso!',
        error: 'Algo deu errado, tente novamente!',
      },
    );
  };

  return (
    <div className="content">
      {!loading ? (
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
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
                <button
                  className="btn"
                  style={{ borderRadius: 6, marginLeft: 6 }}
                  onClick={() => loadList(query, limit, page)}
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
            {data?.map(items => (
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
                    className="btn btn-default"
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
            total={total}
          />
        </>
      )}
    </div>
  );
}
