import React, { Suspense, lazy, useEffect } from 'react';

//react-router
import { Routes, Route, useNavigate } from 'react-router-dom';

//mui
import CircularProgress from '@mui/joy/CircularProgress';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './actions/authActions';

//bootstrap-css
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { api, cancel } from './api';

const SignUp = lazy(() => import('./Components/SignUp'));
const Login = lazy(() => import('./Components/Login'));
const Dashboard = lazy(() => import('./Components/Dashboard'));
const Profile = lazy(() => import('./Components/Profile'));

const LoadingSpinner = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
    <CircularProgress color="danger" />
  </div>
);

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionExpired = useSelector(state => state.auth.sessionExpired);

  useEffect(() => {
    if (sessionExpired) {
      dispatch({ type: 'SESSION_EXPIRED_HANDLED' });
      window.location.replace('/');
    }
  }, [sessionExpired, dispatch]);

  const handleLogout = async () => {
    const userToken = localStorage.getItem('userToken');
    try {
      if (userToken) {
        const response = await api.post('/logout');
  
        if (response.status === 200) {
          cancel(); // Cancel any ongoing requests
          dispatch(logout());
          localStorage.removeItem('userToken');
          navigate('/');
        } else {
          console.error('Logout failed:', response.statusText);
        }
      } else {
        console.error('User or token is null or undefined');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<Suspense fallback={<LoadingSpinner />}><Login /></Suspense>}
      />
      <Route
        path="/sign-up"
        element={<Suspense fallback={<LoadingSpinner />}><SignUp /></Suspense>}
      />
      <Route
        path="/dashboard"
        element={<Suspense fallback={<LoadingSpinner />}><Dashboard handleLogout={handleLogout} /></Suspense>}
      />
      <Route
        path="/profile"
        element={<Suspense fallback={<LoadingSpinner />}><Profile /></Suspense>}
      />
    </Routes>
  );
}

export default App;
