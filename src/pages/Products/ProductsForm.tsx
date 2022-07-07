import { ChangeEvent, useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Loading } from '../../components/Loading';
import { IProductItems } from '../../context/ProductsContext';
import { useProducts } from '../../hooks/useProducts';
import { useBrands } from '../../hooks/useBrands';
import { toast } from 'react-toastify';
import { useCategories } from '../../hooks/useCategories';

export function ProductsForm() {
  const { id } = useParams<string>();

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const [resolveSelectBrand, setResolveSelectBrand] = useState<string>('');
  const [resolveSelectCategory, setResolveSelectCategory] =
    useState<string>('');

  const productId: string = id !== undefined ? id : '';

  const {
    reset,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IProductItems>({ defaultValues: {} as IProductItems });

  const { brandsAll: brandsAll, loading: loadBrands } = useBrands();
  const { categories: categoriesAll, loading: loadCategory } = useCategories();

  const { product, loading, findProducts, editProduct, addProduct } =
    useProducts();

  useEffect(() => {
    findProducts(productId);
  }, []);

  useEffect(() => {
    const url = pathname.split('/');
    if (product.id) {
      reset(product);
      if (url[url.length - 1] === 'new') {
        navigate(`/products/${product.id}/edit`);
      }
    }
  }, [product]);

  useEffect(() => {
    const brandSelect = brandsAll.find(item => item.id === product.brands_id);
    if (brandSelect !== undefined) {
      setResolveSelectBrand(brandSelect.name);
    }
  }, [brandsAll, product]);

  const onResolveChangeBrands = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const brandResolve = brandsAll.find(item => item.name === value);
    if (brandResolve !== undefined) {
      setValue('brands_id', brandResolve?.id);
    }
  };

  useEffect(() => {
    const categorySelect = categoriesAll.find(
      item => item.id === product.categories_id,
    );
    if (categorySelect !== undefined) {
      setResolveSelectCategory(categorySelect.name);
    }
  }, [categoriesAll, product]);

  const onResolveChangeCategories = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const categoryResolve = categoriesAll.find(item => item.name === value);
    if (categoryResolve !== undefined) {
      setValue('categories_id', categoryResolve?.id);
    }
  };

  const onSubmit: SubmitHandler<IProductItems> = async data => {
    let promiseProducts: Promise<void> = {} as Promise<void>;
    if (product.id) {
      promiseProducts = editProduct(product.id, data);
    } else {
      promiseProducts = addProduct(data);
    }

    toast.promise(promiseProducts, {
      pending: 'Um momento por favor...',
      success: 'Dados salvos com sucesso!',
      error: 'Algo deu errado, tente novamente!',
    });
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="content">
      <div className="help-buttons-flex">
        <h1>Produto {product.name}</h1>
        <span>
          <Link to="/products" className="btn btn-default">
            voltar <i className="fa-solid fa-undo"></i>
          </Link>
          <button form="customers" type="submit" className="btn btn-primary">
            salvar <i className="fa-solid fa-pen-to-square"></i>
          </button>
        </span>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-style form-customer"
        id="customers"
      >
        <div className="form-input" style={{ width: 375 }}>
          <label htmlFor="name">Nome *</label>
          <input
            type="text"
            {...register('name', { required: true })}
            className={errors.name && 'input-invalid'}
          />
          <small>{errors.name && 'Campo obrigatório!'}</small>
        </div>
        <div className="form-input" style={{ width: 175 }}>
          <label htmlFor="name">Em Estoque</label>
          <input readOnly type="text" />
        </div>

        <div style={{ width: '100%' }} />
        <div className="form-input" style={{ width: 320 }}>
          <label htmlFor="fakebrands_id">Marcas *</label>
          <input
            list="search_fakebrands_id"
            name="fakebrands_id"
            onChange={onResolveChangeBrands}
            defaultValue={resolveSelectBrand}
            type="search"
          />
          <datalist id="search_fakebrands_id">
            {brandsAll &&
              brandsAll.map(brand => (
                <option value={brand.name} key={brand.id} />
              ))}
          </datalist>

          <small>{errors.brands_id && 'Campo obrigatório!'}</small>
        </div>

        <div className="form-input" style={{ width: 320 }}>
          <label htmlFor="fakecategory_id">Categorias *</label>
          <input
            list="search_fakecategory_id"
            name="fakecategory_id"
            onChange={onResolveChangeCategories}
            defaultValue={resolveSelectCategory}
            type="search"
          />
          <datalist id="search_fakecategory_id">
            {categoriesAll &&
              categoriesAll.map(category => (
                <option value={category.name} key={category.id} />
              ))}
          </datalist>

          <small>{errors.brands_id && 'Campo obrigatório!'}</small>
        </div>

        <div className="form-input" style={{ width: '100%' }}>
          <label htmlFor="description">Descrição</label>
          <input
            type="text"
            {...register('description', {
              required: false,
            })}
            className={errors.description && 'input-invalid'}
          />
          <small>{errors.description && 'Campo obrigatório!'}</small>
        </div>
        <div className="form-input" style={{ width: '100%' }}>
          <label htmlFor="description">Descrição Texto</label>
          <input
            type="text"
            {...register('description_text', {
              required: false,
            })}
            className={errors.description_text && 'input-invalid'}
          />
          <small>{errors.description_text && 'Campo obrigatório!'}</small>
        </div>
      </form>
    </div>
  );
}
