import * as types from "../../shared/constants/ActionTypes";

const initialState = {
  pageData: null,
  isLoading: true,
  error: null,
  device: "Desktop", // Default device
};

const previewReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOAD_PREVIEW_START:
      return {
        ...state,
        isLoading: true,
        error: null,
        pageData: null,
      };

    case types.LOAD_PREVIEW_SUCCESS:
      return {
        ...state,
        isLoading: false,
        pageData: action.payload,
      };

    case types.LOAD_PREVIEW_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case types.SET_PREVIEW_DEVICE:
      return {
        ...state,
        device: action.payload,
      };

    case types.CLEAR_PREVIEW:
      return initialState;

    default:
      return state;
  }
};

export default previewReducer;
