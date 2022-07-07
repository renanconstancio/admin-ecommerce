import ReactDOM from 'react-dom';

import { App } from './App';
import { ErrorProvider } from './context/ErrorContext';

import 'react-toastify/dist/ReactToastify.css';
import './style/app.scss';

ReactDOM.render(
  <ErrorProvider>
    <App />
  </ErrorProvider>,
  document.getElementById('root'),
);
