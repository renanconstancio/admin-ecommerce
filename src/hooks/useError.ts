import { useMemo, useState } from 'react';
import { IError } from '../context/ErrorContext';

export function useError() {
  const [error, setError] = useState({} as IError);

  // useEffect(() => {
  //   const clock = setTimeout(() => {
  //     if (!error) {
  //       setError({} as IError);
  //     }
  //   }, 3000);
  //   return () => {
  //     clearTimeout(clock);
  //   };
  // }, [error]);

  return useMemo(
    () => ({
      error,
      setError,
    }),
    [error, setError],
  );
}
