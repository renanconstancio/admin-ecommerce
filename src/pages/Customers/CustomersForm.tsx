import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCustomer } from '../../hooks/useCustomers';
import { useForm, SubmitHandler } from 'react-hook-form';
import { CustomerList } from '../../context/CustomersContext';
import { useLocalStorage } from '../../hooks/useStorage';
import { toast } from 'react-toastify';
import { TextError } from '../../components/TextError';
import { Loading } from '../../components/Loading';

export function CustomersForm() {
  const { id } = useParams<string>();

  const customerId: string = id !== undefined ? id : '';

  // Similar to useState but first arg is key to the value in local storage.
  const [storage, setStorage] = useLocalStorage(
    `@customers${customerId}`,
    {} as CustomerList,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerList>();

  const {
    customer,
    loading,
    error,
    fetchFindCustomer,
    addCustomer,
    editCustomer,
  } = useCustomer();

  useEffect(() => {
    fetchFindCustomer(customerId);
  }, [customerId]);

  useEffect(() => {
    if (customer.id) {
      console.log(storage);

      return setStorage(customer);
    }
  }, [customer]);

  const onSubmit: SubmitHandler<CustomerList> = async data => {
    let promiseCustomers: Promise<void> = {} as Promise<void>;
    if (customer.id) {
      promiseCustomers = editCustomer(customer.id, data);
    } else {
      promiseCustomers = addCustomer(data);
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
      {error ? <TextError text={error} /> : null}
      <div className="help-buttons-flex">
        <h1>Clientes {storage.first_name}</h1>
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
            defaultValue={storage.first_name}
            onChange={e =>
              setStorage({ ...storage, ['first_name']: e.target.value })
            }
          />
          <small>{errors.first_name && 'Campo obrigatório!'}</small>
        </div>

        <div className="form-input" style={{ width: 320 }}>
          <label htmlFor="last_name">Sobrenome ?</label>
          <input
            type="text"
            {...register('last_name', { required: false })}
            className={errors.last_name && 'input-invalid'}
            defaultValue={storage.last_name}
            onChange={e =>
              setStorage({ ...storage, ['last_name']: e.target.value })
            }
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
            defaultValue={storage.email}
            onChange={e =>
              setStorage({ ...storage, ['email']: e.target.value })
            }
          />
          <small>{errors.email && 'Campo obrigatório!'}</small>
        </div>
        <div className="form-input" style={{ width: 420 }}>
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            {...register('password', {
              required: true,
            })}
            className={errors.password && 'input-invalid'}
            // defaultValue={storage.password}
            onChange={e =>
              setStorage({ ...storage, ['password']: e.target.value })
            }
          />
          <small>{errors.password && 'Campo obrigatório!'}</small>
        </div>
        <div className="form-input">
          <label htmlFor="cpf">CPF *</label>
          <input
            type="tel"
            {...register('cpf', { required: true })}
            className={errors.cpf && 'input-invalid'}
            defaultValue={storage.cpf}
            onChange={e => setStorage({ ...storage, ['cpf']: e.target.value })}
          />
          <small>{errors.cpf && 'Campo obrigatório!'}</small>
        </div>
        <div className="form-input">
          <label htmlFor="birth_date">Data Aniversário ?</label>
          <input
            type="date"
            {...register('birth_date')}
            defaultValue={storage.birth_date}
            onChange={e =>
              setStorage({ ...storage, ['birth_date']: e.target.value })
            }
          />
        </div>
      </form>
    </div>
  );
}
