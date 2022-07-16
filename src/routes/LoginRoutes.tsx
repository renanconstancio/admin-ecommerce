import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LogIn } from '../pages/Login';

export const LoginRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<LogIn />} />
      </Routes>
    </BrowserRouter>
  );
};
