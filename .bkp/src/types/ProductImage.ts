export interface IProductImage {
  image_url: string;
  image_md: string;
  image_xs: string;
}

export interface IProductsImages<T> {
  product: T;
  loading: boolean;
  error: string;
}
