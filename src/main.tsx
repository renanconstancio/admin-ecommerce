import './style/app.scss';
import 'react-toastify/dist/ReactToastify.css';

import ReactDOM from 'react-dom';
import { ErrorProvider } from './context/ErrorContext';
import { AuthProvider } from './context/Auth';
import App from './App';

ReactDOM.render(
  <AuthProvider>
    <ErrorProvider>
      <App />
    </ErrorProvider>
  </AuthProvider>,
  document.getElementById('root'),
);
