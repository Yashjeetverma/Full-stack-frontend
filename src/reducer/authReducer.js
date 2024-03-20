import {
  LOGIN,
  SET_AUTHENTICATED,
  FETCH_USER,
  UPDATE_USER_DETAILS,
  LOGOUT,
  FETCH_BLOG,
  SESSION_EXPIRED
} from "../actions/authActions";

const initialState = {
  user: { token: null },
  blogs: [],
  totalPages: 1,
  isAuthenticated: false,
  sessionExpired: false
};

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOGIN:
      return {
        ...state,
        user: { token: payload.token },
        isAuthenticated: true
      };
    case SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: payload
      };
    case FETCH_USER:
      return {
        ...state,
        user: payload.user
      };
    case FETCH_BLOG:
      return {
        ...state,
        blogs: payload.blogs,
        totalPages: payload.totalPages
      };
    case UPDATE_USER_DETAILS:
      return {
        ...state,
        user: {
          ...state.user,
          ...payload
        }
      };
    case SESSION_EXPIRED:
      return {
        ...state,
        sessionExpired: true
      };
    case LOGOUT:
      return {
        ...initialState,
        isAuthenticated: false
      };
    default:
      return state;
  }
};

export default authReducer;
