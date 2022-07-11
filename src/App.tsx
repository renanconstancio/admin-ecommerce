import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Menu } from './components/Menu';
import { Content } from './components/Content';
import { Dashboard } from './Dashboard';
import { Brands } from './pages/Brands/Brands';
import { BrandsForm } from './pages/Brands/BrandsForm';
import { BrandsProvider } from './context/BrandsContext';
import { ProductsProvider } from './context/ProductsContext';
import { Products } from './pages/Products/Products';
import { ProductsForm } from './pages/Products/ProductsForm';
import { CategoriesProvider } from './context/CategoriesContext';
import { CustomersProvider } from './context/CustomersContext';
import { Customers } from './pages/Customers/Customers';
import { CustomersForm } from './pages/Customers/CustomersForm';
import { Categories } from './pages/Categories/Categories';
import { CategoriesForm } from './pages/Categories/CategoriesForm';

export function App() {
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="categories" element={<Content />}>
          <Route index element={<Categories />} />
          <Route path=":id/edit" element={<CategoriesForm />} />
          <Route path="new" element={<CategoriesForm />} />
        </Route>

        <Route
          path="/brands"
          element={
            <BrandsProvider>
              <Content />
            </BrandsProvider>
          }
        >
          <Route index element={<Brands />} />
          <Route path=":id/edit" element={<BrandsForm />} />
          <Route path="new" element={<BrandsForm />} />
        </Route>

        <Route
          path="/products"
          element={
            <ProductsProvider>
              <CategoriesProvider>
                <BrandsProvider>
                  <Content />
                </BrandsProvider>
              </CategoriesProvider>
            </ProductsProvider>
          }
        >
          <Route index element={<Products />} />
          <Route path=":id/edit" element={<ProductsForm />} />
          <Route path="new" element={<ProductsForm />} />
        </Route>

        <Route
          path="customers"
          element={
            <CustomersProvider>
              <Content />
            </CustomersProvider>
          }
        >
          <Route index element={<Customers />} />
          <Route path=":id/edit" element={<CustomersForm />} />
          <Route path="new" element={<CustomersForm />} />
        </Route>

        <Route path="" element={<Dashboard />} />
        <Route path="*" element={<h1>ME ERROR</h1>} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}
