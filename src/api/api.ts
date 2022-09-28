import axios from 'axios';

const URI_BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

export const defaults = {
  headers: {
    Authorization: '',
  },
};

export const api = axios.create({
  baseURL: `${URI_BASE}`,
});

// api.interceptors.request.use(async config => {
//   // Declaramos um token manualmente para teste.
//   const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9';

//   if (token) {
//     api.defaults.headers.authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// api.interceptors.response.use(
//   req => {
//     return req;
//   },
//   err => {
//     const { message, status } = err.toJSON();
//     console.log(
//       `Não foi possivel carregar a lista! -> ${message}`,
//       err.toJSON(),
//     );
//   },
// );

// api.interceptors.request.use(
//   req => {
//     return req;
//   },
//   error => {
//     console.log('ERROR', error);
//   },
// );
