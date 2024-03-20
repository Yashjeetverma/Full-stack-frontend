import React, { useState, useEffect } from 'react';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { createBlog, fetchUserData } from '../actions/authActions';

//bootstrap
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

//mui
import LoadingButton from '@mui/lab/LoadingButton';

//library-import
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//component
import Blogs from './Blogs';

const Home = () => {
    const [userToken, setUserToken] = useState(localStorage.getItem('userToken'));
    
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categories, setCategories] = useState('');
    const [loading, setLoading] = useState(false)
    const [modalShow, setModalShow] = useState(false);
    
    
    useEffect(() => {
        setUserToken(localStorage.getItem('userToken'));
        if (userToken) {
            dispatch(fetchUserData(userToken));
        }
    }, [dispatch, userToken]);


    const handleSubmit = async (e, title, content, categories) => {
        e.preventDefault();
        setLoading(true);

        try {
            const success = await dispatch(createBlog(title, content, categories));

            if (success) {
                setModalShow(false);
                window.location.reload();
            } else {
                toast.error('Failed to create blog');
            }
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setLoading(false);
        }
    };
    return (
        <section className='home d-flex justify-content-center align-items-center'>
            <div className='row container'>
                <ToastContainer position="top-right" autoClose={1000} />
                <div className="p-5 mb-4 bg-light rounded-3">
                    <div className="container-fluid py-5">
                        <h1 className="display-5 fw-bold">Welcome {user.fullName}</h1>
                        <p className="col-md-8 fs-4">Enjoy creating your very first blog!</p>
                        <button className="btn btn-primary btn-lg" type="button" onClick={() => setModalShow(true)}>Create</button>
                    </div>
                </div>
                <Modal
                    show={modalShow}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Create
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={(e) => handleSubmit(e, title, content, categories)}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Blog Title</Form.Label>
                                <Form.Control type="text" placeholder="Learn React Js with these concepts..." value={title} onChange={(e) => setTitle(e.target.value)} required minLength={5} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Blog Content</Form.Label>
                                <Form.Control as="textarea" rows={5} value={content} onChange={(e) => setContent(e.target.value)} required minLength={5} placeholder='React.js is a JavaScript library for building user interfaces, particularly for single-page...' />
                            </Form.Group>
                            <Form.Select aria-label="Default select example" className="mb-3 form-select" value={categories} onChange={(e) => setCategories(e.target.value)}>
                                <option>Select your categories</option>
                                <option value="AI/ML">AI/ML</option>
                                <option value="Android">Android</option>
                                <option value="BlockChain">BlockChain</option>
                                <option value="WebDev">WebDev</option>
                                <option value="Startup">Startup</option>
                                <option value="Business">Business</option>
                                <option value="Technology">Technology</option>
                            </Form.Select>
                            <LoadingButton loading={loading} variant="contained" className='MuiLoadingButton-colorPrimary' type='submit'>
                                Submit
                            </LoadingButton>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => setModalShow(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <Blogs />
            </div>
        </section>
    )
}

export default Home