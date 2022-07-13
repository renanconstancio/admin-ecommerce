import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Menu } from './components/Menu';
import { Content } from './components/Content';
import { Dashboard } from './Dashboard';

// import { Brands } from './pages/Brands/Brands';
// import { BrandsForm } from './pages/Brands/BrandsForm';

// import { Products } from './pages/Products/Products';
// import { ProductsForm } from './pages/Products/ProductsForm';

// import { Customers } from './pages/Customers/Customers';
// import { CustomersForm } from './pages/Customers/CustomersForm';

import { Categories } from './pages/Categories/Categories';
import { CategoriesForm } from './pages/Categories/CategoriesForm';
import { Customers } from './pages/Customers/Customers';
import { CustomersForm } from './pages/Customers/CustomersForm';
import { Products } from './pages/Products/Products';
import { ProductsForm } from './pages/Products/ProductsForm';

export function App() {
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/categories" element={<Content />}>
          <Route index element={<Categories />} />
          <Route path=":id/edit" element={<CategoriesForm />} />
          <Route path="new" element={<CategoriesForm />} />
        </Route>

        {/* <Route path="/brands" element={<Content />}>
          <Route index element={<Brands />} />
          <Route path=":id/edit" element={<BrandsForm />} />
          <Route path="new" element={<BrandsForm />} />
        </Route>
      */}

        <Route path="/products" element={<Content />}>
          <Route index element={<Products />} />
          <Route path=":id/edit" element={<ProductsForm />} />
          <Route path="new" element={<ProductsForm />} />
        </Route>

        {/* <Route path="/customers" element={<Content />}>
          <Route index element={<Customers />} />
          <Route path=":id/edit" element={<CustomersForm />} />
          <Route path="new" element={<CustomersForm />} />
        </Route> */}

        <Route path="" element={<Content />}>
          <Route index element={<Dashboard />} />
        </Route>

        <Route path="*" element={<h1>ME ERROR</h1>} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}
