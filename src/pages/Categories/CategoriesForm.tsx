import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { price } from '../../utils';
import { IBrandItems } from '../../context/BrandsContext';
import { ICategory, ICategories } from '../../types/Category';
import { toast } from 'react-toastify';
import api from '../../api/api';

export function CategoriesForm() {
  const { id } = useParams<string>();

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const categoryId: string = id !== undefined ? id : '';

  const {
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICategory>({
    defaultValues: {} as ICategory,
    mode: 'onChange',
  });

  const [{ category, loading }, fetch] = useState<ICategories<ICategory>>({
    category: {} as ICategory,
    loading: true,
    error: '',
  });

  useEffect(() => {
    (async () => {
      if (categoryId) {
        await api.get(`/categories/${categoryId}`).then(async res =>
          fetch({
            category: await res.data,
            loading: false,
            error: '',
          }),
        );
      }
    })();
  }, [fetch, categoryId]);

  useEffect(() => {
    const url = pathname.split('/');
    if (category.id) {
      reset(category);
      if (url[url.length - 1] === 'new') {
        navigate(`/categories/${category.id}/edit`);
      }
    }
  }, [category]);

  const onSubmit: SubmitHandler<ICategory> = async data => {
    let promiseCategory: any;

    const { description, keywords, name, position } = data;

    if (data.id) {
      promiseCategory = api
        .put(`/categories/${categoryId}`, {
          description,
          keywords,
          name,
          position: Number(position),
        })
        .then(async res =>
          fetch({
            category: await res.data,
            loading: false,
            error: '',
          }),
        );
    } else {
      promiseCategory = api
        .post(`/categories`, {
          description,
          keywords,
          name,
          position: Number(position),
        })
        .then(async res =>
          fetch({
            category: await res.data,
            loading: false,
            error: '',
          }),
        );
    }

    toast.promise(promiseCategory, {
      pending: 'Um momento por favor...',
      success: 'Dados salvos com sucesso!',
      error: 'Algo deu errado, tente novamente!',
    });
  };

  return (
    <div className="content">
      <div className="help-buttons-flex">
        <h1>{category?.name}</h1>
        <span>
          <Link to="/categories" className="btn btn-default">
            voltar <i className="fa-solid fa-undo"></i>
          </Link>
          <button
            form="categories"
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
        className="form-style form-category"
        id="categories"
      >
        <div className="form-input flex-4">
          <label htmlFor="name">Nome *</label>
          <input
            type="text"
            {...register('name', { required: 'Campo obrigatório!' })}
            className={errors.name && 'input-invalid'}
          />
          <small>{errors.name && errors.name.message}</small>
        </div>
        <div className="form-input flex-1">
          <label htmlFor="name">Posição *</label>
          <input
            type="text"
            {...register('position', { required: false })}
            className={errors.position && 'input-invalid'}
          />
          <small>{errors.position && errors.position.message}</small>
        </div>

        <div className="form-input flex-7">
          <label htmlFor="description">Keywords</label>
          <input
            type="keywords"
            {...register('keywords', {
              required: false,
            })}
            className={errors.keywords && 'input-invalid'}
          />
          <small>{errors.keywords && 'Campo obrigatório!'}</small>
        </div>
        <div className="form-input flex-7">
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
