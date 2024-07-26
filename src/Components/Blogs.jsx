import React, { useState, useEffect } from 'react';

//react-bootstrap
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Card from 'react-bootstrap/Card';

//mui
import { Grid, Typography, styled } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogCreatedByUser } from '../actions/authActions';

//library
import ReactPaginate from "react-paginate";


const CardText = styled(Card.Text)({
    marginBottom: '10px',
    // height: '70px'
});

const CardTitle = styled(Card.Title)({
    fontSize: '15px',
    fontWeight: '700'
});

const BottomDiv = styled('div')({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
});

const Blogs = () => {
    const blogs = useSelector((state) => state.auth.blogs);
    const totalPages = useSelector((state) => state.auth.totalPages);

    const dispatch = useDispatch();
    const [showLatest, setShowLatest] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const [expandedIds, setExpandedIds] = useState([]);

    useEffect(() => {
        dispatch(fetchBlogCreatedByUser(!showLatest ? currentPage : undefined));
    }, [dispatch, showLatest, currentPage]);

    const handleLatestClick = () => {
        setShowLatest(true);
    };

    const handleAllClick = () => {
        setShowLatest(false);
        setCurrentPage(1);
        // dispatch(fetchBlogCreatedByUser(1)); // Fetch the first page of all posts
    };

    const fetchNextPage = (currentPage, totalPages, includeUserToken) => {
        if (currentPage <= totalPages) {
            dispatch(fetchBlogCreatedByUser(includeUserToken ? currentPage : undefined));
        } else {
            console.log("No more pages to fetch");
        }
    };

    const handlePageClick = ({ selected }) => {
        const nextPage = selected + 1;
        setCurrentPage(nextPage);
        fetchNextPage(nextPage, totalPages, !showLatest);
    };

    const toggleExpand = (blogId) => {
        if (expandedIds.includes(blogId)) {
            setExpandedIds(expandedIds.filter(id => id !== blogId));
        } else {
            setExpandedIds([...expandedIds, blogId]);
        }
    };

    const CardWrapper = styled(Card)({
        marginBottom: '1rem',
        overflow: 'hidden',
        transition: 'height 0.3s ease',
        '&.expanded': {
            maxHeight: 'none',
        },
    });

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

            {blogs.length !== 0 ? (
                <Grid container spacing={1}>
                    {blogs.map((blog) => (
                        <Grid item lg={4} md={4} xs={12} key={blog._id}>
                            <CardWrapper className={expandedIds.includes(blog._id) ? 'expanded' : ''}>
                                <Card.Header>{blog.categories}</Card.Header>
                                <Card.Body>
                                    <CardTitle>{blog.title}</CardTitle>
                                    <CardText>
                                        {expandedIds.includes(blog._id)
                                            ? blog.content // If expanded, show full content
                                            : blog.content.slice(0, 40) + '...'}
                                        <Typography
                                            variant='h6'
                                            color="error"
                                            fontSize={14}
                                            sx={{ cursor: 'pointer' }}
                                            onClick={() => toggleExpand(blog._id)}
                                        >
                                            {expandedIds.includes(blog._id) ? 'Read less' : 'Read more'}
                                        </Typography>
                                    </CardText>
                                    <Card.Text>Author: {blog.author.fullName}</Card.Text>
                                    <BottomDiv>
                                        <FavoriteBorderIcon />
                                        <BookmarkBorderIcon />
                                        <ShareOutlinedIcon />
                                    </BottomDiv>
                                </Card.Body>
                            </CardWrapper>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant='h5'>No Blogs Found!</Typography>
            )}


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
