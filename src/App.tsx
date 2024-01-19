import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import { theme } from './theme';
import '@mantine/notifications/styles.css';

const Login = React.lazy(() => import('./pages/Login/Login'));
const Error404 = React.lazy(() => import('./pages/Errors/Error404'));
const DefaultLayout = React.lazy(() => import('./DefaultLayout'));
const PasswordReset = React.lazy(() => import('./pages/PasswordReset'));

export default function App() {
  return (
    <MantineProvider theme={theme}>
        <Notifications />
      <BrowserRouter>
          <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/404" element={<Error404 />} />
              <Route path="/reset" element={<PasswordReset />} />
              {/*<Route path="/register" name="Register Page" element={<Register />} />
              <Route path="/500" name="Page 500" element={<Page500 />} />*/}
              <Route path="*" element={<DefaultLayout />} />
          </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
