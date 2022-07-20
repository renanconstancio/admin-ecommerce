import React, { createContext } from 'react';
import { useError } from '../hooks/useError';

export interface IError {
  code?: number;
  type?: string;
  server?: string;
  message: string;
}

export interface IErrorContextData {
  error: IError;
  setError: (data: IError) => void;
}

export const ErrorContext = createContext<IErrorContextData>(
  {} as IErrorContextData,
);

interface IErrorProvider {
  children: React.ReactNode;
}

export function ErrorProvider({ children }: IErrorProvider) {
  const errorContext = useError();

  return (
    <ErrorContext.Provider value={errorContext}>
      {children}
    </ErrorContext.Provider>
  );
}
