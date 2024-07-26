import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/joy/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { logout, sessionExpired } from './actions/authActions'; // Import sessionExpired action
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { createAxiosInstance } from './api';
import Home from './Components/Home';

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
  const sessionExpiredState = useSelector(state => state.auth.sessionExpired);

  useEffect(() => {
    if (sessionExpiredState) {
      dispatch(sessionExpired()); // Dispatch the sessionExpired action
      navigate('/'); // Redirect to login page
    }
  }, [sessionExpiredState, dispatch, navigate]);

  const handleLogout = async () => {
    const userToken = localStorage.getItem('userToken');
    try {
      if (userToken) {
        const { instance, cancel } = createAxiosInstance(dispatch); // Pass dispatch to createAxiosInstance
        const response = await instance.post('/logout');
        if (response.status === 200) {
          cancel(); // Cancel the previous request
          dispatch(logout());
          localStorage.removeItem('userToken');
          navigate('/'); // Redirect to login page after logout
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
        path="/home"
        element={<Suspense fallback={<LoadingSpinner />}><Home/></Suspense>}
      />
      <Route
        path="/profile"
        element={<Suspense fallback={<LoadingSpinner />}><Profile /></Suspense>}
      />
    </Routes>
  );
}

export default App;
