import React, { createContext, useEffect, useState } from 'react';
import { api } from '../api/api';

interface IAuthContextData {
  signed: boolean;
  user: object | null;
  login(user: object): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<object | null>(null);

  useEffect(() => {
    const storagedUser = sessionStorage.getItem('@App:user');
    const storagedToken = sessionStorage.getItem('@App:token');

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

        sessionStorage.setItem('@App:user', JSON.stringify(customer));
        sessionStorage.setItem('@App:token', token);

        setUser(customer);
        login(token);
      })
      .catch((err: { response: { data: { message: any } } }) => {
        const { message } = err.response.data;
        throw new Error(message);
      });
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('@App:user');
    sessionStorage.removeItem('App:token');
  };

  return (
    <AuthContext.Provider
      value={{ signed: Boolean(user), user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
