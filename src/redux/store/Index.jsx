import { createStore, applyMiddleware, compose } from 'redux';
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";
import rootReducer from "../reducers";

// --- Middleware untuk Sinkronisasi localStorage ---
const middleware = [thunk];

// --- Konfigurasi Store ---
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
