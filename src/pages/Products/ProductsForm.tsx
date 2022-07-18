import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Loading } from '../../components/Loading';
import { IProduct, IProducts } from '../../types/Product';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { api } from '../../api/api';

export function ProductsForm() {
  const { id: productId } = useParams<{ [key: string]: '' }>();

  const { pathname } = useLocation();

  const navigate = useNavigate();

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

    const { description, name, description_text, keywords, visible } = data;

    if (data.id) {
      promiseProduct = api
        .put(`/products/${productId}`, {
          description,
          name,
          description_text,
          keywords,
          visible,
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
        .post(`/products`, {
          description,
          name,
          description_text,
          keywords,
          visible,
        })
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

  return (
    <div className="content">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="help-buttons-flex">
            <h1>{product?.name}</h1>
            <span>
              {/* <Link
                to={`/products/${product.id}/photos`}
                className="btn btn-default"
              >
                Fotos <i className="fa-solid fa-photo-film"></i>
              </Link> */}
              <Link to="/products" className="btn btn-default">
                voltar <i className="fa-solid fa-undo"></i>
              </Link>
              <Link
                to={`/products/${product.id}/skus`}
                className="btn btn-info"
              >
                SKUs <i className="fa-solid fa-box"></i>
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
            <div className="form-input flex-7">
              <label htmlFor="name">Nome *</label>
              <input
                type="text"
                {...register('name', { required: 'Campo obrigatório!' })}
                className={errors.name && 'input-invalid'}
              />
              <small>{errors.name && errors.name.message}</small>
            </div>
            <div className="form-input flex-2">
              <label htmlFor="visible">Produto Ativo</label>
              <select
                {...register('visible', { required: 'Campo obrigatório!' })}
                id="visible"
                className={errors.visible && 'input-invalid'}
                defaultValue={product.visible}
              >
                <option value="invisible">Não</option>
                <option value="visible">Sim</option>
              </select>
              {/* <input
                type="text"
                {...register('visible', { required: 'Campo obrigatório!' })}
              /> */}
              <small>{errors.visible && errors.visible.message}</small>
            </div>
            <div className="form-input flex-7">
              <label htmlFor="sku">KEYWORDS</label>
              <input
                type="text"
                {...register('keywords', { required: 'Campo obrigatório!' })}
                className={errors.keywords && 'input-invalid'}
              />
              <small>{errors.keywords && errors.keywords.message}</small>
            </div>
            <div className="form-input flex-12">
              <label htmlFor="quantity">DESCRIPTION *</label>
              <input
                type="text"
                {...register('description', { required: 'Campo obrigatório!' })}
                className={errors.description && 'input-invalid'}
              />
              <small>{errors.description && errors.description.message}</small>
            </div>

            <div className="form-input flex-12">
              <label htmlFor="description_text">Descrição</label>
              <Editor
                apiKey={`${import.meta.env.VITE_KEY_TINYMCE}`}
                initialValue={product.description_text}
                {...register('description_text', {
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
        </>
      )}
      <Helmet>
        <title>Produtos - Editar/Cadastrar</title>
      </Helmet>
    </div>
  );
}
