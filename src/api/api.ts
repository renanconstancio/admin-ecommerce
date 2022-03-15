import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// api.interceptors.request.use(async config => {
//   // Declaramos um token manualmente para teste.
//   const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9';

//   if (token) {
//     api.defaults.headers.authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// api.interceptors.request.use(
//   req => {
//     return req;
//   },
//   error => {
//     console.log('ERROR', error);
//   },
// );

export default api;
