import App from '../../App';
import SignIn from '../../pages/sign-in';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ToastNotification from '../ToastNotification/ToastNotification';

const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Page d'accueil</h1>,
  },
  {
    path: '/app',
    element: <App />,
  },
  {
    path: '/sign-in',
    element: <SignIn />,
  },
]);

function Layout() {
  return (
    <main>
      <ToastNotification />
      <RouterProvider router={router} />
    </main>
  );
}

export default Layout;
