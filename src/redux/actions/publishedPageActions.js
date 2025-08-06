import * as actionTypes from "../../shared/constants/ActionTypes";

export const fetchPublishedPage = (pageId) => (dispatch, getState) => {
  dispatch({ type: actionTypes.FETCH_PUBLISHED_PAGE_START });
  try {
    const { pages } = getState().publishedPage;
    const pageData = pages.find((p) => p.id === pageId);

    if (pageData) {
      dispatch({
        type: actionTypes.FETCH_PUBLISHED_PAGE_SUCCESS,
        payload: pageData,
      });
    } else {
      // Kirim action failure jika halaman tidak ditemukan.
      dispatch({
        type: actionTypes.FETCH_PUBLISHED_PAGE_FAILURE,
        payload: "Page not found.",
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.FETCH_PUBLISHED_PAGE_FAILURE,
      payload: error.message,
    });
  }
};
