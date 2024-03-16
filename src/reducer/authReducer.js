import { LOGIN, SET_AUTHENTICATED, FETCH_USER, UPDATE_USER_DETAILS, LOGOUT, FETCH_BLOG } from "../actions/authActions";

const initialState = {
  user: { token: null },
  blogs: [],
  authenticated: false,
  sessionExpired: false
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: { token: action.payload.token },
        isAuthenticated: true
      };
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: action.payload,
      };
    case FETCH_USER:
      return {
        ...state,
        user: action.payload.user,
      };
    case FETCH_BLOG:
      return {
        ...state,
        blogs: action.payload.blogs,
      };
    case UPDATE_USER_DETAILS:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    case 'SESSION_EXPIRED':
      return {
        ...state,
        sessionExpired: true
      };
    case LOGOUT:
      return {
        ...state,
        user: { token: null },
        isAuthenticated: false
      };
    default:
      return state;
  }
};

export default authReducer;
