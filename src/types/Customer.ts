export interface ICustomer {
  id: string;
  name: string;
  email: string;
  cpf: string;
  cnpj: string;
  phone: string;
  avatar: string | null;
  birth_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ICustomers<T> {
  customer: T;
  loading: boolean;
  error: string;
}
