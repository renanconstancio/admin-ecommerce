import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Menu } from './components/Menu';
import { Content } from './components/Content';
import { Dashboard } from './Dashboard';
import { Customers } from './pages/Customers/Customers';
import { CustomersForm } from './pages/Customers/CustomersForm';
import 'react-toastify/dist/ReactToastify.css';
import './style/app.scss';
import { Products } from './pages/Products/Products';
import { ProductsForm } from './pages/Products/ProductsForm';
import { Brands } from './pages/Brands/Brands';
import { BrandsForm } from './pages/Brands/BrandsForm';

export function App() {
  return (
    <BrowserRouter>
      <Menu />
      <Content>
        <Routes>
          <Route path="/brands">
            <Route index element={<Brands />} />
            <Route path=":id/edit" element={<BrandsForm />} />
            <Route path="new" element={<BrandsForm />} />
          </Route>
          <Route path="/products">
            <Route index element={<Products />} />
            <Route path=":id/edit" element={<ProductsForm />} />
            <Route path="new" element={<ProductsForm />} />
          </Route>
          <Route path="/customers">
            <Route index element={<Customers />} />
            <Route path=":id/edit" element={<CustomersForm />} />
            <Route path="new" element={<CustomersForm />} />
          </Route>

          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<h1>ME ERROR</h1>} />
        </Routes>
      </Content>
      <ToastContainer />
    </BrowserRouter>
  );
}
