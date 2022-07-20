import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Loading } from '../../components/Loading';
import { ICustomer, ICustomers } from '../../types/Customer';
import { api } from '../../api/api';

export function CustomersForm() {
  const { id: customerId } = useParams<{ [key: string]: '' }>();

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICustomer>();

  const [{ customer, loading }, fetch] = useState<ICustomers<ICustomer>>({
    customer: {} as ICustomer,
    loading: true,
    error: '',
  });

  useEffect(() => {
    (async () => {
      if (customerId) {
        await api.get(`/customers/${customerId}`).then(async res =>
          fetch({
            customer: await res.data,
            loading: false,
            error: '',
          }),
        );
      }
    })();
  }, [fetch, customerId]);

  useEffect(() => {
    const url = pathname.split('/');
    if (customer.id) {
      reset(customer);
      if (url[url.length - 1] === 'new') {
        navigate(`/customers/${customer.id}/edit`);
      }
    }
  }, [customer]);

  const onSubmit: SubmitHandler<ICustomer> = async data => {
    let promiseCustomer;

    const { name, email, cpf, cnpj, phone, avatar } = data;

    if (data.id) {
      promiseCustomer = api
        .put(`/customers/${customerId}`, {
          name,
          email,
          cpf,
          cnpj,
          phone,
        })
        .then(async res =>
          fetch({
            customer: await res.data,
            loading: false,
            error: '',
          }),
        );
    } else {
      promiseCustomer = api
        .post(`/customers`, {
          name,
          email,
          cpf,
          cnpj,
          phone,
        })
        .then(async res =>
          fetch({
            customer: await res.data,
            loading: false,
            error: '',
          }),
        );
    }

    toast.promise(promiseCustomer, {
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
        <h1>Clientes {customer.name}</h1>
        <span>
          <Link to="/customers" className="btn btn-default">
            voltar <i className="fa-solid fa-undo"></i>
          </Link>
          <button form="customers" type="submit" className="btn btn-primary">
            salvar <i className="fa-solid fa-pen-to-square"></i>
          </button>
        </span>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-style form-customer"
        id="customers"
      >
        <div className="form-input flex-7">
          <label htmlFor="name">Nome *</label>
          <input
            type="text"
            {...register('name', { required: true })}
            className={errors.name && 'input-invalid'}
          />
          <small>{errors.name && 'Campo obrigatório!'}</small>
        </div>
        <div className="form-input flex-6">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            {...register('email', {
              required: true,
            })}
            className={errors.email && 'input-invalid'}
          />
          <small>{errors.email && 'Campo obrigatório!'}</small>
        </div>
        <div className="flex-12"></div>
        {/* {!customer.id && (
          <div className="form-input" style={{ width: 420 }}>
            <label htmlFor="password">Senha *</label>
            <input
              type="password"
              {...register('password', {
                required: true,
              })}
              className={errors.password && 'input-invalid'}
            />
            <small>{errors.password && 'Campo obrigatório!'}</small>
          </div>
        )} */}

        <div className="form-input flex-3">
          <label htmlFor="cpf">CPF *</label>
          <input
            type="tel"
            {...register('cpf', { required: true })}
            className={errors.cpf && 'input-invalid'}
          />
          <small>{errors.cpf && 'Campo obrigatório!'}</small>
        </div>
        <div className="form-input flex-3">
          <label htmlFor="birth_date">Data Aniversário ?</label>
          <input type="date" {...register('birth_date')} />
        </div>
      </form>
    </div>
  );
}
