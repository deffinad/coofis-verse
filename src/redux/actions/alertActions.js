import { v4 as uuidv4 } from "uuid";
import * as types from "../../shared/constants/ActionTypes";

// --- Action Creators ---
/**
 * @function showAlert
 * @description
 * @param {string} message
 * @param {'success' | 'error' | 'warning' | 'info'} type
 * @param {number} [duration=4000]
 * @param {boolean} [dismissible=true]
 * @returns {object}
 */
export const showAlert =
  (message, type, duration = 4000, dismissible = true) =>
  (dispatch) => {
    const id = uuidv4();

    dispatch({
      type: types.SHOW_ALERT,
      payload: {
        id,
        message,
        type,
        duration,
        dismissible,
      },
    });

    if (duration > 0) {
      setTimeout(() => dispatch(hideAlert(id)), duration);
    }
  };

/**
 * @function hideAlert
 * @description 
 * @param {string} id
 * @returns {object}
 */
export const hideAlert = (id) => ({
  type: types.HIDE_ALERT,
  payload: id,
});

/**
 * @function clearAllAlerts
 * @description
 * 
 * @returns {object}
 */
export const clearAllAlerts = () => ({
  type: types.CLEAR_ALL_ALERTS,
});
