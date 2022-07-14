import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  Controller,
} from 'react-hook-form';
import { Loading } from '../../components/Loading';
import { IProduct, IProducts } from '../../types/Product';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'react-toastify';
import api from '../../api/api';
import { IProductSku } from '../../types/ProductSku';
import { formatPrice, price } from '../../utils';

export function ProductSkusForm() {
  const { id } = useParams<string>();

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const productId: string = id !== undefined ? id : '';

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IProduct>({
    defaultValues: {} as IProduct,
    mode: 'onChange',
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: 'skus', // unique name for your Field Array
    },
  );

  const [{ product, loading }, fetch] = useState<IProducts<IProduct>>({
    product: {} as IProduct,
    loading: false,
    error: '',
  });

  useEffect(() => {
    (async () => {
      if (productId) {
        await api.get(`/products/${productId}`).then(async resp =>
          fetch({
            product: await resp.data,
            error: '',
            loading,
          }),
        );
      }
    })();
  }, [fetch, productId]);

  useEffect(() => {
    const url = pathname.split('/');
    if (product.id) {
      reset(product);
      if (url[url.length - 1] === 'new') {
        navigate(`/products/${product.id}/skus`);
      }
    }
  }, [product]);

  const onSubmit: SubmitHandler<IProduct> = async data => {
    let promiseProduct;

    const { description, name, price, quantity, sku } = data;

    if (data.id) {
      promiseProduct = api
        .put(`/products/${productId}`, {
          description,
          name,
          price,
          quantity,
          sku,
        })
        .then(async res =>
          fetch({
            product: await res.data,
            loading,
            error: '',
          }),
        );
    } else {
      promiseProduct = api
        .post(`/products`, { description, name, price, quantity, sku })
        .then(async res =>
          fetch({
            product: await res.data,
            loading,
            error: '',
          }),
        );
    }

    toast.promise(promiseProduct, {
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
        <h1>{product?.name}</h1>
        <span>
          {/* <Link
            to={`/products/${product.id}/photos`}
            className="btn btn-default"
          >
            Fotos <i className="fa-solid fa-photo-film"></i>
          </Link> */}
          {/* <Link to={`/products/${product.id}/skus`} className="btn btn-default">
            SKUs <i className="fa-solid fa-box"></i>
          </Link> */}
          <Link to={`/products/${product.id}/edit`} className="btn btn-default">
            voltar <i className="fa-solid fa-undo"></i>
          </Link>

          <button
            type="button"
            className="btn btn-default"
            onClick={() => append({} as IProductSku)}
          >
            adicionar <i className="fa-solid fa-plus"></i>
          </button>

          <button
            type="submit"
            form="products-skus"
            className="btn btn-primary"
          >
            salvar <i className="fa-solid fa-pen-to-square"></i>
          </button>
        </span>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-style form-product-skus"
        id="products-skus"
      >
        {fields.map((field, index) => (
          <ul
            className="flex flex-12"
            key={index}
            style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexWrap: 'wrap',
              borderBottom: 'solid 1px #f1f1f1',
              padding: '0 0 16px 0',
            }}
          >
            <li style={{ marginRight: 6 }}>
              <Link
                to={`/products/${product.id}/skus`}
                className="btn btn-danger"
              >
                <i className="fa-solid fa-trash"></i>
              </Link>
              <Link
                to={`/products/${product.id}/skus`}
                className="btn btn-primary"
              >
                <i className="fa-solid fa-photo-film"></i>
              </Link>
            </li>
            <li className="form-input flex-1">
              <label htmlFor="sku">SKU *</label>
              <input
                type="text"
                id={`${field.id}-sku`}
                {...register(`skus.${index}.sku`, {
                  required: 'Campo obrigatório!',
                })}
                className={errors.sku && 'input-invalid'}
              />
              <small>{errors.sku && errors.sku.message}</small>
            </li>
            <li className="form-input flex-1">
              <label htmlFor="sku">Preço Custo *</label>
              <Controller
                control={control}
                name={`skus.${index}.cost_price`}
                render={({ field: { onChange, value } }) => (
                  <input
                    type="tel"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                  />
                )}
              />

              <small>{errors.sku && errors.sku.message}</small>
            </li>
            <li className="form-input flex-1">
              <label htmlFor="sku">Preço Venda *</label>
              <input
                type="text"
                id={`${field.id}-sale`}
                {...register(`skus.${index}.sale_price`, {
                  required: 'Campo obrigatório!',
                })}
                className={errors.sku && 'input-invalid'}
              />
              <small>{errors.sku && errors.sku.message}</small>
            </li>
            <li className="form-input flex-1">
              <label htmlFor="sku">Preço *</label>
              <input
                type="text"
                id={`${field.id}-price`}
                {...register(`skus.${index}.price`, {
                  required: 'Campo obrigatório!',
                })}
                className={errors.sku && 'input-invalid'}
              />
              <small>{errors.sku && errors.sku.message}</small>
            </li>
            <li className="form-input flex-1">
              <label htmlFor="sku">Estoque *</label>
              <input
                type="text"
                id={`${field.id}-quantity`}
                {...register(`skus.${index}.quantity`, {
                  required: 'Campo obrigatório!',
                })}
                className={errors.sku && 'input-invalid'}
              />
              <small>{errors.sku && errors.sku.message}</small>
            </li>
          </ul>
        ))}
      </form>
    </div>
  );
}
