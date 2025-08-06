import * as actionTypes from "../../shared/constants/ActionTypes";
import { routesConfig as baseRoutes } from "../../pages/RoutesConfig";

/**
 * Action untuk mengambil dan menggabungkan rute navigasi.
 * Logika yang sebelumnya ada di `loadPublishedRoutes` di komponen Navbar
 * dipindahkan ke sini untuk memisahkan state logic.
 */
export const fetchNavbarRoutes = () => (dispatch, getState) => {
  dispatch({ type: actionTypes.FETCH_NAVBAR_ROUTES_START });

  try {
    const { pages: publishedPages } = getState().publishedPage;

    const publishedRoutes = publishedPages.map((page) => ({
      id: `published-${page.id}`,
      title: page.name,
      messageId: page.name,
      type: "item",
      url: `/dashboard/${page.id}`,
    }));

    const newRoutes = baseRoutes.map((route) => {
      if (route.id === "dashboard" && route.type === "group") {
        const staticChildren = route.children || [];
        return { ...route, children: [...staticChildren, ...publishedRoutes] };
      }
      return route;
    });

    dispatch({
      type: actionTypes.FETCH_NAVBAR_ROUTES_SUCCESS,
      payload: newRoutes,
    });
  } catch (error) {
    dispatch({
      type: actionTypes.FETCH_NAVBAR_ROUTES_FAILURE,
      payload: error.message,
    });
  }
};
