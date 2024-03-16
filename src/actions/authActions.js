//library-import
import api from "../api";

import { toast } from 'react-toastify';


export const LOGIN = 'LOGIN';
export const SET_AUTHENTICATED = 'SET_AUTHENTICATED';
export const FETCH_USER = 'FETCH_USER';
export const UPDATE_USER_DETAILS = 'UPDATE_USER_DETAILS';
export const LOGOUT = 'LOGOUT';
export const FETCH_BLOG = 'FETCH_BLOG'


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

export const fetchUserData = (token) => {
  return async (dispatch) => {
    try {
      if (token) {
        dispatch(login(token));
      }

      const response = await api.get('/user');

      if (response.status === 200) {
        const userData = response.data;
        dispatch(fetchUser(userData));
      } else {
        console.error('Error fetching user data:', response.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
};

export const createBlog = (title, content, categories) => async (dispatch) => {
  try {
    const response = await api.post('/blogs', { title, content, categories });

    if (response.status === 200) {
      dispatch({ type: 'CREATE_BLOG_SUCCESS' });
      toast.success('Blog created successfully!');
      return true;
    } else {
      dispatch({ type: 'CREATE_BLOG_FAILURE', error: response.data.error });
      toast.error('Unable to create blog!');
      return false;
    }
  } catch (error) {
    dispatch({ type: 'CREATE_BLOG_FAILURE', error: error.message });
    return false;
  }
};

export const fetchBlogs = (blogs) => ({
  type: FETCH_BLOG,
  payload: { blogs },
});


export const fetchBlogCreatedByUser = (token) => {
  return async (dispatch) => {
    try {
      if (token) {
        dispatch(login(token))
      }
      const response = await api.get('/blogs');
      dispatch(fetchBlogs(response.data))
    } catch (error) {
      console.error('Error fetching user blogs:', error);
    }
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
      toast.error(`${response.data.error}`);
    }
  } catch (error) {
    toast.error('Error deleting blog:', error.message);
  }
};

export const updateUserDetails = (updatedDetails) => {
  return {
    type: UPDATE_USER_DETAILS,
    payload: updatedDetails,
  };
};

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
      throw new Error(response.data.error);
    }
  } catch (error) {
    throw error;
  }
};

export const sessionExpired = () => ({
  type: 'SESSION_EXPIRED'
});

export const logout = () => ({
  type: LOGOUT,
});
