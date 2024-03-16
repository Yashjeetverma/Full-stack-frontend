import React, { useState, useEffect } from 'react';

//bootstrap
import Card from 'react-bootstrap/Card';
import Button from '@mui/material/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

//mui
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import DeleteIcon from '@mui/icons-material/Delete';

//redux-action
import { deleteBlog, fetchBlogCreatedByUser, fetchUserData, handleUserDetailsUpdate, updateUserDetails } from '../actions/authActions';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

//mui
import LoadingButton from '@mui/lab/LoadingButton';

//base-url
import { BASE_URL } from '../utils/constants';

//library-import
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Typography } from '@mui/material';


const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const blogs = useSelector((state) => state.auth.blogs);

  const [userToken, setUserToken] = useState(localStorage.getItem('userToken'));

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false)
  const [modalShow, setModalShow] = React.useState(false);

  const [image, setImage] = useState(null);
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');

  const [imageSrc, setImageSrc] = useState(user.image ? `${BASE_URL}uploads/${user.image}` : '');

  useEffect(() => {
    setUserToken(userToken)
    if (userToken) {
      dispatch(fetchUserData(userToken));
      dispatch(fetchBlogCreatedByUser(userToken));
    }
  }, [dispatch]);

  useEffect(() => {
    setImageSrc(user.image ? `${BASE_URL}uploads/${user.image}` : '');
  }, [user.image]);

  const handleSubmit = async (e, image, fullName, age, bio) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('fullName', fullName);
      formData.append('age', age);
      formData.append('bio', bio);
  
      await dispatch(handleUserDetailsUpdate(formData));
      toast.success('Profile updated successfully!');
      setModalShow(false);
      window.location.reload();
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const handleDelete = async (blogId) => {
    dispatch(deleteBlog(blogId, userToken));
  };


  return (
    <section className='d-flex justify-content-center align-items-center home-landing'>
      <div className='row container'>
        <ToastContainer position="top-right" autoClose={1000} />
        <div className='button-div'>
          <Button variant="contained" onClick={() => setModalShow(true)}>Edit Profile</Button>
          <Button variant="contained" onClick={() => navigate('/dashboard')} className='mx-2'>Go Back</Button>
        </div>
        <Card className='profile-card'>
          <Card.Body>
            <div className='d-flex justify-content-between align-items-center'>
              <div>
                <Card.Title className='profile-detail'>Name :<span>{user.fullName}</span></Card.Title>
                <Card.Title className='profile-detail'>Email :<span>{user.email}</span></Card.Title>
                {user.age && <Card.Title className='profile-detail'>Age :<span>{user.age}</span></Card.Title>}
                {user.bio && <Card.Title className='profile-detail'>Bio :<span>{user.bio}</span></Card.Title>}
              </div>
              {user.image && <img src={imageSrc} alt="Profile Image" className='profile-img' />}
            </div>
          </Card.Body>
        </Card>
        <Modal
          show={modalShow}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Update Your Profile
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form onSubmit={(e) => handleSubmit(e, image, fullName, age, bio)}>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Upload your image</Form.Label>
                <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Rohan Gupta" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Your age</Form.Label>
                <Form.Control type="number" placeholder="22" value={age} onChange={(e) => setAge(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Add a bio</Form.Label>
                <Form.Control as="textarea" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
              </Form.Group>
              <LoadingButton loading={loading} variant="contained" className='MuiLoadingButton-colorPrimary' type='submit'>
                Submit
              </LoadingButton>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setModalShow(false)}>Close</Button>
          </Modal.Footer>
        </Modal>

        <Typography variant='h4' color={'white'} paddingTop={1.5} paddingBottom={1.5}>
        Your Blogs
        </Typography>
        <div>
          {
            blogs.length !== 0 ?
              blogs.map((blog => (
                <Card key={blog._id} className='mb-3'>
                  <Card.Header>{blog.categories}</Card.Header>
                  <Card.Body>
                    <Card.Title>{blog.title}</Card.Title>
                    <Card.Text>{blog.content}</Card.Text>
                    <Card.Text>Author: {blog.author.fullName}</Card.Text>
                    <Card.Text>Created At: {formatDate(blog.createdAt)}</Card.Text>
                    <FavoriteBorderIcon />
                    <BookmarkBorderIcon />
                    <ShareOutlinedIcon />
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      sx={{ marginLeft: 0.8 }}
                      onClick={() => handleDelete(blog._id)}> {/* Pass blog.id here */}
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
              )))
              : <Typography variant='h5' color={'white'}>
                No Blogs Found!
              </Typography>
          }
        </div>
      </div>
    </section>
  )
}

export default Profile