import { useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useBrands } from '../../hooks/useBrands';
import { price } from '../../utils';
import { IBrandItems } from '../../context/BrandsContext';
import { toast } from 'react-toastify';

export function BrandsForm() {
  const { id } = useParams<string>();

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const brandId: string = id !== undefined ? id : '';

  const {
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IBrandItems>({
    defaultValues: {} as IBrandItems,
    mode: 'onChange',
  });

  const { brand, loading, findBrand, editBrand, addBrand } = useBrands();

  useEffect(() => {
    findBrand(brandId);
  }, [brandId]);

  useEffect(() => {
    const url = pathname.split('/');
    if (brand.id) {
      reset(brand);
      if (url[url.length - 1] === 'new') {
        navigate(`/brands/${brand.id}/edit`);
      }
    }
  }, [brand]);

  const onSubmit: SubmitHandler<IBrandItems> = async data => {
    let promiseBrands: Promise<void> = {} as Promise<void>;
    const { name, description, discount_value, discount_type, actived } = data;
    if (brand.id) {
      promiseBrands = editBrand(brand.id, {
        name,
        description,
        discount_value,
        discount_type,
        actived,
      });
    } else {
      promiseBrands = addBrand({
        name,
        description,
        discount_value,
        discount_type,
        actived,
      });
    }

    toast.promise(promiseBrands, {
      pending: 'Um momento por favor...',
      success: 'Dados salvos com sucesso!',
      error: 'Algo deu errado, tente novamente!',
    });
  };

  return (
    <div className="content">
      <div className="help-buttons-flex">
        <h1>{brand?.name}</h1>
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
            {...register('name', { required: 'Campo obrigatório!' })}
            className={errors.name && 'input-invalid'}
          />
          <small>{errors.name && errors.name.message}</small>
        </div>

        <div style={{ width: '100%' }} />
        <div className="form-input" style={{ width: 320 }}>
          <label htmlFor="activeda">Ativa/Desativa</label>
          <select
            {...register('actived', { required: false })}
            className={errors.actived && 'input-invalid'}
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
            onChange={e =>
              setValue('discount_value', price(e.currentTarget.value))
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
          />
          <small>{errors.description && 'Campo obrigatório!'}</small>
        </div>
      </form>
    </div>
  );
}
