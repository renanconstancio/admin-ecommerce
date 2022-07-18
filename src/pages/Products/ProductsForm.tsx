import { useCallback, useEffect, useRef, useState } from 'react';
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

  const editorRef = useRef<any>(null);

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
    loading: true,
    error: '',
  });

  const fetchApi = useCallback(async (productId: string) => {
    await api.get(`/products/${productId}`).then(async ({ data }) => {
      fetch({
        error: '',
        product: await data,
        loading: false,
      });
      reset(await data);
    });
  }, []);

  useEffect(() => {
    if (productId) fetchApi(productId);
  }, [productId]);

  useEffect(() => {
    const url = pathname.split('/');
    if (product.id && url[url.length - 1] === 'new') {
      navigate(`/products/${product.id}/edit`);
    }
  }, [product]);

  const onSubmit: SubmitHandler<IProduct> = async data => {
    const { name, description, keywords, visible } = data;

    const newData = {
      name,
      visible,
      keywords,
      description,
      description_text: editorRef.current ? editorRef.current.getContent() : '',
    };

    const promiseProduct = (async () => {
      if (data.id) {
        await api
          .put(`/products/${productId}`, newData)
          .then(async ({ data }) => fetchApi(data.id));
      } else {
        await api
          .post(`/products`, newData)
          .then(async ({ data }) => fetchApi(data.id));
      }
    })();

    toast.promise(promiseProduct, {
      pending: 'Um momento por favor...',
      success: 'Dados salvos com sucesso!',
      error: 'Algo deu errado, tente novamente!',
    });
  };

  return (
    <div className="content">
      {loading && !product ? (
        <Loading />
      ) : (
        <>
          <div className="help-buttons-flex">
            <h1>{product?.name}</h1>
            <span>
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
                onInit={(evt, editor) => (editorRef.current = editor)}
                apiKey={`${import.meta.env.VITE_KEY_TINYMCE}`}
                initialValue={product.description_text}
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
              <small>{errors.description_text && 'Campo obrigatório!'}</small>
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
