import * as actionTypes from '../../shared/constants/ActionTypes';

const initialState = {
  loading: false,
  cards: [],
  error: null,
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_DASHBOARD_DATA_START:
      return { ...state, loading: true, error: null };
    case actionTypes.FETCH_DASHBOARD_DATA_SUCCESS:
      return { ...state, loading: false, cards: action.payload };
    case actionTypes.FETCH_DASHBOARD_DATA_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default dashboardReducer;

