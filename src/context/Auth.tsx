import React, { createContext, useEffect, useState } from 'react';
import { api } from '../api/api';

interface IAuthContextData {
  signed: boolean;
  user: object | null;
  login(user: object): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

interface IAuthProvider {
  children: React.ReactNode;
}

export function AuthProvider({ children }: IAuthProvider) {
  const [user, setUser] = useState<object | null>(null);

  useEffect(() => {
    const storagedUser = sessionStorage.getItem('@app:user');
    const storagedToken = sessionStorage.getItem('@app:token');

    if (storagedToken && storagedUser) {
      setUser(JSON.parse(storagedUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${storagedToken}`;
    }
  }, []);

  const login = async (userData: object) => {
    await api
      .post('/sessions', userData)
      .then(async resp => {
        const { customer, token } = await resp.data;

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        sessionStorage.setItem('@app:user', JSON.stringify(customer));
        sessionStorage.setItem('@app:token', token);

        setUser(customer);
        login(token);
      })
      .catch((err: { response: { data: { message: any } } }) => {
        const { message } = err.response.data;
        throw new Error(message);
      });
  };

  const logout = () => {
    sessionStorage.removeItem('@app:user');
    sessionStorage.removeItem('app:token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ signed: Boolean(user), user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
