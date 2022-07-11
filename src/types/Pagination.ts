export interface IPagination<T> {
  total: number;
  per_page: number;
  current_page: number;
  data: T[] | [];
}
