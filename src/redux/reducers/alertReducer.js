import * as types from "../../shared/constants/ActionTypes";

// --- Initial State ---
const initialState = {
  alerts: [],
  loading: false,
};

/**
 * @function alertReducer
 * @description
 * @param {object} state
 * @param {object} action
 * @returns {object}
 */
const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SHOW_ALERT:
      return {
        ...state,
        alerts: [...state.alerts, action.payload],
      };
    case types.HIDE_ALERT:
      return {
        ...state,
        alerts: state.alerts.filter((alert) => alert.id !== action.payload),
      };
    case types.CLEAR_ALL_ALERTS:
      return {
        ...state,
        alerts: [],
      };
    default:
      return state;
  }
};

export default alertReducer;
