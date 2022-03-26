import { ChangeEvent, useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useLocalStorage } from '../../hooks/useStorage';
import { toast } from 'react-toastify';
import { Alert } from '../../components/Alert';
import { Loading } from '../../components/Loading';
import { ProductList } from '../../context/ProductsContext';
import { useProducts } from '../../hooks/useProducts';
import { useBrands } from '../../hooks/useBrands';

export function ProductsForm() {
  const { id } = useParams<string>();

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const [resolveSelectBrand, setResolveSelectBrand] = useState<string>('');

  const productId: string = id !== undefined ? id : '';

  // Similar to useState but first arg is key to the value in local storage.
  const [storage, setStorage] = useLocalStorage(`@products`, {} as ProductList);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductList>({ defaultValues: undefined });

  const { product, loading, error, fetchFindProduct, editProduct, addProduct } =
    useProducts();

  const { fetchBrands, brands } = useBrands();

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    fetchFindProduct(productId);
  }, [productId]);

  useEffect(() => {
    const url = pathname.split('/');
    if (product.id) {
      setStorage(product);
      if (url[url.length - 1] === 'new') {
        navigate(`/products/${product.id}/edit`);
      }
    }
  }, [product]);

  useEffect(() => {
    const brandSelect = brands.data?.find(
      item => item.id === storage.brands_id,
    );
    if (brandSelect !== undefined) {
      setResolveSelectBrand(brandSelect.name);
    }
  }, [brands, storage]);

  const onSubmit: SubmitHandler<ProductList> = async data => {
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

  const onResolveChangeBrands = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const brandResolve = brands.data.find(item => item.name === value);
    if (brandResolve !== undefined) {
      setStorage({
        ...storage,
        ['brands_id']: brandResolve.id,
      });
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="content">
      {error ? (
        <Alert onClose severity="warning">
          {error}
        </Alert>
      ) : null}
      <div className="help-buttons-flex">
        <h1>Produto {storage.name}</h1>
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
            defaultValue={storage.name}
            onChange={e => setStorage({ ...storage, ['name']: e.target.value })}
          />
          <small>{errors.name && 'Campo obrigatório!'}</small>
        </div>
        <div className="form-input" style={{ width: 175 }}>
          <label htmlFor="name">Em Estoque</label>
          <input
            readOnly
            type="text"
            onChange={e =>
              setStorage({ ...storage, ['in_stock']: e.target.value })
            }
          />
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
            {brands.data?.map(brand => (
              <option value={brand.name} key={brand.id} />
            ))}
          </datalist>
          {/* <label htmlFor="brands_id">Marcas *</label>
          <select
            {...register('brands_id', { required: false })}
            className={errors.brands_id && 'input-invalid'}
            defaultValue={storage.brands_id || ''}
            onChange={e =>
              setStorage({ ...storage, ['brands_id']: e.target.value })
            }
          >
            <option value="null">Selecione uma marca</option>
          </select>
          <small>{errors.brands_id && 'Campo obrigatório!'}</small> */}
        </div>

        {/* <div className="form-input" style={{ width: 320 }}>
          <label htmlFor="categories_id">Categoria *</label>
          <select
            {...register('categories_id', { required: false })}
            className={errors.categories_id && 'input-invalid'}
            defaultValue={storage.categories_id || ''}
            onChange={e =>
              setStorage({ ...storage, ['categories_id']: e.target.value })
            }
          >
            <option value="">Selecione uma Categoria</option>
          </select>
          <small>{errors.categories_id && 'Campo obrigatório!'}</small>
        </div> */}

        <div className="form-input" style={{ width: '100%' }}>
          <label htmlFor="description">Descrição</label>
          <input
            type="description"
            {...register('description', {
              required: false,
            })}
            className={errors.description && 'input-invalid'}
            defaultValue={storage.description}
            onChange={e =>
              setStorage({ ...storage, ['description']: e.target.value })
            }
          />
          <small>{errors.description && 'Campo obrigatório!'}</small>
        </div>
      </form>
    </div>
  );
}
