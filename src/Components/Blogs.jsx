import React, { useState, useEffect } from 'react';

//react-bootstrap
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Card from 'react-bootstrap/Card';

//mui
import { Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogCreatedByUser } from '../actions/authActions';

//library
import ReactPaginate from "react-paginate";

const Blogs = () => {
    const blogs = useSelector((state) => state.auth.blogs);
    const totalPages = useSelector((state) => state.auth.totalPages);
    console.log(totalPages);
    
    const dispatch = useDispatch();
    const [showLatest, setShowLatest] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(fetchBlogCreatedByUser(!showLatest ? currentPage : undefined));
    }, [dispatch, showLatest, currentPage]);

    const handleLatestClick = () => {
        setShowLatest(true);
    };

    const handleAllClick = () => {
        setShowLatest(false);
        setCurrentPage(1);
    };

    const fetchNextPage = (currentPage, totalPages, includeUserToken) => {
        if (currentPage <= totalPages) {
            dispatch(fetchBlogCreatedByUser(includeUserToken, currentPage));
        } else {
            console.log("No more pages to fetch");
        }
    };

    const handlePageClick = ({ selected }) => {
        const nextPage = selected + 1;
        setCurrentPage(nextPage);
        fetchNextPage(nextPage, totalPages, !showLatest);
    };

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item onClick={handleLatestClick} active={!showLatest} style={{ cursor: 'pointer' }}>
                    Latest Post
                </Breadcrumb.Item>
                <Breadcrumb.Item onClick={handleAllClick} active={showLatest} style={{ cursor: 'pointer' }}>
                    All
                </Breadcrumb.Item>
            </Breadcrumb>
            <div>
                {blogs.length !== 0 ? (
                    <div>
                        {blogs.map((blog) => (
                            <Card key={blog.id} className='mb-3'>
                                <Card.Header>{blog.categories}</Card.Header>
                                <Card.Body>
                                    <Card.Title>{blog.title}</Card.Title>
                                    <Card.Text>{blog.content}</Card.Text>
                                    <Card.Text>Author: {blog.author.fullName}</Card.Text>
                                    {/* Add other details */}
                                    <FavoriteBorderIcon />
                                    <BookmarkBorderIcon />
                                    <ShareOutlinedIcon />
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Typography variant='h5'>No Blogs Found!</Typography>
                )}
            </div>
            {!showLatest && totalPages > 1 && (
                <div>
                    <ReactPaginate
                        previousLabel={"previous"}
                        nextLabel={"next"}
                        breakLabel={"..."}
                        pageCount={totalPages}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination justify-content-center"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        activeClassName={"active"}
                    />
                </div>
            )}
        </div>
    );
};

export default Blogs;
