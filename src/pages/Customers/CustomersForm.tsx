import { useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCustomer } from '../../hooks/useCustomers';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Loading } from '../../components/Loading';
import {
  ICustomerItems,
  ICustomerRequest,
} from '../../context/CustomersContext';

export function CustomersForm() {
  const { id } = useParams<string>();

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const customerId: string = id !== undefined ? id : '';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICustomerItems>();

  const { customer, loading, fetchFindCustomer, addCustomer, editCustomer } =
    useCustomer();

  useEffect(() => {
    if (customerId) fetchFindCustomer(customerId);
  }, [customerId]);

  useEffect(() => {
    const url = pathname.split('/');
    if (customer.id) {
      reset(customer);
      if (url[url.length - 1] === 'new') {
        navigate(`/customers/${customer.id}/edit`);
      }
    }
  }, [customer]);

  const onSubmit: SubmitHandler<ICustomerRequest> = async data => {
    let promiseCustomers: Promise<void> = {} as Promise<void>;
    const {
      first_name,
      last_name,
      cpf,
      email,
      check_email,
      birth_date,
      password,
    } = data;
    if (customer.id) {
      promiseCustomers = editCustomer(customer.id, {
        first_name,
        last_name,
        cpf,
        email,
        check_email,
        birth_date,
        password,
      });
    } else {
      promiseCustomers = addCustomer({
        first_name,
        last_name,
        cpf,
        email,
        check_email,
        birth_date,
        password,
      });
    }

    toast.promise(promiseCustomers, {
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
        <h1>Clientes {customer.first_name}</h1>
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
        <div className="form-input" style={{ width: 375 }}>
          <label htmlFor="first_name">Nome *</label>
          <input
            type="text"
            {...register('first_name', { required: true })}
            className={errors.first_name && 'input-invalid'}
          />
          <small>{errors.first_name && 'Campo obrigatório!'}</small>
        </div>

        <div className="form-input" style={{ width: 320 }}>
          <label htmlFor="last_name">Sobrenome ?</label>
          <input
            type="text"
            {...register('last_name', { required: false })}
            className={errors.last_name && 'input-invalid'}
          />
          <small>{errors.last_name && 'Campo obrigatório!'}</small>
        </div>
        <div className="form-input" style={{ width: 420 }}>
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

        {!customer.id && (
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
        )}

        <div className="form-input">
          <label htmlFor="cpf">CPF *</label>
          <input
            type="tel"
            {...register('cpf', { required: true })}
            className={errors.cpf && 'input-invalid'}
          />
          <small>{errors.cpf && 'Campo obrigatório!'}</small>
        </div>
        <div className="form-input">
          <label htmlFor="birth_date">Data Aniversário ?</label>
          <input type="date" {...register('birth_date')} />
        </div>
      </form>
    </div>
  );
}
