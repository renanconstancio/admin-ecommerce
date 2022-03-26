import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loading } from '../../components/Loading';
import { ProductList } from '../../context/ProductsContext';
import { useProducts } from '../../hooks/useProducts';
import { useLocalStorage } from '../../hooks/useStorage';

export function Products() {
  const { products, loading, error, fetchProducts, delProduct } = useProducts();
  const [, setStorage] = useLocalStorage(`@products`, {} as ProductList);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return loading ? (
    <Loading />
  ) : error ? (
    <h2>{error}</h2>
  ) : (
    <div className="content">
      <div className="help-buttons-flex">
        <h1>Produtos</h1>
        <Link
          to="/products/new"
          className="btn btn-primary"
          onClick={() => setStorage({} as ProductList)}
        >
          novo <i className="fa-solid fa-plus"></i>
        </Link>
      </div>
      <ul className="ul-content-list">
        <li>
          <span>Nome</span>
          <span>Ações</span>
        </li>
        {products.data.map(items => (
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
                onClick={() => delProduct(items.id)}
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
