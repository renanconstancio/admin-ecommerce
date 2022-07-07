import React, { createContext } from 'react';
import { useError } from '../hooks/useError';

export interface IError {
  code?: number;
  type?: string;
  server?: string;
  message: string;
}

export interface ErrorContextData {
  error: IError;
  setError: (data: IError) => void;
}

export const ErrorContext = createContext<ErrorContextData>(
  {} as ErrorContextData,
);

export const ErrorProvider: React.FC = ({ children }) => {
  const errorContext = useError();

  return (
    <ErrorContext.Provider value={errorContext}>
      {children}
    </ErrorContext.Provider>
  );
};
