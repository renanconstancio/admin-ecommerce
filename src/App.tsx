import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import { AuthRoutes } from './routes/AuthRoutes';
import { LoginRoutes } from './routes/LoginRoutes';
import { useAuth } from './hooks/useAuth';

export const App: React.FC = () => {
  const { signed } = useAuth();

  return (
    <HelmetProvider>
      {!signed ? <LoginRoutes /> : <AuthRoutes />}
      <ToastContainer />
    </HelmetProvider>
  );
};
