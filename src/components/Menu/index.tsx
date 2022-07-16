import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './style.scss';

export function Menu() {
  const location = useLocation();

  const { logout } = useAuth();

  const handleActveLink = (str: string) => {
    return location.pathname.split('/')[1] === str ? 'active' : '';
  };

  return (
    <nav className="menu">
      <ul>
        <li>
          <a href="/">
            <span className="icon">
              <i className="fa-brands fa-apple"></i>
            </span>
            <span className="title">STORE</span>
          </a>
        </li>
        <li className={handleActveLink('')}>
          <Link to="/">
            <span className="icon">
              <i className="fa-solid fa-gauge"></i>
            </span>
            <span className="title">dashboard</span>
          </Link>
        </li>
        <li className={handleActveLink('categories')}>
          <Link to="/categories">
            <span className="icon">
              <i className="fa-solid fa-gauge"></i>
            </span>
            <span className="title">Categorias</span>
          </Link>
        </li>
        <li className={handleActveLink('products')}>
          <Link to="/products">
            <span className="icon">
              <i className="fa-solid fa-box"></i>
            </span>
            <span className="title">Produtos</span>
          </Link>
        </li>
        {/* <li className={handleActveLink('brands')}>
          <Link to="/brands">
            <span className="icon">
              <i className="fa-solid fa-network-wired"></i>
            </span>
            <span className="title">Marcas</span>
          </Link>
        </li>
        <li className={handleActveLink('products/skus')}>
          <Link to="/products">
            <span className="icon">
              <i className="fa-solid fa-boxes-stacked"></i>{' '}
            </span>
            <span className="title">Estoques</span>
          </Link>
        </li> */}
        <li className={handleActveLink('customers')}>
          <Link to="/customers">
            <span className="icon">
              <i className="fa-solid fa-user"></i>
            </span>
            <span className="title">Clientes</span>
          </Link>
        </li>
        <li>
          <Link to="/login" onClick={() => logout()}>
            <span className="icon">
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </span>
            <span className="title">LogOut</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
