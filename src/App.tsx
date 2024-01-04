import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import { theme } from './theme';

const Login = React.lazy(() => import('./pages/Login/Login'));
const Error404 = React.lazy(() => import('./pages/Errors/Error404'));
const DefaultLayout = React.lazy(() => import('./DefaultLayout'));

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
          <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/404" element={<Error404 />} />
              {/*<Route path="/register" name="Register Page" element={<Register />} />
              <Route path="/500" name="Page 500" element={<Page500 />} />*/}
              <Route path="*" element={<DefaultLayout />} />
          </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
