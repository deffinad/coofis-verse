// React Core Libraries
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Third-Party Libraries
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

// Material-UI (MUI) Components
import { Box, Button } from "@mui/material";

// Local Application Components
import EditorNavbar from "./EditorNavbar";
import LeftMenu from "./LeftMenu";
import MainContent from "./MainContent";
import RightMenu from "./RightMenu";
import AlertPopup from "../../shared/components/AlertPopup";
import Preview from "./Preview";
import { debounce } from "../../utils/debounce";
import { SECTION_COMPONENTS } from "../../shared/editorConstants";

// JSON Data Imports
import { DataCuti } from "../../json/DocsCuti";
import { DataKuota } from "../../json/DocsKuota";
import { DateData } from "../../json/DateData";
import { KuotaCuti1 } from "../../json/DocsKuotaCuti1";
import { KuotaCuti2 } from "../../json/DocsKuotaCuti2";
import { COLOR, SPACING } from "@/shared/AppConst";

import { LayoutTemplates } from "../../json/LayoutTemplates";

// --- Komponen Utama ---
const Layout = () => {
  // --- 1. State Management ---
  // State untuk data inti (halaman, layout, grid)
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [selectedLayoutIndex, setSelectedLayoutIndex] = useState();
  const [selectedGrid, setSelectedGrid] = useState(null);
  const [atribut, setAtribute] = useState(null);

  // State baru untuk mengontrol visibilitas Preview
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // State untuk form dan properti di menu kanan
  const [formData, setFormData] = useState({});
  const [newSize, setNewSize] = useState({
    desktop: 12,
    tablet: 12,
    mobile: 12,
  });
  const [newHeight, setNewHeight] = useState();
  const [newMenuItem, setNewMenuItem] = useState({ label: "", path: "" });

  // State untuk fungsionalitas UI (DND, menu, etc.)
  const [activeId, setActiveId] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedPageForMenu, setSelectedPageForMenu] = useState(null);
  const [temp, setTemp] = useState();

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info", // 'success', 'error', 'warning', 'info'
  });

  const layoutContainerRef = useRef(null);

  const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 8);
  };

  /**
   * Applies a predefined layout template to the current page.
   * It generates unique IDs for all nested elements within the template.
   * @param {Array} templateLayout - The layout structure to apply.
   */
  const handleApplyLayoutTemplate = (templateLayout) => {
    if (!currentPage) {
      showNotification(
        "Please select a page first to apply a template.",
        "warning"
      );
      return;
    }

    const pageIndex = pages.findIndex((p) => p.id === currentPage);
    if (pageIndex === -1) return;

    const generateUniqueIds = (items) => {
      return items.map((item) => {
        const newItem = {
          ...item,
          id: `${item.name
            .toLowerCase()
            .replace(/\s/g, "-")}-${generateRandomId()}`,
        };
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
        if (newItem.children && newItem.children.length > 0) {
          newItem.children = generateUniqueIds(newItem.children);
        }
        return newItem;
      });
    };

    const newLayoutsToAdd = generateUniqueIds(templateLayout);

    setPages((prevPages) => {
      const updatedPages = [...prevPages];
      updatedPages[pageIndex] = {
        ...updatedPages[pageIndex],
        layouts: [...newLayoutsToAdd],
      };
      return updatedPages;
    });

    setSelectedLayout(null);
    setSelectedGrid(null);
    setSelectedLayoutIndex(null);

    showNotification("Layout template applied successfully!", "success");
  };

  // --- 2. Refs ---
  const containerRefs = useRef({});

  // --- 3. Konfigurasi Hooks (Sensors untuk DND Kit) ---
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // --- 4. Side Effects (useEffect) ---
  useEffect(() => {
    const savedPages = localStorage.getItem("savedPages");
    const currentpages = localStorage.getItem("curentPages");
    if (savedPages) {
      try {
        setPages(JSON.parse(savedPages));
        setCurrentPage(JSON.parse(currentpages));
      } catch (e) {
        console.error("Failed to parse pages from localStorage", e);
      }
    }
  }, []);

  const throttledSave = useCallback(
    debounce((pages, currentPage) => {
      localStorage.setItem("savedPages", JSON.stringify(pages));
      localStorage.setItem("curentPages", JSON.stringify(currentPage));
    }, 1000),
    []
  );

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
        setTemp(event);
      });
    });

    return () => {
      activePage.layouts.forEach((layout) => {
        if (containerRefs.current[layout.id]?.swapy?.destroy) {
          containerRefs.current[layout.id].swapy.destroy();
        }
      });
    };
  }, [pages, currentPage]);

  useEffect(() => {
    if (atribut) {
      setFormData(atribut.properties || {});
    } else {
      setFormData({});
    }
    if (selectedGrid?.properties) {
      const currentSize = selectedGrid.properties.size;
      if (typeof currentSize === "object" && currentSize !== null) {
        setNewSize(currentSize);
      } else {
        setNewSize({ desktop: currentSize || 12, tablet: 12, mobile: 12 });
      }
      setNewHeight(parseInt(selectedGrid.properties.height) || 0);
    }
  }, [atribut?.id, selectedGrid?.id]);

  useEffect(() => {
    setSelectedLayout(null);
    setSelectedGrid(null);
    setAtribute(null);
  }, [currentPage]);

  // --- 5. Helper Functions & Event Handlers ---

  const addPage = () => {
    const newPage = {
      id: `pages${pages.length + 1}`,
      name: `Page ${pages.length + 1}`,
      layouts: [],
    };
    setPages([...pages, newPage]);
    setCurrentPage(newPage.id);
  };

  const deletePage = (pageIdToDelete) => {
    const updatedPages = pages.filter((page) => page.id !== pageIdToDelete);
    setPages(updatedPages);
    if (currentPage === pageIdToDelete) {
      setCurrentPage(updatedPages.length > 0 ? updatedPages[0].id : null);
    }
    handleMenuClose();
  };

  const addLayout = () => {
    if (!currentPage) {
      showNotification("Please select a page first.", "warning");
      return;
    }
    const pageIndex = pages.findIndex((p) => p.id === currentPage);
    if (pageIndex === -1) return;

    const newLayout = {
      id: generateRandomId(),
      name: "Container",
      properties: {
        size: { desktop: 12, tablet: 12, mobile: 12 },
        height: "100%",
      },
      children: [],
    };
    const updatedPages = [...pages];
    updatedPages[pageIndex].layouts.push(newLayout);
    setPages(updatedPages);
  };

  const deleteLayout = () => {
    if (!selectedLayout) return;

    const removeFromLayout = (layouts) => {
      return layouts
        .filter((layout) => layout.id !== selectedLayout)
        .map((layout) => {
          if (layout.children && layout.children.length > 0) {
            return { ...layout, children: removeFromLayout(layout.children) };
          }
          return layout;
        });
    };

    setPages(
      pages.map((p) =>
        p.id === currentPage
          ? { ...p, layouts: removeFromLayout(p.layouts) }
          : p
      )
    );
    setSelectedLayout(null);
  };

  const addGrid = () => {
    if (!selectedLayout) {
      showNotification("Pilih layout terlebih dahulu.", "warning");
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

    const addToLayout = (layouts) => {
      return layouts.map((layout) => {
        if (layout.id === selectedLayout) {
          return { ...layout, children: [...layout.children, newGrid] };
        }
        if (layout.children && layout.children.length > 0) {
          return { ...layout, children: addToLayout(layout.children) };
        }
        return layout;
      });
    };

    setPages(
      pages.map((p) =>
        p.id === currentPage ? { ...p, layouts: addToLayout(p.layouts) } : p
      )
    );
  };

  const showNotification = (message, severity = "info") => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleDeleteGrid = () => {
    if (!selectedGrid) return;
    const removeRecursive = (layouts, id) => {
      return layouts
        .filter((layout) => layout.id !== id)
        .map((layout) => {
          if (layout.children && layout.children.length > 0) {
            return {
              ...layout,
              children: removeRecursive(layout.children, id),
            };
          }
          return layout;
        });
    };

    setPages(
      pages.map((p) =>
        p.id === currentPage
          ? { ...p, layouts: removeRecursive(p.layouts, selectedGrid.id) }
          : p
      )
    );
    setSelectedGrid(null);
    setAtribute(null);
  };

  const addLayoutOrGrid = () => {
    if (selectedLayout) {
      addGrid();
    } else {
      addLayout();
    }
  };

  const handleDelete = () => {
    if (selectedGrid) {
      handleDeleteGrid();
    } else if (selectedLayout) {
      deleteLayout();
    } else {
      showNotification("Please select a layout or grid to delete.", "warning");
    }
  };

  /**
   * Updates the properties of a specific component (layout or grid) within the current page.
   * This is a core function for the right-side property panel.
   * @param {string} componentId - The ID of the component to update.
   * @param {object} newProperties - The new properties to merge with existing ones.
   */
  const updateComponentProperties = (componentId, newProperties) => {
    setPages((prevPages) => {
      const updatedPages = prevPages.map((p) => {
        if (p.id !== currentPage) return p;

        const updateRecursive = (layouts) => {
          return layouts.map((layout) => {
            if (layout.id === componentId) {
              return {
                ...layout,
                properties: {
                  ...layout.properties,
                  ...newProperties,
                },
              };
            }
            if (layout.children?.length > 0) {
              return { ...layout, children: updateRecursive(layout.children) };
            }
            return layout;
          });
        };

        const newLayouts = updateRecursive(p.layouts);
        return { ...p, layouts: newLayouts };
      });
      return updatedPages;
    });
  };

  // Debounced version of the property updater to prevent excessive re-renders.
  const debouncedUpdateComponentProperties = useCallback(
    debounce((id, props) => {
      updateComponentProperties(id, props);
    }, 500),
    [currentPage]
  );

  const findComponentAndParent = (layouts, componentId, parent = null) => {
    for (const layout of layouts) {
      if (layout.id === componentId) {
        return { component: layout, parent: parent };
      }
      if (layout.children && layout.children.length > 0) {
        const found = findComponentAndParent(
          layout.children,
          componentId,
          layout
        );
        if (found) return found;
      }
    }
    return null;
  };

  const updateSiblingHeights = (targetGridId, newHeightValue) => {
    setPages((prevPages) => {
      const updatedPages = prevPages.map((p) => {
        if (p.id !== currentPage) return p;

        const updateRecursive = (layouts) => {
          const found = findComponentAndParent(layouts, targetGridId);

          if (found && found.parent) {
            const parentLayout = found.parent;
            const updatedChildren = parentLayout.children.map((child) => {
              if (child.name === "Layout" || child.name === "Container") {
                return {
                  ...child,
                  properties: {
                    ...child.properties,
                    height: `${newHeightValue}px`,
                  },
                };
              }
              return child;
            });

            return layouts.map((layout) => {
              if (layout.id === parentLayout.id) {
                return { ...layout, children: updatedChildren };
              }
              if (layout.children && layout.children.length > 0) {
                return {
                  ...layout,
                  children: updateRecursive(layout.children),
                };
              }
              return layout;
            });
          } else if (found && !found.parent) {
            return layouts.map((layout) => {
              if (layout.id === targetGridId) {
                return {
                  ...layout,
                  properties: {
                    ...layout.properties,
                    height: `${newHeightValue}px`,
                  },
                };
              }
              return layout;
            });
          }
          if (layouts && layouts.length > 0) {
            return layouts.map((layout) => {
              if (layout.children && layout.children.length > 0) {
                return {
                  ...layout,
                  children: updateRecursive(layout.children),
                };
              }
              return layout;
            });
          }
          return layouts;
        };

        const newLayouts = updateRecursive(p.layouts);
        return { ...p, layouts: newLayouts };
      });
      return updatedPages;
    });
  };

  const handleRealtimeSizeChange = useCallback(
    (device, value) => {
      if (!selectedGrid) return;

      const numValue = value === "" ? "" : parseInt(value, 10);

      let finalValue = numValue;
      if (numValue !== "" && (isNaN(numValue) || numValue < 1)) {
        finalValue = 1;
      } else if (numValue > 12) {
        finalValue = 12;
      }

      const updatedSize = { ...newSize, [device]: finalValue };
      setNewSize(updatedSize);
      debouncedUpdateComponentProperties(selectedGrid.id, {
        size: updatedSize,
      });
    },
    [selectedGrid, newSize, debouncedUpdateComponentProperties]
  );
  const debouncedUpdateSiblingHeights = useCallback(
    debounce((id, height) => {
      updateSiblingHeights(id, height);
    }, 500),
    [currentPage]
  );

  const handleRealtimeHeightChange = useCallback(
    (newHeightValue) => {
      if (!selectedGrid) return;
      const finalHeight =
        newHeightValue === "" ? "" : parseInt(newHeightValue, 10);
      setNewHeight(finalHeight);

      debouncedUpdateSiblingHeights(selectedGrid.id, finalHeight);
    },
    [selectedGrid, debouncedUpdateSiblingHeights]
  );

  const handlePropertyChange = useCallback(
    (path, value) => {
      const updateNested = (obj, pathArr, val) => {
        if (pathArr.length === 1) {
          return { ...obj, [pathArr[0]]: val };
        }
        const [head, ...rest] = pathArr;
        return {
          ...obj,
          [head]: updateNested(obj[head] || {}, rest, val),
        };
      };

      const pathArray = path.split(".");

      setFormData((prev) => updateNested(prev, pathArray, value));

      setPages((prevPages) => {
        return prevPages.map((page) => {
          if (page.id !== currentPage) return page;

          const updatedLayouts = page.layouts.map((layout) => {
            const findAndUpdateGrid = (currentLayouts) => {
              return currentLayouts.map((l) => {
                if (l.id === selectedGrid?.id) {
                  return {
                    ...l,
                    children: l.children.map((child) => {
                      if (child.id === atribut?.id) {
                        return {
                          ...child,
                          properties: updateNested(
                            child.properties,
                            pathArray,
                            value
                          ),
                        };
                      }
                      return child;
                    }),
                  };
                }
                if (l.children && l.children.length > 0) {
                  return { ...l, children: findAndUpdateGrid(l.children) };
                }
                return l;
              });
            };
            return findAndUpdateGrid([layout])[0];
          });
          return { ...page, layouts: updatedLayouts };
        });
      });
    },
    [currentPage, selectedGrid?.id, atribut?.id]
  );

  const handleSubmit = () => {
    if (!selectedGrid || !atribut) return;
    showNotification("Properties have been saved.", "success");
  };

  const handleAddMenuItem = () => {
    if (!newMenuItem.label || !newMenuItem.path) {
      showNotification("Both label and path must be filled.", "warning");
      return;
    }

    const currentMenuItems = atribut.properties?.menuItems || [];
    const updatedMenuItems = [...currentMenuItems, newMenuItem];

    handlePropertyChange("menuItems", updatedMenuItems);

    setNewMenuItem({ label: "", path: "" });
  };

  const handleDeleteMenuItem = (indexToDelete) => {
    const currentMenuItems = atribut.properties?.menuItems || [];
    const updatedMenuItems = currentMenuItems.filter(
      (_, i) => i !== indexToDelete
    );

    handlePropertyChange("menuItems", updatedMenuItems);
  };

  const handleLayoutClick = (layoutId, layoutidx) => {
    if (selectedLayout === layoutId) {
      setSelectedLayout(null);
      setSelectedLayoutIndex(null);
      setSelectedGrid(null);
      setAtribute(null);
    } else {
      setSelectedLayout(layoutId);
      setSelectedLayoutIndex(layoutidx);
      setSelectedGrid(null);
      setAtribute(null);
    }
  };

  const handleGridClick = (layout, layoutId, layoutidx) => {
    setSelectedLayout(layoutId);
    setSelectedLayoutIndex(layoutidx);
    setSelectedGrid(layout);
    setAtribute(layout.children?.[0] || null);
  };

  const handleLayerSelectFromLeftMenu = (
    layer,
    parentLayoutId = null,
    parentLayoutIndex = null
  ) => {
    if (layer.name === "Container") {
      handleLayoutClick(layer.id, parentLayoutIndex); // Gunakan ID layer sebagai layoutId
    } else if (layer.name === "Layout") {
      handleGridClick(layer, parentLayoutId, parentLayoutIndex);
    } else {
      if (parentLayoutId && parentLayoutIndex !== null) {
        // Cari objek layout/grid induk berdasarkan ID
        const activePage = pages.find((p) => p.id === currentPage);
        if (!activePage) return;

        const findParentGridOrLayout = (items, targetId) => {
          for (const item of items) {
            if (item.id === targetId) {
              return item;
            }
            if (item.children && item.children.length > 0) {
              const found = findParentGridOrLayout(item.children, targetId);
              if (found) return item;
            }
          }
          return null;
        };

        const parentGridOrLayout = findParentGridOrLayout(
          activePage.layouts,
          layer.id
        );
        if (parentGridOrLayout) {
          handleGridClick(
            parentGridOrLayout,
            parentLayoutId,
            parentLayoutIndex
          );
        } else {
          setSelectedLayout(null);
          setSelectedGrid(null);
          setAtribute(null);
        }
      } else {
        setSelectedLayout(null);
        setSelectedGrid(null);
        setAtribute(null);
      }
    }
  };

  const handleMenuOpen = (event, page) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedPageForMenu(page);
  };

  const handleMenuClose = () => setMenuAnchorEl(null);

  const handleDragStart = (event) => setActiveId(event.active.id);

  /**
   * Handles the end of a drag-and-drop operation.
   * It determines if the dragged item is a new component or a layout template
   * and updates the page structure accordingly.
   * @param {object} event - The drag-end event object from dnd-kit.
   */
  const handleDragEnd = (event) => {
    setActiveId(null);
    const { over, active } = event;
    if (!over) return;

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

    let gridHasChild = false;
    const checkGrid = (layouts) => {
      for (const layout of layouts) {
        if (layout.id === dropTargetId && layout.children.length > 0) {
          gridHasChild = true;
          return;
        }
        if (layout.children) checkGrid(layout.children);
      }
    };
    pages
      .find((p) => p.id === currentPage)
      ?.layouts.forEach((l) => checkGrid([l]));

    if (gridHasChild) {
      showNotification(
        "This grid already contains a component. Only one component is allowed per grid.",
        "warning"
      );
      return;
    }

    const componentAttributes = {
      Navbar: {
        id: `component${generateRandomId()}`,
        name: "Navbar",
        properties: {
          title: "My Website",
          height: 65,
          backgroundColor: "#ffffff",
          textColor: "#333333",
          activeTextColor: "#007bff",
        },
      },
      CustomCard: {
        id: `component${generateRandomId()}`,
        name: "CustomCard",
        properties: {
          mainTitle: "Card Title",
          description: "Card description text",
          buttonText: "Learn More",
        },
      },
      ArsipCuti: {
        id: `component${generateRandomId()}`,
        name: "ArsipCuti",
        properties: {},
      },
      KuotaCutiSaatIni: {
        id: `component${generateRandomId()}`,
        name: "KuotaCutiSaatIni",
        properties: { config1: KuotaCuti1, config2: KuotaCuti2 },
      },
      ListDate: {
        id: `component${generateRandomId()}`,
        name: "ListDate",
        properties: { config: DateData },
      },
      MonitoringKuota: {
        id: `component${generateRandomId()}`,
        name: "MonitoringKuota",
        properties: { config: DataKuota },
      },
      StatusDokumenCutiDashboard: {
        id: `component${generateRandomId()}`,
        name: "StatusDokumenCutiDashboard",
        properties: { config: DataCuti },
      },
    };
    const newComponent = componentAttributes[componentType] || {
      id: `component${generateRandomId()}`,
      name: "Unknown",
    };

    const addComponentRecursive = (layouts) => {
      return layouts.map((layout) => {
        if (layout.id === dropTargetId) {
          return { ...layout, children: [newComponent] };
        }
        if (layout.children?.length > 0) {
          return {
            ...layout,
            children: addComponentRecursive(layout.children),
          };
        }
        return layout;
      });
    };
    setPages(
      pages.map((p) =>
        p.id === currentPage
          ? { ...p, layouts: addComponentRecursive(p.layouts) }
          : p
      )
    );
  };

  const handleLayerDragEnd = useCallback(
    (event) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      setPages((prevPages) => {
        const pageIndex = prevPages.findIndex((p) => p.id === currentPage);
        if (pageIndex === -1) return prevPages;

        const layouts = prevPages[pageIndex].layouts;

        const findAndReorder = (items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);

          if (oldIndex !== -1 && newIndex !== -1) {
            return arrayMove(items, oldIndex, newIndex);
          }

          for (const item of items) {
            if (item.children && item.children.length > 0) {
              const reorderedChildren = findAndReorder(item.children);

              if (reorderedChildren !== item.children) {
                return items.map((i) =>
                  i.id === item.id ? { ...i, children: reorderedChildren } : i
                );
              }
            }
          }

          return items;
        };

        const newLayouts = findAndReorder(layouts);

        const updatedPages = [...prevPages];
        updatedPages[pageIndex] = {
          ...updatedPages[pageIndex],
          layouts: newLayouts,
        };

        return updatedPages;
      });
    },
    [currentPage]
  );

  const saveOrder = (layoutIndex) => {
    if (layoutIndex === undefined || !temp) {
      showNotification(
        "Please select a layout and reorder items before saving.",
        "warning"
      );
      return;
    }

    const updateOrder = (layouts) => {
      return layouts.map((layout) => {
        if (layout.id === selectedLayout) {
          const childrenMap = new Map(layout.children.map((c) => [c.id, c]));
          const newChildren = temp.newSlotItemMap.asArray
            .map((item) => childrenMap.get(item.item))
            .filter(Boolean);
          return { ...layout, children: newChildren };
        }
        if (layout.children?.length > 0) {
          return { ...layout, children: updateOrder(layout.children) };
        }
        return layout;
      });
    };

    setPages(
      pages.map((p) => {
        if (p.id !== currentPage) return p;
        return { ...p, layouts: updateOrder(p.layouts) };
      })
    );
    showNotification("Order has been saved successfully.", "success");
    setTemp(null);
  };

  // Handler untuk Global Actions (Navbar Editor)
  const handleSave = () => {
    localStorage.setItem("savedPages", JSON.stringify(pages));
    showNotification("Project saved!", "success");
  };

  // Ubah handlePreview untuk membuka modal
  const handlePreview = () => {
    localStorage.setItem("savedPages", JSON.stringify(pages));
    localStorage.setItem("curentPages", JSON.stringify(currentPage));
    setIsPreviewOpen(true);
  };

  // Fungsi untuk menutup modal Preview
  const handleClosePreviewModal = () => {
    setIsPreviewOpen(false);
  };

  const handlePublish = () => showNotification("Project published!", "info");


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
          {/* Left Menu */}
          <LeftMenu
            pages={pages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onAddPage={addPage}
            menuAnchorEl={menuAnchorEl}
            onMenuClose={handleMenuClose}
            selectedPageForMenu={selectedPageForMenu}
            onDeletePage={deletePage}
            onMenuOpen={handleMenuOpen}
            selectedGrid={selectedGrid}
            selectedLayout={selectedLayout}
            sectionComponents={SECTION_COMPONENTS}
            onLayerReorder={handleLayerDragEnd}
            onApplyLayoutTemplate={handleApplyLayoutTemplate}
            onLayerSelect={handleLayerSelectFromLeftMenu}
          />
          {/* Main Content */}
          <MainContent
            pages={pages}
            currentPage={currentPage}
            selectedLayout={selectedLayout}
            selectedGrid={selectedGrid}
            selectedLayoutIndex={selectedLayoutIndex}
            containerRefs={containerRefs}
            onLayoutClick={handleLayoutClick}
            onGridClick={handleGridClick}
            onAddLayoutOrGrid={addLayoutOrGrid}
            onSaveOrder={saveOrder}
            onDelete={handleDelete}
            activeId={activeId}
          />
          {/* Right Menu */}
          <RightMenu
            selectedGrid={selectedGrid}
            atribut={atribut}
            formData={formData}
            newSize={newSize}
            newHeight={newHeight}
            newMenuItem={newMenuItem}
            onDelete={handleDelete}
            onUpdateComponentSize={updateComponentProperties}
            onInputChange={handlePropertyChange}
            onSubmit={handleSubmit}
            onSizeChange={handleRealtimeSizeChange}
            onHeightChange={handleRealtimeHeightChange}
            onMenuItemChange={(field, value) =>
              setNewMenuItem((p) => ({ ...p, [field]: value }))
            }
            onAddMenuItem={handleAddMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
          />
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
      <AlertPopup
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleCloseNotification}
      />

      {/* Render komponen Preview sebagai modal */}
      <Preview
        open={isPreviewOpen}
        onClose={handleClosePreviewModal}
        pages={pages}
        currentPageId={currentPage}
        container={layoutContainerRef.current}
      />
    </DndContext>
  );
};

export default Layout;
