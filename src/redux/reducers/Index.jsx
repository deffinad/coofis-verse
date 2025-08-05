import { combineReducers } from "redux";
import alertReducer from "./alertReducer";
import layoutReducer from "./layoutReducer";
import previewReducer from "./previewReducer";

const rootReducer = combineReducers({
  alert: alertReducer,
  layout: layoutReducer,
  preview: previewReducer,
});

export default rootReducer;
