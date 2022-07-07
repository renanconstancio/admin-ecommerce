import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loading } from '../../components/Loading';
import { useBrands } from '../../hooks/useBrands';

export function Brands() {
  const { brands, loading, fetchBrands, delBrand } = useBrands();

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="content">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="help-buttons-flex">
            <h1>Marcas</h1>
            <Link to="/brands/new" className="btn btn-primary">
              novo <i className="fa-solid fa-plus"></i>
            </Link>
          </div>
          <ul className="ul-content-list">
            <li>
              <span>Nome</span>
              <span>Ações</span>
            </li>
            {brands?.data.map(items => (
              <li key={items.id}>
                <span>{items.name}</span>
                <span>
                  <Link
                    to={`/brands/${items.id}/edit`}
                    className="btn btn-default"
                  >
                    editar <i className="fa-solid fa-pen-to-square"></i>
                  </Link>
                  <span
                    onClick={() => delBrand(`${items.id}`)}
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
