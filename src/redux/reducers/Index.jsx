import { combineReducers } from "redux";
import alertReducer from "./alertReducer";
import layoutReducer from "./layoutReducer";
import previewReducer from "./previewReducer";
import dashboardReducer from "./dashboardReducer";
import publishedPageReducer from "./publishedPageReducer";
import navbarReducer from "./navbarReducer";

const rootReducer = combineReducers({
  alert: alertReducer,
  layout: layoutReducer,
  preview: previewReducer,
  dashboard: dashboardReducer,
  publishedPage: publishedPageReducer,
  navbar: navbarReducer,
});

export default rootReducer;
