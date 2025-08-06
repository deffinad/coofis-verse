import * as actionTypes from "../../shared/constants/ActionTypes";

const initialState = {
  loading: false,
  pages: [],
  error: null,
};

const publishedPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PUBLISHED_PAGE_START:
      return { ...state, loading: true, error: null };

    case actionTypes.FETCH_PUBLISHED_PAGE_SUCCESS:
      // This will now likely fetch a single page for viewing
      return { ...state, loading: false, data: action.payload, error: null };

    case actionTypes.FETCH_PUBLISHED_PAGE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    
    case actionTypes.PUBLISH_PAGE:
      const { pages, currentPage } = action.payload;
      const pageToPublish = pages.find(p => p.id === currentPage);
      if (!pageToPublish) return state;

      const existingIndex = state.pages.findIndex(p => p.id === pageToPublish.id);
      let newPages = [...state.pages];

      if (existingIndex > -1) {
        newPages[existingIndex] = pageToPublish;
      } else {
        newPages.push(pageToPublish);
      }
      return { ...state, pages: newPages };

    default:
      return state;
  }
};

export default publishedPageReducer;
