import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SingIn } from '../pages/SingIn/SingIn';

export function LoginRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<SingIn />} />
      </Routes>
    </BrowserRouter>
  );
}
