import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';

import {
  useForm,
  SubmitHandler,
  useFieldArray,
  Controller,
} from 'react-hook-form';
import { Loading } from '../../components/Loading';
import { IProduct, IProducts } from '../../types/Product';
import { toast } from 'react-toastify';
import { IProductSku } from '../../types/ProductSku';
import { Helmet } from 'react-helmet-async';
import api from '../../api/api';

export function ProductImagesForm() {
  const { id: productId, idsku: productSkuId } =
    useParams<{ [key: string]: '' }>();

  const { pathname } = useLocation();

  const navigate = useNavigate();

  // const productId: string = id !== undefined ? id : '';

  // const productSkuId: string = idsku !== undefined ? idsku : '';

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
      control,
      name: 'skus',
      keyName: '_id',
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
        await api
          .get(`/products/${productId}/skus/${productSkuId}`)
          .then(async resp =>
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
        navigate(
          `/products/${product.id}/skus/${product.skus?.[0]?.id}/images`,
        );
      }
    }
  }, [product]);

  const onSubmit: SubmitHandler<IProduct> = async data => {
    let promiseProduct;
    const skusList = data?.skus ?? [];
    // eslint-disable-next-line prefer-const
    promiseProduct = (async () => {
      for (const {
        id,
        product_id,
        cost_price,
        price,
        quantity,
        sale_price,
        sku,
      } of skusList) {
        if (product_id && id) {
          await api.put(`/products/${product_id}/skus/${id}`, {
            price,
            cost_price,
            sale_price,
            quantity,
            sku,
          });
        } else {
          await api.post(`/products/${product.id}/skus`, {
            price,
            cost_price,
            sale_price,
            quantity,
            sku,
          });
        }
      }
    })();

    toast.promise(promiseProduct, {
      pending: 'Um momento por favor...',
      success: 'Dados salvos com sucesso!',
      error: 'Algo deu errado, tente novamente!',
    });
  };

  const resolveDelete = async ({ id, product_id, sku }: IProductSku) => {
    if (!confirm(`Deseja realmente excluir ${sku}!`)) return;

    toast.promise(
      api.delete(`/products/${product_id}/skus/${id}`).then(() => {
        const index = product.skus?.findIndex(obj => obj.id === id, id);
        remove(index);
      }),
      {
        pending: 'Um momento por favor...',
        success: 'Removido com sucesso!',
        error: 'Algo deu errado, tente novamente!',
      },
    );
  };

  return (
    <div className="content">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div
            className="help-buttons-flex"
            style={{ borderBottom: 'solid 1px #f1f1f1', paddingBottom: 16 }}
          >
            <h1>
              {product?.name} {product.skus?.[0].sku}
            </h1>
            <span>
              <Link
                to={`/products/${product.id}/skus`}
                className="btn btn-default"
              >
                voltar <i className="fa-solid fa-undo"></i>
              </Link>
              <button
                type="button"
                className="btn btn-info"
                onClick={() => append({} as IProductSku)}
              >
                adicionar <i className="fa-solid fa-image"></i>
              </button>
              <button
                type="submit"
                form="products-images"
                className="btn btn-primary"
              >
                enviar <i className="fa-solid fa-upload"></i>
              </button>
            </span>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="form-style form-product-images"
            id="products-images"
          >
            <ul
              className="flex flex-12"
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexWrap: 'wrap',
                borderBottom: 'solid 1px #f1f1f1',
                padding: '0 0 16px 0',
              }}
            >
              {product.skus?.[0].images?.map((img, index) => (
                <li key={index} className="flex-2">
                  <img
                    src={img.image_xs}
                    alt={img.image_xs}
                    style={{ width: '100%' }}
                  />
                  {/* <span
                    // onClick={() => resolveDelete(field)}
                    className="btn btn-danger"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </span>
                  <Link
                    to={`/products/${product.id}/skus`}
                    className="btn btn-primary"
                  >
                    <i className="fa-solid fa-photo-film"></i>
                  </Link> */}
                </li>
              ))}
            </ul>
          </form>
        </>
      )}
      <Helmet>
        <title>Produtos/Skus - Editar/Cadastrar</title>
      </Helmet>
    </div>
  );
}
