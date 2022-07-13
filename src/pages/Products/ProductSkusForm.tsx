import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Loading } from '../../components/Loading';
import { IProduct, IProducts } from '../../types/Product';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'react-toastify';
import api from '../../api/api';

export function ProductSkusForm() {
  const { id } = useParams<string>();

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const productId: string = id !== undefined ? id : '';

  const editorRef = useRef(null);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IProduct>({
    defaultValues: {} as IProduct,
    mode: 'onChange',
  });

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
        navigate(`/products/${product.id}/edit`);
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
          <Link
            to={`/products/${product.id}/photos`}
            className="btn btn-default"
          >
            Fotos <i className="fa-solid fa-photo-film"></i>
          </Link>
          <Link to={`/products/${product.id}/skus`} className="btn btn-default">
            SKUs <i className="fa-solid fa-box"></i>
          </Link>
          <Link to="/products" className="btn btn-default">
            voltar <i className="fa-solid fa-undo"></i>
          </Link>
          <button form="products" type="submit" className="btn btn-primary">
            salvar <i className="fa-solid fa-pen-to-square"></i>
          </button>
        </span>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-style form-product"
        id="products"
      >
        <div className="form-input flex-1">
          <label htmlFor="sku">SKU *</label>
          <input
            type="text"
            {...register('sku', { required: 'Campo obrigatório!' })}
            className={errors.sku && 'input-invalid'}
          />
          <small>{errors.sku && errors.sku.message}</small>
        </div>
        <div className="form-input flex-1">
          <label htmlFor="quantity">Preço *</label>
          <input
            type="number"
            {...register('quantity', { required: 'Campo obrigatório!' })}
            className={errors.quantity && 'input-invalid'}
          />
          <small>{errors.quantity && errors.quantity.message}</small>
        </div>
        <div className="form-input flex-1">
          <label htmlFor="quantity">Estoque *</label>
          <input
            type="number"
            {...register('quantity', { required: 'Campo obrigatório!' })}
            className={errors.quantity && 'input-invalid'}
          />
          <small>{errors.quantity && errors.quantity.message}</small>
        </div>
        <div className="form-input flex-7">
          <label htmlFor="name">Nome *</label>
          <input
            type="text"
            {...register('name', { required: 'Campo obrigatório!' })}
            className={errors.name && 'input-invalid'}
          />
          <small>{errors.name && errors.name.message}</small>
        </div>

        <div className="form-input flex-12">
          <label htmlFor="description">Descrição</label>
          <Editor
            apiKey={`${import.meta.env.VITE_KEY_TINYMCE}`}
            // onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue={product.description}
            {...register('description', {
              required: false,
            })}
            init={{
              height: 400,
              menubar: false,
              plugins: [
                'advlist',
                'autolink',
                'lists',
                'link',
                'image',
                'charmap',
                'preview',
                'anchor',
                'searchreplace',
                'visualblocks',
                'code',
                'fullscreen',
                'insertdatetime',
                'media',
                'table',
                'code',
                'help',
                'wordcount',
              ],
              toolbar:
                'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
              content_style:
                'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}
          />
          <small>{errors.description && 'Campo obrigatório!'}</small>
        </div>
      </form>
    </div>
  );
}
