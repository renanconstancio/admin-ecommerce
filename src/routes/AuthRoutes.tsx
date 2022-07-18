import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Menu } from '../components/Menu';
import { Content } from '../components/Content';
import { Dashboard } from '../Dashboard';
import { Categories } from '../pages/Categories/Categories';
import { CategoriesForm } from '../pages/Categories/CategoriesForm';
import { Products } from '../pages/Products/Products';
import { ProductsForm } from '../pages/Products/ProductsForm';
import { ProductSkusForm } from '../pages/Products/ProductSkusForm';
import { ProductImagesForm } from '../pages/Products/ProductImagesForm';

export function AuthRoutes() {
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/categories" element={<Content />}>
          <Route index element={<Categories />} />
          <Route path=":id/edit" element={<CategoriesForm />} />
          <Route path="new" element={<CategoriesForm />} />
        </Route>

        <Route path="/products" element={<Content />}>
          <Route index element={<Products />} />
          <Route path=":id/edit" element={<ProductsForm />} />
          <Route path=":id/skus" element={<ProductSkusForm />} />
          <Route
            path=":id/skus/:idsku/images"
            element={<ProductImagesForm />}
          />
          <Route path="new" element={<ProductsForm />} />
        </Route>

        <Route path="" element={<Content />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="*" element={<h1>ME ERROR</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
