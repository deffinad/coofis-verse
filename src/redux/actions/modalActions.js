import { SHOW_MODAL, HIDE_MODAL } from "../../shared/constants/ActionTypes";

export const showModal = (modalProps) => {
  return (dispatch) => {
    dispatch({
      type: SHOW_MODAL,
      payload: modalProps,
    });
  };
};

export const hideModal = () => {
  return (dispatch) => {
    dispatch({
      type: HIDE_MODAL,
    });
  };
};