import { SHOW_MODAL, HIDE_MODAL } from "../../shared/constants/ActionTypes";

const initialState = {
  show: false,
  title: "",
  content: "",
  confirmAction: null,
  modalType: "", // e.g., 'publish', 'delete'
};

const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MODAL:
      return {
        ...state,
        show: true,
        ...action.payload,
      };
    case HIDE_MODAL:
      return initialState;
    default:
      return state;
  }
};

export default modalReducer;