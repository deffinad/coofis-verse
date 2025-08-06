import * as types from "../../shared/constants/ActionTypes";

/**
 * Thunk action untuk memuat data halaman spesifik untuk preview.
 * Mengambil data dari state.layout dan menyediakannya untuk state.preview.
 * @param {string} pageId - ID dari halaman yang akan di-preview.
 */
export const loadPreviewPage = (pageId) => async (dispatch, getState) => {
  // Tambahkan 'async'
  const MIN_LOADING_TIME = 600; // Durasi loading minimum dalam milidetik
  const startTime = Date.now(); // Catat waktu mulai

  dispatch({ type: types.LOAD_PREVIEW_START });

  try {
    const { pages } = getState().layout;
    const pageToPreview = pages.find((p) => p.id === pageId);

    // Hitung sisa waktu yang dibutuhkan untuk mencapai loading minimum
    const elapsedTime = Date.now() - startTime;
    const delay = MIN_LOADING_TIME - elapsedTime;

    // Jika prosesnya terlalu cepat, beri jeda
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    if (pageToPreview) {
      dispatch({
        type: types.LOAD_PREVIEW_SUCCESS,
        payload: pageToPreview,
      });
    } else {
      throw new Error(`Page with ID "${pageId}" not found.`);
    }
  } catch (error) {
    // Pastikan error juga ditampilkan setelah durasi minimum jika terjadi terlalu cepat
    const elapsedTime = Date.now() - startTime;
    const delay = MIN_LOADING_TIME - elapsedTime;
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    dispatch({ type: types.LOAD_PREVIEW_FAILURE, payload: error.message });
  }
};

/**
 * Action untuk mengubah tipe device pada preview.
 * @param {string} deviceType - Tipe device ('Desktop', 'Tablet', 'Mobile').
 */
export const setPreviewDevice = (deviceType) => ({
  type: types.SET_PREVIEW_DEVICE,
  payload: deviceType,
});

/**
 * Action untuk membersihkan state preview saat keluar dari halaman.
 */
export const clearPreview = () => ({
  type: types.CLEAR_PREVIEW,
});
