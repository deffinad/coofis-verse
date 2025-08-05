import { createStore, applyMiddleware, compose } from 'redux';
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";
import rootReducer from "../reducers";

// --- Middleware untuk Sinkronisasi localStorage ---
const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  try {
    const state = store.getState();
    // Simpan seluruh state 'page' yang berisi `pages` dan `currentPage`
    // Ini lebih sederhana dan mencakup semua data yang dibutuhkan.
    localStorage.setItem("savedState", JSON.stringify(state.page));
  } catch (e) {
    console.error("Gagal menyimpan state ke localStorage:", e);
  }

  return result;
};

// Gabungkan middleware thunk dan middleware localStorage
const middleware = [thunk, localStorageMiddleware];

// --- Konfigurasi Store ---
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
