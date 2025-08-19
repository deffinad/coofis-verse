import * as types from "../../shared/constants/ActionTypes";
import { showAlert } from "./alertActions";

// Utility function untuk generate random ID

const generateUniqueComponentId = (componentType) => {
  return `${componentType}-${generateRandomId()}`;
};

const generateRandomId = () => {
  return Math.random().toString(36).substr(2, 8);
};

// Page Management Actions
export const setPages = (pages) => ({
  type: types.SET_PAGES,
  payload: pages,
});

export const addPage = () => (dispatch, getState) => {
  const { layout } = getState();
  const { pages } = layout;

  const newPage = {
    id: `pages${pages.length + 1}`,
    name: `Page ${pages.length + 1}`,
    layouts: [],
  };

  dispatch({
    type: types.ADD_PAGE,
    payload: newPage,
  });

  dispatch(setCurrentPage(newPage.id));
  dispatch(showAlert(`Page ${newPage.name} added successfully!`, "success"));
};

export const deletePage = (pageIdToDelete) => (dispatch, getState) => {
  const { layout } = getState();
  const { pages, currentPage } = layout;

  dispatch({
    type: types.DELETE_PAGE,
    payload: pageIdToDelete,
  });

  const updatedPages = pages.filter((page) => page.id !== pageIdToDelete);

  if (currentPage === pageIdToDelete) {
    dispatch(
      setCurrentPage(updatedPages.length > 0 ? updatedPages[0].id : null)
    );
  }

  dispatch(showAlert("Page deleted successfully!", "info"));
};

export const setCurrentPage = (pageId) => ({
  type: types.SET_CURRENT_PAGE,
  payload: pageId,
});


// Layout Structure Actions
export const addLayout = () => (dispatch, getState) => {
  const { layout } = getState();
  const { currentPage } = layout;

  if (!currentPage) {
    dispatch(showAlert("Please select a page first.", "warning"));
    return;
  }

  const newLayout = {
    id: generateRandomId(),
    name: "Container",
    properties: {
      size: { desktop: 12, tablet: 12, mobile: 12 },
      height: "100%",
    },
    children: [],
  };

  dispatch({
    type: types.ADD_LAYOUT,
    payload: { pageId: currentPage, layout: newLayout },
  });

  dispatch(showAlert("New layout added!", "success"));
};

export const deleteLayout = (layoutId) => (dispatch, getState) => {
  const { layout } = getState();
  const { currentPage } = layout;

  dispatch({
    type: types.DELETE_LAYOUT,
    payload: { pageId: currentPage, layoutId },
  });

  dispatch(clearSelections());
  dispatch(showAlert("Layout deleted successfully!", "info"));
};

export const addGrid = () => (dispatch, getState) => {
  const { layout } = getState();
  const { selectedLayout, currentPage } = layout;

  if (!selectedLayout) {
    dispatch(showAlert("Pilih layout terlebih dahulu.", "warning"));
    return;
  }

  const newGrid = {
    id: generateRandomId(),
    name: "Layout",
    properties: {
      size: { desktop: 12, tablet: 12, mobile: 12 },
      height: "140px",
    },
    children: [],
  };

  dispatch({
    type: types.ADD_GRID,
    payload: { pageId: currentPage, layoutId: selectedLayout, grid: newGrid },
  });

  dispatch(showAlert("New grid added!", "success"));
};

export const deleteGrid = (gridId) => (dispatch, getState) => {
  const { layout } = getState();
  const { currentPage } = layout;

  dispatch({
    type: types.DELETE_GRID,
    payload: { pageId: currentPage, gridId },
  });

  dispatch(setSelectedGrid(null));
  dispatch(setAtribut(null));
  dispatch(showAlert("Grid deleted successfully!", "info"));
};

export const applyLayoutTemplate = (templateLayout) => (dispatch, getState) => {
  const { layout } = getState();
  const { currentPage, pages } = layout;

  if (!currentPage) {
    dispatch(
      showAlert("Please select a page first to apply a template.", "warning")
    );
    return;
  }

  const pageIndex = pages.findIndex((p) => p.id === currentPage);
  if (pageIndex === -1) return;

  // Generate unique IDs untuk template
  const generateUniqueIds = (items) => {
    return items.map((item) => {
      const newItem = {
        ...item,
        id: `${item.name
          .toLowerCase()
          .replace(/\s/g, "-")}-${generateRandomId()}`,
      };

      // Untuk children components, pastikan juga ID unik
      if (newItem.children && newItem.children.length > 0) {
        newItem.children = generateUniqueIds(newItem.children);
      }

      // Pastikan properties memiliki struktur yang benar
      if (newItem.properties && !newItem.properties.size) {
        newItem.properties.size = { desktop: 12, tablet: 12, mobile: 12 };
      } else if (
        newItem.properties &&
        typeof newItem.properties.size === "number"
      ) {
        newItem.properties.size = {
          desktop: newItem.properties.size,
          tablet: 12,
          mobile: 12,
        };
      }

      return newItem;
    });
  };

  const newLayoutsToAdd = generateUniqueIds(templateLayout);

  dispatch({
    type: types.APPLY_LAYOUT_TEMPLATE,
    payload: { pageId: currentPage, layouts: newLayoutsToAdd },
  });

  dispatch(clearSelections());
  dispatch(showAlert("Layout template applied successfully!", "success"));
};

export const updateComponentProperty = (componentId, path, value) => ({
  type: types.UPDATE_COMPONENT_PROPERTY,
  payload: { componentId, path, value },
});

// Selection Actions
export const setSelectedLayout = (layoutId) => ({
  type: types.SET_SELECTED_LAYOUT,
  payload: layoutId,
});

export const setSelectedGrid = (grid) => ({
  type: types.SET_SELECTED_GRID,
  payload: grid,
});

export const setSelectedLayoutIndex = (index) => ({
  type: types.SET_SELECTED_LAYOUT_INDEX,
  payload: index,
});

export const setAtribut = (atribut) => ({
  type: types.SET_ATRIBUT,
  payload: atribut,
});

export const clearSelections = () => ({
  type: types.CLEAR_SELECTIONS,
});

// Form Data Actions
export const setFormData = (formData) => ({
  type: types.SET_FORM_DATA,
  payload: formData,
});

export const setNewSize = (size) => ({
  type: types.SET_NEW_SIZE,
  payload: size,
});

export const setNewHeight = (height) => ({
  type: types.SET_NEW_HEIGHT,
  payload: height,
});

export const setNewMenuItem = (menuItem) => ({
  type: types.SET_NEW_MENU_ITEM,
  payload: menuItem,
});

// UI State Actions
export const setActiveId = (activeId) => ({
  type: types.SET_ACTIVE_ID,
  payload: activeId,
});

export const setMenuAnchorEl = (anchorEl) => ({
  type: types.SET_MENU_ANCHOR_EL,
  payload: anchorEl,
});

export const setSelectedPageForMenu = (page) => ({
  type: types.SET_SELECTED_PAGE_FOR_MENU,
  payload: page,
});

export const setTemp = (temp) => ({
  type: types.SET_TEMP,
  payload: temp,
});

// Component Properties Actions
export const addComponentToGrid =
  (gridId, component) => (dispatch, getState) => {
    const { layout } = getState();
    const { currentPage } = layout;

    if (!currentPage) {
      dispatch(showAlert("Please select a page first.", "warning"));
      return;
    }

    // Pastikan komponen memiliki ID unik dengan mengganti ID lama
    const newComponent = {
      ...component,
      id: generateUniqueComponentId(component.name || "component"), // Generate ID baru yang unik
      properties: {
        ...component.properties, // Copy semua properties
      },
    };

    dispatch({
      type: types.ADD_COMPONENT_TO_GRID,
      payload: { pageId: currentPage, gridId, component: newComponent },
    });

    dispatch(showAlert(`${newComponent.name} added to grid!`, "success"));
  };

export const updateSiblingHeights =
  (targetGridId, newHeightValue) => (dispatch, getState) => {
    const { layout } = getState();
    const { currentPage } = layout;

    dispatch({
      type: types.UPDATE_SIBLING_HEIGHTS,
      payload: {
        pageId: currentPage,
        targetGridId,
        heightValue: newHeightValue,
      },
    });
  };

export const autoSyncContainerHeight =
  (containerId) => (dispatch, getState) => {
    const { layout } = getState();
    const { currentPage, pages } = layout;

    if (!currentPage) return;

    const currentPageData = pages.find((page) => page.id === currentPage);
    if (!currentPageData) return;

    // Fungsi rekursif untuk mencari container dan menghitung tinggi otomatis
    const findAndUpdateContainer = (layouts) => {
      return layouts.map((item) => {
        if (item.id === containerId && item.name === "Container") {
          // Hitung tinggi otomatis berdasarkan children
          const maxChildHeight = item.children.reduce((max, child) => {
            if (child.properties?.height) {
              const heightValue = parseInt(
                child.properties.height.replace("px", "")
              );
              return Math.max(max, heightValue);
            }
            return max;
          }, 0);

          const autoHeight =
            maxChildHeight > 0 ? `${maxChildHeight}px` : "auto";

          return {
            ...item,
            properties: {
              ...item.properties,
              height: autoHeight,
            },
          };
        }

        if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: findAndUpdateContainer(item.children),
          };
        }

        return item;
      });
    };

    const updatedLayouts = findAndUpdateContainer(currentPageData.layouts);

    dispatch({
      type: types.AUTO_SYNC_CONTAINER_HEIGHT,
      payload: {
        pageId: currentPage,
        layouts: updatedLayouts,
      },
    });

    console.log(`Auto-synced container ${containerId} height`);
  };

export const reorderLayouts =
  (sourceId, destinationId) => (dispatch, getState) => {
    const { layout } = getState();
    const { currentPage } = layout;

    dispatch({
      type: types.REORDER_LAYOUTS,
      payload: { pageId: currentPage, sourceId, destinationId },
    });
  };

export const updateLayerOrder = (pageId, parentId, newOrder) => ({
  type: types.UPDATE_LAYER_ORDER,
  payload: { pageId, parentId, newOrder },
});

export const saveOrder = (layoutIndex, tempData) => (dispatch, getState) => {
  const { layout } = getState();
  const { selectedLayout, currentPage } = layout;

  if (layoutIndex === undefined || !tempData) {
    dispatch(
      showAlert(
        "Please select a layout and reorder items before saving.",
        "warning"
      )
    );
    return;
  }

  dispatch({
    type: types.SAVE_ORDER,
    payload: { pageId: currentPage, layoutId: selectedLayout, tempData },
  });

  dispatch(setTemp(null));
  dispatch(showAlert("Order has been saved successfully.", "success"));
};
