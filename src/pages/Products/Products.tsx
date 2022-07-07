import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loading } from '../../components/Loading';
import { useError } from '../../hooks/useError';
import { useProducts } from '../../hooks/useProducts';

export function Products() {
  const { products, loading, fetchProducts, delProduct } = useProducts();
  const { setError } = useError();
  useEffect(() => {
    fetchProducts();

    setError({
      type: 'danger',
      message: `Não foi possivel carregar a lista!`,
    });
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <div className="content">
      <div className="help-buttons-flex">
        <h1>Produtos</h1>
        <Link to="/products/new" className="btn btn-primary">
          novo <i className="fa-solid fa-plus"></i>
        </Link>
      </div>
      <ul className="ul-content-list">
        <li>
          <span>Nome</span>
          <span>Ações</span>
        </li>
        {products.data?.map(items => (
          <li key={items.id}>
            <span>{items.name}</span>
            <span>
              <Link
                to={`/products/${items.id}/edit`}
                className="btn btn-default"
              >
                editar <i className="fa-solid fa-pen-to-square"></i>
              </Link>
              <span
                onClick={() => delProduct(`${items.id}`)}
                className="btn btn-danger"
              >
                excluir <i className="fa-solid fa-trash"></i>
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
