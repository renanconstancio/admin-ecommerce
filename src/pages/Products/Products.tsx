import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Loading } from '../../components/Loading';
import { IPagination } from '../../types/Pagination';
import { IProduct } from '../../types/Product';
import { Pagination } from '../../components/Pagination';
import { Helmet } from 'react-helmet-async';
import api from '../../api/api';

export function Products() {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get('page') ? Number(queryParams.get('page')) : 1;
  const limit = queryParams.get('limit')
    ? Number(queryParams.get('limit'))
    : 25;

  const [query, setQuery] = useState<string>('');
  const [{ data, loading, total }, fetch] = useState<IPagination<IProduct>>(
    {} as IPagination<IProduct>,
  );

  const loadList = useCallback(
    async (query, limit, page) => {
      await api
        .get(`/products?products[name]=${query}&limit=${limit}&page=${page}`)
        .then(async resp =>
          fetch({
            ...(await resp.data),
            loading: true,
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
    loadList('', limit, page);
  }, [limit, page]);

  const resolveDelete = async (item: IProduct) => {
    if (!confirm(`Deseja realmente excluir ${item.name}!`)) return;

    toast.promise(
      api.delete(`/products/${item.id}`).then(() => {
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
            <h1>Produtos</h1>
            <div className="form-style flex-10">
              <div
                className="form-input"
                style={{ width: '100%', flexDirection: 'row' }}
              >
                <input
                  type="search"
                  placeholder="Pesquisar Produtos"
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
            <Link to="/products/new" className="btn btn-primary">
              novo <i className="fa-solid fa-plus"></i>
            </Link>
          </div>
          <ul className="ul-content-list">
            <li>
              <span className="flex-1">Ações</span>
              <span className="flex-11">Nome</span>
            </li>
            {data?.map(items => (
              <li key={items.id}>
                <span className="flex-1">
                  <Link
                    to={`/products/${items.id}/edit`}
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
      <Helmet>
        <title>Produtos - Lista</title>
      </Helmet>
    </div>
  );
}
