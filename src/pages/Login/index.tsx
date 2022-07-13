import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { login, logout } from '../../api/auth';
import Loading from '../../components/Loading';
import api from '../../api/api';
import './style.scss';

type ILogin = {
  email: string;
  connect: string;
  password: string;
  scope: [];
};

const LogOut = () => {
  const { push } = useHistory();
  logout();
  push('/login');
  return <Loading />;
};

const LogIn = () => {
  const { push } = useHistory();

  const toastRef = useRef<HTMLDivElement>(null);
  const myToast = toastRef.current;

  const [toastMessage, setToastMessage] = useState('');

  const closeToast = (): void => {
    if (myToast) myToast.classList.add('hide');
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>();

  const onSubmit = async (data: ILogin) => {
    if (myToast) {
      myToast.classList.remove('bg-danger', 'show');
    }

    await api
      .post('/auth', data)
      .then((resp: { data: { token: any } }) => {
        const { token } = resp.data;

        if (myToast) myToast.classList.add('show', 'bg-info');

        setToastMessage('Fazendo login...');

        login(token);

        setTimeout(() => {
          push('/dashboard');
        }, 1000);
      })
      .catch((err: { response: { data: { message: any } } }) => {
        const { message } = err.response.data;

        if (myToast) myToast.classList.add('show', 'bg-danger');

        setToastMessage(message);
      });
  };

  return (
    <form
      className="form-login-adm needs-validation"
      style={{ backgroundImage: 'url(/Fundo-Login.jpg)' }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <h1>Painel Adminstrativo</h1>

        <div className="mb-2">
          <label className="form-label" htmlFor="idConnect">
            ID de Acesso
          </label>
          <input
            type="text"
            id="idConnect"
            className={`form-control ${errors.connect && 'is-invalid'}`}
            {...register('connect', {
              required: 'Campo obrigatório',
            })}
          />
          {errors.connect && (
            <div className="invalid-feedback">{errors.connect.message}</div>
          )}
        </div>
        <div className="mb-2">
          <label className="form-label" htmlFor="emailConnect">
            E-mail de Acesso
          </label>
          <input
            type="email"
            id="emailConnect"
            className={`form-control ${errors.email && 'is-invalid'}`}
            {...register('email', {
              required: 'Campo obrigatório',
            })}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="passConnect">
            Senha de Acesso
          </label>
          <input
            type="password"
            id="passConnect"
            className={`form-control ${errors.password && 'is-invalid'}`}
            {...register('password', {
              required: 'Campo obrigatório',
            })}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password.message}</div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-store text-uppercase"
          style={{
            width: '100%',
            display: 'block',
          }}
        >
          fazer login
        </button>

        <div
          ref={toastRef}
          className="toast position-absolute top-0 end-0 m-4 text-white border-0"
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">{toastMessage && toastMessage}</div>
            <button
              type="submit"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={closeToast}
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </form>
  );
};

export { LogIn, LogOut };
