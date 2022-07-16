import ReactDOM from 'react-dom';
import { ErrorProvider } from './context/ErrorContext';
import { App } from './App';

import './style/app.scss';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/Auth';

ReactDOM.render(
  <AuthProvider>
    <ErrorProvider>
      <App />
    </ErrorProvider>
  </AuthProvider>,
  document.getElementById('root'),
);
