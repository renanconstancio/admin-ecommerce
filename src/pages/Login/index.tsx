import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import './style.scss';

type LoginType = {
  email: string;
  password: string;
};

export const LogIn: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>();

  const onSubmit = async (data: LoginType) => {
    try {
      setLoading(true);
      await login(data);
    } catch (error) {
      alert('Combinação incorreta de e-mail/senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="form-login"
      style={{ backgroundImage: 'url(/src/assets/Fundo-Login.jpg)' }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="form-style">
        <h1 className="form-input flex-12">Painel Adminstrativo</h1>

        <div className="form-input flex-12 mr-clear">
          <label htmlFor="email">E-mail de Acesso</label>
          <input
            id="email"
            type="email"
            className={`${errors.email && 'input-invalid'}`}
            {...register('email', {
              required: 'Campo obrigatório',
            })}
          />
          {errors.email && <small>{errors.email.message}</small>}
        </div>

        <div className="form-input flex-12 mr-clear">
          <label htmlFor="password">Senha de Acesso</label>
          <input
            id="password"
            type="password"
            className={`${errors.password && 'input-invalid'}`}
            {...register('password', {
              required: 'Campo obrigatório',
            })}
          />
          {errors.password && <small>{errors.password.message}</small>}
        </div>
        <div className="form-input flex-12 mr-clear">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-loading text-uppercase flex-12"
            style={{
              marginTop: 16,
              padding: 12,
            }}
          >
            fazer login
          </button>
        </div>
      </div>
      <Helmet>
        <title>Login - Administrativo</title>
      </Helmet>
    </form>
  );
};
