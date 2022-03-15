import { Link, useLocation } from 'react-router-dom';
import './style.scss';

export function Menu() {
  const location = useLocation();

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
        <li className={handleActveLink('customers')}>
          <Link to="/customers">
            <span className="icon">
              <i className="fa-solid fa-user"></i>
            </span>
            <span className="title">Clientes</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
