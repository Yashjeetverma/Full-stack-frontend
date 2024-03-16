import React, { useState } from 'react';

//components
import Form from 'react-bootstrap/Form';

//mui
import LoadingButton from '@mui/lab/LoadingButton';

//hook
import { useNavigate } from 'react-router-dom';

//library-import
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//base-url
import { BASE_URL } from '../utils/constants';


const SignUp = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}api/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullName, email, password, confirmPassword }),
            });

            if (response.ok) {
                toast.success('User registered successfully');
                const responseData = await response.json();
                console.log(responseData);
                navigate('/');
                setLoading(false)
            } else {
                const errorData = await response.json();
                toast.error(`${errorData.error}`);
                setLoading(false)
            }
        } catch (error) {
            toast.error('Error during signup:', error);
            setLoading(false)
        }
    };
    return (
        <section className='d-flex justify-content-center align-items-center registration-landing'>
            <div className='row container'>
                <ToastContainer position="top-right" autoClose={4000} />

                <Form className='registration-form' onSubmit={handleSignUp}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className='registration-form-label'>Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Rohan Kumar"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            minLength={5}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
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
                            minLength={8}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                        <Form.Label className='registration-form-label'>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </Form.Group>
                    <div className='d-flex justify-content-between align-items-center'>
                        <LoadingButton loading={loading} variant="contained" className='MuiLoadingButton-colorPrimary' type='submit'>
                            SignUp
                        </LoadingButton>
                        <a className='shortcut-text' href='/'>Login</a>
                    </div>
                </Form>
            </div>
        </section>
    )
}

export default SignUp