import { useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useLocalStorage } from '../../hooks/useStorage';
import { toast } from 'react-toastify';
import { Alert } from '../../components/Alert';
import { Loading } from '../../components/Loading';
import { BrandList } from '../../context/BrandsContext';
import { useBrands } from '../../hooks/useBrands';

export function BrandsForm() {
  const { id } = useParams<string>();

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const brandId: string = id !== undefined ? id : '';

  // Similar to useState but first arg is key to the value in local storage.
  const [storage, setStorage] = useLocalStorage(`@brands`, {} as BrandList);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BrandList>();

  const { brand, loading, error, fetchFindBrand, editBrand, addBrand } =
    useBrands();

  useEffect(() => {
    fetchFindBrand(brandId);
  }, [brandId]);

  useEffect(() => {
    const url = pathname.split('/');
    if (brand.id) {
      setStorage(brand);
      if (url[url.length - 1] === 'new') {
        navigate(`/brands/${brand.id}/edit`);
      }
    }
  }, [brand]);

  const onSubmit: SubmitHandler<BrandList> = async data => {
    let promiseBrands: Promise<void> = {} as Promise<void>;
    if (brand.id) {
      promiseBrands = editBrand(brand.id, data);
    } else {
      promiseBrands = addBrand(data);
    }

    toast.promise(promiseBrands, {
      pending: 'Um momento por favor...',
      success: 'Dados salvos com sucesso!',
      error: 'Algo deu errado, tente novamente!',
    });
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
        <h1>{storage.name}</h1>
        <span>
          <Link to="/brands" className="btn btn-default">
            voltar <i className="fa-solid fa-undo"></i>
          </Link>
          <button
            form="customers"
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
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

        <div style={{ width: '100%' }} />
        <div className="form-input" style={{ width: 320 }}>
          <label htmlFor="activeda">Ativa/Desativa</label>
          <select
            {...register('actived', { required: false })}
            className={errors.actived && 'input-invalid'}
            defaultValue={storage.actived || 'yes'}
            onChange={e =>
              setStorage({ ...storage, ['actived']: e.target.value })
            }
          >
            <option value="no">Não</option>
            <option value="yes">Sim</option>
          </select>
          <small>{errors.discount_type && 'Campo obrigatório!'}</small>
        </div>
        <div className="form-input" style={{ width: 320 }}>
          <label htmlFor="discount_type">Tipo de Desconto</label>
          <select
            {...register('discount_type', { required: false })}
            className={errors.discount_type && 'input-invalid'}
            defaultValue={storage.discount_type || '$'}
            onChange={e =>
              setStorage({ ...storage, ['discount_type']: e.target.value })
            }
          >
            <option value="$">Em Real</option>
            <option value="%">Em Porcentagem</option>
          </select>
          <small>{errors.discount_type && 'Campo obrigatório!'}</small>
        </div>

        <div className="form-input" style={{ width: 320 }}>
          <label htmlFor="discount_value">Vl. Desconto</label>
          <input
            type="tel"
            {...register('discount_value', {
              required: false,
            })}
            className={errors.discount_value && 'input-invalid'}
            value={storage.discount_value || 0.0}
            onChange={e =>
              setStorage({ ...storage, ['discount_value']: e.target.value })
            }
          />
          <small>{errors.discount_value && 'Campo obrigatório!'}</small>
        </div>

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
