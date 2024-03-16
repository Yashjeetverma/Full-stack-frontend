import React, { useState } from 'react';

//bootstrap
import Form from 'react-bootstrap/Form';

//mui
import LoadingButton from '@mui/lab/LoadingButton';

//hook
import { useNavigate } from 'react-router-dom';

//library-import
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//redux
import { useDispatch } from 'react-redux';
import { login } from '../actions/authActions';
import { fetchUserData } from '../actions/authActions';

import { BASE_URL } from '../utils/constants';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                toast.success('Login successful');
                const responseData = await response.json();
                localStorage.setItem('userToken', responseData.token);
                dispatch(login(responseData.token));
                dispatch(fetchUserData(responseData.token));
                navigate('/dashboard');
            } else {
                const errorData = await response.json();
                toast.error(`${errorData.error}`);
                setLoading(false)
            }
        } catch (error) {
            toast.error(`${error}`);
            setLoading(false)
        }
    };
    return (
        <section className='d-flex justify-content-center align-items-center registration-landing'>
            <div className='row container'>
                <ToastContainer position="top-right" autoClose={1000} />
                <Form className='registration-form' onSubmit={handleLogin}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className='registration-form-label'>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="rohan@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label className='registration-form-label'>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8} />
                    </Form.Group>
                    <div className='d-flex justify-content-between align-items-center'>
                        <LoadingButton loading={loading} variant="contained" className='MuiLoadingButton-colorPrimary' type='submit'>
                            Login
                        </LoadingButton>
                        <a className='shortcut-text' href='/sign-up'>SignUp</a>
                    </div>
                </Form>
            </div>
        </section>
    )
}

export default Login