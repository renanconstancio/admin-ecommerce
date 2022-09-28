import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type PaginationType = {
  total: number;
  pathname: string;
  params: { [key: string]: string | number };
};

import './style.scss';

export function Pagination({ params, pathname, total }: PaginationType) {
  const [nrPages, setNrPages] = useState<number[]>([]);
  const [maxPage, setmaxPage] = useState<number>(1);

  useEffect(() => {
    setmaxPage(Math.ceil(total / Number(params.limit)));
    if (params.page <= maxPage && params.page > 0) {
      const aPages: number[] = [];
      let nrMax =
        Number(params.page) + 2 > maxPage ? maxPage : Number(params.page) + 2;
      let nrMin =
        Number(params.page) - 1 > 1
          ? Number(params.page) - 1
          : Number(params.page);

      if (params.page <= 4) {
        nrMin = 1;
        nrMax = maxPage > 6 ? 6 : maxPage;
      }

      if (nrMin > nrMax - 4 && nrMin !== 1) nrMin = nrMax - 4;

      for (let i = nrMin; i <= nrMax; i++) aPages.push(i);

      setNrPages(aPages);
    }
  }, [total, params.page, params.limit, setmaxPage, setNrPages]);

  return (
    <ul className="pagination">
      <>
        {params.page > 4 && (
          <li
            key="1"
            className={`${Number(params.page) === 1 ? 'active' : ''}`}
          >
            <Link
              to={{
                pathname,
                search: `?${new URLSearchParams({
                  ...params,
                  page: '1',
                }).toString()}`,
              }}
            >
              1
            </Link>
          </li>
        )}

        {nrPages.map(i => (
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

        {maxPage > 1 && Number(params.page) + 3 <= 100 && (
          <li
            key={maxPage}
            className={`${Number(params.page) === maxPage ? 'active' : ''}`}
          >
            <Link
              to={{
                pathname,
                search: `?${new URLSearchParams({
                  ...params,
                  page: `${maxPage}`,
                }).toString()}`,
              }}
            >
              {maxPage}
            </Link>
          </li>
        )}
      </>
    </ul>
  );
}
