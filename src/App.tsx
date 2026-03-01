import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { HashRouter, Route, Routes } from 'react-router';
import React from 'react';
import { theme } from './theme';
import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import '@mantine/dates/styles.css';
import 'mantine-datatable/styles.css';
import './i18n';
import { I18nextProvider, useTranslation } from "react-i18next";

const Login = React.lazy(() => import('./pages/Login/Login'));
const Error404 = React.lazy(() => import('./pages/Errors/Error404'));
const DefaultLayout = React.lazy(() => import('./DefaultLayout'));
const PasswordReset = React.lazy(() => import('./pages/PasswordReset'));

export default function App() {
  const { t, i18n } = useTranslation();

  return (
    <I18nextProvider i18n={i18n}>
      <MantineProvider theme={theme}>
        <Notifications />
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/404" element={<Error404 />} />
            <Route path="/reset" element={<PasswordReset />} />
            {/*<Route path="/register" name="Register Page" element={<Register />} />
                  <Route path="/500" name="Page 500" element={<Page500 />} />*/}
            <Route path="*" element={<DefaultLayout />} />
          </Routes>
        </HashRouter>
      </MantineProvider>
    </I18nextProvider>
  );
}
