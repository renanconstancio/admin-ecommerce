import { Link } from 'react-router-dom';

type PaginationType = {
  total: number;
  pathname: string;
  params: { [key: string]: string | number };
};

import './style.scss';

export function Pagination({ params, pathname, total }: PaginationType) {
  const rows: number[] = [];
  for (let i = 1; i <= total; i++) {
    rows.push(i);
  }

  return (
    <ul className="pagination">
      <>
        {/* {params.page > 4 && (
          <>
            <Link
              to={`categories/1`}
              className={`${params.page === 1 ? 'selected' : ''}`}
            >
              1
            </Link>
            <p>...</p>
          </>
        )} */}
        {rows.map(i => (
          <li
            key={i}
            className={`${Number(params.page) === i ? 'active' : ''}`}
          >
            <Link
              to={{
                pathname,
                search: `?${new URLSearchParams({
                  ...params,
                  page: `${i}`,
                }).toString()}`,
              }}
            >
              {i}
            </Link>
          </li>
        ))}

        {/* {page <= maxPage - 4 && <p>...</p>}
        {maxPage > 1 && page + 3 <= 100 && (
          <Link to={`/cursos/${maxPage}`}>{maxPage}</Link>
        )} */}
      </>
    </ul>
  );
}
