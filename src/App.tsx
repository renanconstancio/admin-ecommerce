import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Menu } from './components/Menu';
import { Content } from './components/Content';
import { Dashboard } from './Dashboard';
import { Customers } from './pages/Customers/Customers';
import { CustomersForm } from './pages/Customers/CustomersForm';
import 'react-toastify/dist/ReactToastify.css';
import './style/app.scss';

export function App() {
  return (
    <BrowserRouter>
      <Menu />
      <Content>
        <Routes>
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
