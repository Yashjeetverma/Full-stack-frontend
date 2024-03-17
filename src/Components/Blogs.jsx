import React, { useState, useEffect } from 'react';

// React Bootstrap components
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Card from 'react-bootstrap/Card';

//mui
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogCreatedByUser } from '../actions/authActions';
import { Typography } from '@mui/material';

const Blogs = () => {
    const blogs = useSelector((state) => state.auth.blogs);
    const dispatch = useDispatch();

    const [showLatest, setShowLatest] = useState(true);
    const [userToken, setUserToken] = useState(localStorage.getItem('userToken'));
    

    useEffect(() => {
        dispatch(fetchBlogCreatedByUser());
    }, [dispatch]);

    const handleLatestClick = () => {
        setShowLatest(true);
    };

    const handleAllClick = () => {
        setShowLatest(false);
    };

    const formatDate = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    };


    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item onClick={handleLatestClick} active={showLatest}>
                    Latest Post
                </Breadcrumb.Item>
                <Breadcrumb.Item onClick={handleAllClick} active={!showLatest}>
                    All
                </Breadcrumb.Item>
            </Breadcrumb>
            <div>
                { blogs.length !== 0 ?
                    blogs.map((blog => (
                        <Card key={blog.id} className='mb-3'>
                            <Card.Header>{blog.categories}</Card.Header>
                            <Card.Body>
                                <Card.Title>{blog.title}</Card.Title>
                                <Card.Text>{blog.content}</Card.Text>
                                <Card.Text>Author: {blog.author.fullName}</Card.Text>
                                <Card.Text>Created At: {formatDate(blog.createdAt)}</Card.Text>
                                <FavoriteBorderIcon />
                                <BookmarkBorderIcon />
                                <ShareOutlinedIcon />
                            </Card.Body>
                        </Card>
                    )))
                    : <Typography variant='h5'>
                        No Blogs Found!
                    </Typography>
                }
            </div>
        </div>
    );
};

export default Blogs;
