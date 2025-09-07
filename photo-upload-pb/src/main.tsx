import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { HomePage } from './pages';
import './index.css';
import { PrimeReactProvider } from 'primereact/api';


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider>
      <RouterProvider router={router} />
    </PrimeReactProvider>
  </StrictMode>,
)
