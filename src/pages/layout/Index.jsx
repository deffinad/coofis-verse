import React, { useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { createSwapy } from "swapy";
import { arrayMove } from "@dnd-kit/sortable";
import { Box, Button } from "@mui/material";
import { generateRandomId } from "../../shared/utils/utility";

import EditorNavbar from "./EditorNavbar";
import LeftMenu from "./LeftMenu";
import MainContent from "./MainContent";
import RightMenu from "./RightMenu";
import AlertPopup from "../../shared/components/AlertPopup";
import { debounce } from "../../shared/utils/debounce";
import { SECTION_COMPONENTS } from "../../shared/constants/AppData";
import { showAlert, hideAlert } from "../../redux/actions/alertActions";
import { componentAttributes } from "@/shared/constants/AppData";

// Redux Layout Actions
import {
  loadFromStorage,
  saveToStorage,
  addPage,
  deletePage,
  setCurrentPage,
  addLayout,
  deleteLayout,
  addGrid,
  deleteGrid,
  applyLayoutTemplate,
  setSelectedLayout,
  setSelectedGrid,
  setSelectedLayoutIndex,
  setAtribut,
  clearSelections,
  setFormData,
  setNewSize,
  setNewHeight,
  setNewMenuItem,
  setActiveId,
  setMenuAnchorEl,
  setSelectedPageForMenu,
  setTemp,
  saveOrder,
  addComponentToGrid,
  updateComponentProperty,
} from "../../redux/actions/layoutActions";

import { COLOR, SPACING } from "@/shared/constants/AppConst";
import { LayoutTemplates } from "../../json/LayoutTemplates";

const Layout = () => {
  // Redux state management
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state selectors
  const {
    pages,
    currentPage,
    selectedLayout,
    selectedLayoutIndex,
    selectedGrid,
    atribut,
    formData,
    newSize,
    newHeight,
    newMenuItem,
    activeId,
    menuAnchorEl,
    selectedPageForMenu,
    temp,
  } = useSelector((state) => state.layout);

  const alerts = useSelector((state) => state.alert.alerts);

  // Hooks dan refs
  const layoutContainerRef = useRef(null);
  const containerRefs = useRef({});

  // Sensor configuration untuk DND
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Utility functions
  const throttledSave = useCallback(
    debounce((pages, currentPage) => {
      localStorage.setItem("savedPages", JSON.stringify(pages));
      localStorage.setItem("curentPages", JSON.stringify(currentPage));
    }, 1000),
    []
  );

  // Effects
  useEffect(() => {
    dispatch(loadFromStorage());
  }, [dispatch]);

  useEffect(() => {
    throttledSave(pages, currentPage);
  }, [pages, currentPage, throttledSave]);

  useEffect(() => {
    if (!currentPage) return;
    const activePage = pages.find((p) => p.id === currentPage);
    if (!activePage) return;

    activePage.layouts.forEach((layout) => {
      const containerEl = containerRefs.current[layout.id];
      if (!containerEl) return;
      if (containerEl.swapy?.destroy) {
        containerEl.swapy.destroy();
      }
      containerEl.swapy = createSwapy(containerEl);
      containerEl.swapy.onSwap((event) => {
        dispatch(setTemp(event));
      });
    });

    return () => {
      activePage.layouts.forEach((layout) => {
        if (containerRefs.current[layout.id]?.swapy?.destroy) {
          containerRefs.current[layout.id].swapy.destroy();
        }
      });
    };
  }, [pages, currentPage, dispatch]);

  useEffect(() => {
    if (atribut) {
      dispatch(setFormData(atribut.properties || {}));
    } else {
      dispatch(setFormData({}));
    }
    if (selectedGrid?.properties) {
      const currentSize = selectedGrid.properties.size;
      if (typeof currentSize === "object" && currentSize !== null) {
        dispatch(setNewSize(currentSize));
      } else {
        dispatch(
          setNewSize({ desktop: currentSize || 12, tablet: 12, mobile: 12 })
        );
      }
      dispatch(setNewHeight(parseInt(selectedGrid.properties.height) || 0));
    }
  }, [atribut?.id, selectedGrid?.id, dispatch]);

  useEffect(() => {
    dispatch(clearSelections());
  }, [currentPage, dispatch]);

  // Page management handlers
  const handleAddPage = () => {
    dispatch(addPage());
  };

  // const handleDeletePage = (pageIdToDelete) => {
  //   dispatch(deletePage(pageIdToDelete));
  //   handleMenuClose();
  // };

  // Layout management handlers
  const handleAddLayout = () => {
    dispatch(addLayout());
  };

  const handleDeleteLayout = () => {
    if (!selectedLayout) return;
    dispatch(deleteLayout(selectedLayout));
  };

  const handleAddGrid = () => {
    dispatch(addGrid());
  };

  const handleDeleteGrid = () => {
    if (!selectedGrid) return;
    dispatch(deleteGrid(selectedGrid.id));
  };

  const handleAddLayoutOrGrid = () => {
    if (selectedLayout) {
      handleAddGrid();
    } else {
      handleAddLayout();
    }
  };

  const handleDelete = () => {
    if (selectedGrid) {
      handleDeleteGrid();
    } else if (selectedLayout) {
      handleDeleteLayout();
    } else {
      dispatch(
        showAlert("Please select a layout or grid to delete.", "warning")
      );
    }
  };

  const handleApplyLayoutTemplate = (templateLayout) => {
    dispatch(applyLayoutTemplate(templateLayout));
  };

  // Property change handlers
  const handleRealtimeSizeChange = useCallback(
    (device, value) => {
      if (!selectedGrid) return;

      // Logika validasi nilai tetap di sini (ini adalah UI logic)
      const numValue = value === "" ? "" : parseInt(value, 10);
      let finalValue = numValue;
      if (numValue !== "" && (isNaN(numValue) || numValue < 1)) finalValue = 1;
      else if (numValue > 12) finalValue = 12;

      const updatedSize = { ...newSize, [device]: finalValue };
      dispatch(setNewSize(updatedSize)); // Tetap update UI lokal untuk responsivitas

      // Gunakan debounced dispatcher dengan action baru
      debouncedUpdateProperty(selectedGrid.id, "size", updatedSize);
    },
    [selectedGrid, newSize, dispatch]
  );

  const handleRealtimeHeightChange = useCallback(
    (newHeightValue) => {
      if (!selectedGrid) return;
      const finalHeight =
        newHeightValue === "" ? "" : parseInt(newHeightValue, 10);
      dispatch(setNewHeight(finalHeight)); // Update UI lokal

      // Gunakan debounced dispatcher dengan action baru
      debouncedUpdateProperty(selectedGrid.id, "height", `${finalHeight}px`);
    },
    [selectedGrid, dispatch]
  );

  // Buat satu debounced function untuk semua properti
  const debouncedUpdateProperty = useCallback(
    debounce((id, path, value) => {
      dispatch(updateComponentProperty(id, path, value));
    }, 500), // delay 500ms
    [dispatch]
  );

  const handlePropertyChange = useCallback(
    (path, value) => {
      const targetId = atribut?.id || selectedGrid?.id;

      if (targetId) {
        dispatch(updateComponentProperty(targetId, path, value));
      }
    },
    [dispatch, atribut, selectedGrid]
  );

  const handleSubmit = () => {
    if (!selectedGrid || !atribut) return;
    dispatch(showAlert("Properties have been saved.", "success"));
  };

  // Menu item handlers
  const handleAddMenuItem = () => {
    if (!newMenuItem.label || !newMenuItem.path) {
      dispatch(showAlert("Both label and path must be filled.", "warning"));
      return;
    }

    const currentMenuItems = atribut.properties?.menuItems || [];
    const updatedMenuItems = [...currentMenuItems, newMenuItem];

    handlePropertyChange("menuItems", updatedMenuItems);

    dispatch(setNewMenuItem({ label: "", path: "" }));
    dispatch(showAlert("Menu item added!", "success"));
  };

  const handleDeleteMenuItem = (indexToDelete) => {
    const currentMenuItems = atribut.properties?.menuItems || [];
    const updatedMenuItems = currentMenuItems.filter(
      (_, i) => i !== indexToDelete
    );

    handlePropertyChange("menuItems", updatedMenuItems);
    dispatch(showAlert("Menu item deleted!", "info"));
  };

  // Click handlers
  const handleLayoutClick = (layoutId, layoutidx) => {
    if (selectedLayout === layoutId) {
      dispatch(clearSelections());
    } else {
      dispatch(setSelectedLayout(layoutId));
      dispatch(setSelectedLayoutIndex(layoutidx));
      dispatch(setSelectedGrid(null));
      dispatch(setAtribut(null));
    }
  };

  const handleGridClick = (layout, layoutId, layoutidx) => {
    dispatch(setSelectedLayout(layoutId));
    dispatch(setSelectedLayoutIndex(layoutidx));
    dispatch(setSelectedGrid(layout));
    dispatch(setAtribut(layout.children?.[0] || null));
  };

  // const handleLayerSelectFromLeftMenu = (
  //   layer,
  //   parentLayoutId = null,
  //   parentLayoutIndex = null
  // ) => {
  //   if (layer.name === "Container") {
  //     handleLayoutClick(layer.id, parentLayoutIndex);
  //   } else if (layer.name === "Layout") {
  //     handleGridClick(layer, parentLayoutId, parentLayoutIndex);
  //   } else {
  //     if (parentLayoutId && parentLayoutIndex !== null) {
  //       const activePage = pages.find((p) => p.id === currentPage);
  //       if (!activePage) return;

  //       const findParentGridOrLayout = (items, targetId) => {
  //         for (const item of items) {
  //           if (item.id === targetId) {
  //             return item;
  //           }
  //           if (item.children && item.children.length > 0) {
  //             const found = findParentGridOrLayout(item.children, targetId);
  //             if (found) return item;
  //           }
  //         }
  //         return null;
  //       };

  //       const parentGridOrLayout = findParentGridOrLayout(
  //         activePage.layouts,
  //         layer.id
  //       );
  //       if (parentGridOrLayout) {
  //         handleGridClick(
  //           parentGridOrLayout,
  //           parentLayoutId,
  //           parentLayoutIndex
  //         );
  //       } else {
  //         dispatch(clearSelections());
  //       }
  //     } else {
  //       dispatch(clearSelections());
  //     }
  //   }
  // };

  // Menu handlers
  
  
  // const handleMenuOpen = (event, page) => {
  //   event.stopPropagation();
  //   dispatch(setMenuAnchorEl(event.currentTarget));
  //   dispatch(setSelectedPageForMenu(page));
  // };

  // const handleMenuClose = () => {
  //   dispatch(setMenuAnchorEl(null));
  // };

  const handleCloseReduxAlert = useCallback(
    (id) => {
      dispatch(hideAlert(id));
    },
    [dispatch]
  );

  // Drag and drop handlers
  const handleDragStart = (event) => {
    dispatch(setActiveId(event.active.id));
  };

  const handleDragEnd = (event) => {
    dispatch(setActiveId(null));
    const { over, active } = event;

    if (!over || active.id === over.id) {
      return;
    }

    if (pages.length === 0 || !currentPage) {
      dispatch(showAlert("Cannot add component: No pages exist.", "warning"));
      return;
    }

    const draggedItemId = active.id;
    const dropTargetId = over.id;

    const isLayoutTemplate = LayoutTemplates.some(
      (template) => template.id === draggedItemId
    );

    if (isLayoutTemplate) {
      const templateToApply = LayoutTemplates.find(
        (template) => template.id === draggedItemId
      );
      if (templateToApply) {
        handleApplyLayoutTemplate(templateToApply.layout);
      }
      return;
    }

    const componentType = draggedItemId;

    // Cek apakah grid sudah memiliki child
    let gridHasChild = false;
    const activePage = pages.find((p) => p.id === currentPage);

    if (!activePage) {
      dispatch(showAlert("Active page not found.", "error"));
      return;
    }

    const checkGrid = (layouts) => {
      for (const layout of layouts) {
        if (layout.id === dropTargetId && layout.children.length > 0) {
          gridHasChild = true;
          return;
        }
        if (layout.children) checkGrid(layout.children);
      }
    };

    activePage.layouts.forEach((l) => checkGrid([l]));

    if (gridHasChild) {
      dispatch(
        showAlert(
          "This grid already contains a component. Only one component is allowed per grid.",
          "warning"
        )
      );
      return;
    }

    const newComponent = componentAttributes[componentType] || {
      ...componentAttributes[componentType],
      id: `${componentType}-${generateRandomId()}`,
      name: componentType,
      properties: {
        ...componentAttributes[componentType]?.properties,
      },
    };

    // Gunakan action creator yang baru
    dispatch(addComponentToGrid(dropTargetId, newComponent));
  };

  // const handleLayerDragEnd = useCallback(
  //   (event) => {
  //     const { active, over } = event;

  //     if (!over || active.id === over.id) {
  //       return;
  //     }

  //     const activePage = pages.find((p) => p.id === currentPage);
  //     if (!activePage) return;

  //     // Helper function untuk mencari layer dan parent-nya
  //     const findLayerAndParent = (layouts, targetId, parent = null) => {
  //       for (let i = 0; i < layouts.length; i++) {
  //         const layout = layouts[i];
  //         if (layout.id === targetId) {
  //           return { layer: layout, parent, index: i, siblings: layouts };
  //         }
  //         if (layout.children && layout.children.length > 0) {
  //           const found = findLayerAndParent(layout.children, targetId, layout);
  //           if (found) return found;
  //         }
  //       }
  //       return null;
  //     };

  //     const activeInfo = findLayerAndParent(activePage.layouts, active.id);
  //     const overInfo = findLayerAndParent(activePage.layouts, over.id);

  //     if (!activeInfo || !overInfo) return;

  //     // Cek apakah active dan over berada di level yang sama
  //     if (activeInfo.parent?.id !== overInfo.parent?.id) {
  //       dispatch(
  //         showAlert("Can only reorder items at the same level", "warning")
  //       );
  //       return;
  //     }

  //     // Lakukan reorder menggunakan arrayMove
  //     const siblings = activeInfo.siblings;
  //     const oldIndex = activeInfo.index;
  //     const newIndex = overInfo.index;

  //     const reorderedSiblings = arrayMove(siblings, oldIndex, newIndex);

  //     // Dispatch action untuk update Redux store
  //     dispatch({
  //       type: "UPDATE_LAYER_ORDER",
  //       payload: {
  //         pageId: currentPage,
  //         parentId: activeInfo.parent?.id || null, // null untuk root level
  //         newOrder: reorderedSiblings,
  //       },
  //     });

  //     dispatch(showAlert("Layer order updated!", "success"));
  //   },
  //   [dispatch, currentPage, pages]
  // );

  const handleSaveOrder = (layoutIndex) => {
    dispatch(saveOrder(layoutIndex, temp));
  };

  // Global action handlers
  const handleSave = () => {
    dispatch(saveToStorage());
  };

  const handlePreview = () => {
    localStorage.setItem("savedPages", JSON.stringify(pages));
    localStorage.setItem("curentPages", JSON.stringify(currentPage));
    if (currentPage) {
      navigate(`/preview/${currentPage}`);
    } else {
      dispatch(showAlert("Please select a page to preview.", "warning"));
    }
  };

  const handlePublish = () => {
    if (!currentPage) {
      dispatch(showAlert("Please select a page to publish.", "warning"));
      return;
    }

    const pageToPublish = pages.find((p) => p.id === currentPage);
    if (!pageToPublish) {
      dispatch(showAlert("Could not find the current page data.", "error"));
      return;
    }

    const existingPublished = JSON.parse(
      localStorage.getItem("publishedPages") || "[]"
    );

    const pageIndex = existingPublished.findIndex(
      (p) => p.id === pageToPublish.id
    );

    if (pageIndex > -1) {
      existingPublished[pageIndex] = pageToPublish;
    } else {
      existingPublished.push(pageToPublish);
    }

    localStorage.setItem("publishedPages", JSON.stringify(existingPublished));
    window.dispatchEvent(new Event("storage"));

    dispatch(
      showAlert(
        `Page '${pageToPublish.name}' published successfully!`,
        "success"
      )
    );
  };

  console.log("Struktur JSON Pages:", JSON.stringify(pages, null, 2));

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box
        ref={layoutContainerRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: COLOR.very_light_gray,
          position: "relative",
        }}
      >
        <EditorNavbar
          onSave={handleSave}
          onPreview={handlePreview}
          onPublish={handlePublish}
          projectName={
            pages.find((p) => p.id === currentPage)?.name || "Untitled Project"
          }
          sx={{}}
        />
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            pt: 0,
            pr: SPACING,
            pb: SPACING,
            pl: SPACING,
            gap: SPACING + 1,
            justifyContent: "center",
          }}
        >
          <LeftMenu/>
          <MainContent
            containerRefs={containerRefs}
          />
          <RightMenu/>
        </Box>
      </Box>
      <DragOverlay>
        {activeId ? (
          <Button
            variant="outlined"
            sx={{
              backgroundColor: COLOR.white,
              color: "#1E1E1E",
              borderColor: "#2C2C2C",
              justifyContent: "flex-start",
              textTransform: "none",
              width: "100%",
              borderRadius: SPACING,
              p: SPACING,
              mb: SPACING - 0.5,
              cursor: "grabbing",
            }}
          >
            {activeId}
          </Button>
        ) : null}
      </DragOverlay>

      {alerts.map((alert) => (
        <AlertPopup
          key={alert.id}
          open={true}
          message={alert.message}
          severity={alert.type}
          onClose={() => handleCloseReduxAlert(alert.id)}
        />
      ))}
    </DndContext>
  );
};

export default Layout;
