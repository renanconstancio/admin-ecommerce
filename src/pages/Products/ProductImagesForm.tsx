import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Loading } from '../../components/Loading';
import { IProduct, IProducts } from '../../types/Product';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { api } from '../../api/api';

import './style.scss';

function ListThumbs({
  img,
}: {
  img: { image_xs?: string; image_preview?: string };
}) {
  return (
    <li className="flex-2">
      <img src={img.image_xs} alt={img.image_xs} />
    </li>
  );
}

export function ProductImagesForm() {
  const [{ product, loading }, fetch] = useState<IProducts<IProduct>>({
    product: {} as IProduct,
    loading: true,
    error: '',
  });

  const { id: productId, idsku: productSkuId } =
    useParams<{ [key: string]: '' }>();

  const fetchApi = useCallback(
    async (productId: string, productSkuId: string) => {
      await api
        .get(`/products/${productId}/skus/${productSkuId}`)
        .then(async ({ data }) => {
          fetch({
            product: await data,
            loading: false,
            error: '',
          });
        });
    },
    [],
  );

  const resolveUploadImages = useCallback(async acceptedFiles => {
    toast.promise(
      async (): Promise<void> => {
        for (const file of acceptedFiles) {
          const formData = new FormData();
          formData.append('image', file);
          formData.append('product_sku_id', productSkuId ?? '');
          await api.patch('products/images', formData);
        }

        if (productId && productSkuId) await fetchApi(productId, productSkuId);
      },
      {
        pending: 'Um momento por favor...',
        success: 'Imagem(ns) cadastrada com sucesso!',
        error: 'Algo deu errado, tente novamente!',
      },
    );
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 8,
    accept: {
      'image/*': [],
    },
    onDrop: resolveUploadImages,
  });

  useEffect(() => {
    if (productId && productSkuId) fetchApi(productId, productSkuId);
  }, [productId, productSkuId]);

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
              <span
                {...getRootProps({ className: 'dropzone' })}
                className="btn btn-info"
              >
                <input {...getInputProps()} multiple />
                adicionar <i className="fa-solid fa-image"></i>
              </span>
            </span>
          </div>
          <form className="form-style form-product-images" id="products-images">
            <ul
              className="flex flex-12"
              style={{
                alignItems: 'center',
                flexWrap: 'wrap',
                borderBottom: 'solid 1px #f1f1f1',
                padding: '0 0 16px 0',
              }}
            >
              {/* resolve images to product skus */}
              {product.skus?.[0]?.images?.map((items, index) => (
                <ListThumbs img={items} key={index} />
              ))}
            </ul>
          </form>
        </>
      )}
      <Helmet>
        <title>Produtos/Skus/Fotos - Editar/Cadastrar</title>
      </Helmet>
    </div>
  );
}
