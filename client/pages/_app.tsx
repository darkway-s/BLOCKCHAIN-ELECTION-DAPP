import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import store from '../redux/store';
import '../styles/globals.css';
// import "bootstrap/js/dist/collapse";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ToastContainer></ToastContainer>
      <Component {...pageProps} />
      <Analytics />
    </Provider>
  )
}
