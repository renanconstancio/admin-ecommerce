import './style.scss';
import { Outlet } from 'react-router';

export function Content() {
  return (
    <section className="content">
      <Outlet />
    </section>
  );
}
