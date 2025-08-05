import { combineReducers } from "redux";
import alertReducer from "./alertReducer";
import layoutReducer from './layoutReducer'


const rootReducer = combineReducers({
  alert: alertReducer,
  layout: layoutReducer,
});

export default rootReducer;
