import {api} from "../api";
import { toast } from 'react-toastify';

// Action Types
export const LOGIN = 'LOGIN';
export const SET_AUTHENTICATED = 'SET_AUTHENTICATED';
export const FETCH_USER = 'FETCH_USER';
export const UPDATE_USER_DETAILS = 'UPDATE_USER_DETAILS';
export const LOGOUT = 'LOGOUT';
export const FETCH_BLOG = 'FETCH_BLOG';
export const CREATE_BLOG_SUCCESS = 'CREATE_BLOG_SUCCESS';
export const CREATE_BLOG_FAILURE = 'CREATE_BLOG_FAILURE';
export const SESSION_EXPIRED = 'SESSION_EXPIRED';

// Action Creators
export const login = (token) => ({
  type: LOGIN,
  payload: { user: { token } },
});

export const setAuthenticated = (status) => ({
  type: SET_AUTHENTICATED,
  payload: status,
});

export const fetchUser = (user) => ({
  type: FETCH_USER,
  payload: { user },
});

export const fetchUserData = (token) => async (dispatch) => {
  try {
    if (token) {
      dispatch(login(token));
    }

    const response = await api.get('/user');

    if (response.status === 200) {
      const userData = response.data;
      dispatch(fetchUser(userData));
    } else {
      handleError(response.data);
    }
  } catch (error) {
    handleError(error);
  }
};

export const createBlog = (title, content, categories) => async (dispatch) => {
  try {
    const response = await api.post('/blogs', { title, content, categories });

    if (response.status === 200) {
      dispatch({ type: CREATE_BLOG_SUCCESS });
      toast.success('Blog created successfully!');
      return true;
    } else {
      handleError(response.data);
      return false; 
    }
  } catch (error) {
    handleError(error);
    return false; 
  }
};


export const fetchBlogs = (blogs) => ({
  type: FETCH_BLOG,
  payload: { blogs },
});

export const fetchBlogCreatedByUser = (includeUserToken = false) => async (dispatch) => {
  try {
    if (includeUserToken) {
      const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
      if (token) {
        dispatch(login(token))
      }
      const response = await api.get('/blogs', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      dispatch(fetchBlogs(response.data))
    } else {
      const response = await api.get('/blogs');
      dispatch(fetchBlogs(response.data))
    }
  } catch (error) {
    handleError(error);
  }
}



export const deleteBlog = (blogId, userToken) => async (dispatch) => {
  try {
    const response = await api.delete(`/blogs/${blogId}`);

    if (response.status === 200) {
      toast.success('Blog deleted successfully!');
      dispatch(fetchUserData(userToken));
      dispatch(fetchBlogCreatedByUser(userToken));
    } else {
      handleError(response.data);
    }
  } catch (error) {
    handleError(error);
  }
};

export const updateUserDetails = (updatedDetails) => ({
  type: UPDATE_USER_DETAILS,
  payload: updatedDetails,
});

export const handleUserDetailsUpdate = (formData) => async (dispatch) => {
  try {
    const response = await api.put(`/user/update`, formData);

    if (response.status === 200) {
      const updatedUserDetails = {
        fullName: formData.get('fullName'),
        age: formData.get('age'),
        bio: formData.get('bio'),
        image: formData.get('image'),
      };
      dispatch(updateUserDetails(updatedUserDetails));
      return updatedUserDetails;
    } else {
      handleError(response.data);
    }
  } catch (error) {
    handleError(error);
  }
};

export const sessionExpired = () => ({
  type: SESSION_EXPIRED
});

export const logout = () => ({
  type: LOGOUT,
});

// Helper function to handle errors
const handleError = (error) => {
  console.error('Error:', error);
  toast.error('An error occurred!');
};
