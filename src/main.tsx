import React from 'react';
import ReactDOM from 'react-dom/client';
import Layout from './components/Layout/Layout';
import './global.css';
import { Provider } from 'react-redux';
import { AuthenticationContextProvider } from './context/authentication';
import store from './redux/store';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <AuthenticationContextProvider>
      <Layout />
    </AuthenticationContextProvider>
  </Provider>
);
