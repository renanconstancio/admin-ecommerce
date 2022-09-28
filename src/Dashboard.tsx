import { Helmet } from 'react-helmet-async';

export function Dashboard() {
  return (
    <div className="content">
      <h1>Dashboard</h1>
      <Helmet>
        <title>Administrarivo</title>
      </Helmet>
    </div>
  );
}
