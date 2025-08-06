import * as actionTypes from "../../shared/constants/ActionTypes";

const initialState = {
  loading: false,
  routes: [],
  error: null,
};

const navbarReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_NAVBAR_ROUTES_START:
      return { ...state, loading: true, error: null };

    case actionTypes.FETCH_NAVBAR_ROUTES_SUCCESS:
      return { ...state, loading: false, routes: action.payload };

    case actionTypes.FETCH_NAVBAR_ROUTES_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default navbarReducer;
