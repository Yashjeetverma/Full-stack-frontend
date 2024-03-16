// PrivateRoute.jsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, authenticated, fallback, ...rest }) => (
  authenticated ? (
    <Route {...rest} element={<Element />} />
  ) : (
    <Navigate to="/" replace />
  )
);

export default PrivateRoute;
