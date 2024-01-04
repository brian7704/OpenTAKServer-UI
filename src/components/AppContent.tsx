import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

// routes config
import { LoadingOverlay } from '@mantine/core';
import routes from '../routes';
import PrivateRoute from '../PrivateRoute';

export const AppContent = () => (
      <Suspense fallback={<LoadingOverlay zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />}>
        <Routes>
          {routes.map((route, idx) => (
              route.element && (
                <Route path={route.path} key={idx} element={<PrivateRoute />}>
                  <Route
                    key={idx}
                    path={route.path}
                    element={<route.element />}
                  />
                </Route>
              )
            ))}
          <Route path="/" element={<PrivateRoute />} />
        </Routes>
      </Suspense>
  );

export default React.memo(AppContent);
