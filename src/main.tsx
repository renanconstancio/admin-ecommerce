import ReactDOM from 'react-dom';
import { ErrorProvider } from './context/ErrorContext';
import { App } from './App';

import './style/app.scss';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
  <ErrorProvider>
    <App />
  </ErrorProvider>,
  document.getElementById('root'),
);
