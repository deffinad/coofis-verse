import { combineReducers } from "redux";
import alertReducer from "./alertReducer";
import layoutReducer from "./layoutReducer";
import previewReducer from "./previewReducer";
import dashboardReducer from "./dashboardReducer";
import publishedPageReducer from "./publishedPageReducer";
import navbarReducer from "./navbarReducer";
import modalReducer from "./modalReducer";

const rootReducer = combineReducers({
  alert: alertReducer,
  layout: layoutReducer,
  preview: previewReducer,
  dashboard: dashboardReducer,
  publishedPage: publishedPageReducer,
  navbar: navbarReducer,
  modal: modalReducer,
});

export default rootReducer;
