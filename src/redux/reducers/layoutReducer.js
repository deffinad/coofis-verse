import * as types from "../../shared/constants/ActionTypes";

const initialState = {
  // Data utama
  pages: [],
  currentPage: null,
  selectedLayout: null,
  selectedLayoutIndex: null,
  selectedGrid: null,
  atribut: null,

  // Form data
  formData: {},
  newSize: {
    desktop: 12,
    tablet: 12,
    mobile: 12,
  },
  newHeight: null,
  newMenuItem: { label: "", path: "" },

  // UI state
  activeId: null,
  menuAnchorEl: null,
  selectedPageForMenu: null,
  temp: null,

  // Loading & error state
  loading: false,
  error: null,
};

const validateUniqueIds = (layouts, existingIds = new Set()) => {
  const errors = [];

  const checkRecursive = (items) => {
    items.forEach((item) => {
      if (existingIds.has(item.id)) {
        errors.push(`Duplicate ID found: ${item.id}`);
      } else {
        existingIds.add(item.id);
      }

      if (item.children && item.children.length > 0) {
        checkRecursive(item.children);
      }
    });
  };

  checkRecursive(layouts);
  return errors;
};

// Helper functions
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

const updateRecursive = (layouts, componentId, properties) => {
  return layouts.map((layout) => {
    if (layout.id === componentId) {
      return {
        ...layout,
        properties: {
          ...layout.properties,
          ...properties,
        },
      };
    }
    if (layout.children?.length > 0) {
      const updatedChildren = updateRecursive(
        layout.children,
        componentId,
        properties
      );
      const hasChanges = updatedChildren.some(
        (child, index) => child !== layout.children[index]
      );
      if (hasChanges) {
        return {
          ...layout,
          children: updatedChildren,
        };
      }
    }
    return layout;
  });
};

const recursivelyUpdateOrder = (layouts, parentId, newOrder) => {
  return layouts.map((layout) => {
    // 1. Jika kita menemukan parent yang dicari, ganti children-nya dengan urutan baru.
    if (layout.id === parentId) {
      return {
        ...layout,
        children: newOrder,
      };
    }

    // 2. Jika bukan parent yang dicari, tapi layout ini punya children,
    //    jalankan fungsi ini secara rekursif untuk children tersebut.
    if (layout.children && layout.children.length > 0) {
      return {
        ...layout,
        children: recursivelyUpdateOrder(layout.children, parentId, newOrder),
      };
    }

    // 3. Jika tidak cocok dan tidak punya children, kembalikan layout apa adanya.
    return layout;
  });
};

const removeFromLayout = (layouts, targetId) => {
  return layouts
    .filter((layout) => layout.id !== targetId)
    .map((layout) => {
      if (layout.children && layout.children.length > 0) {
        return {
          ...layout,
          children: removeFromLayout(layout.children, targetId),
        };
      }
      return layout;
    });
};

const addToLayout = (layouts, targetLayoutId, newItem) => {
  return layouts.map((layout) => {
    if (layout.id === targetLayoutId) {
      return { ...layout, children: [...layout.children, newItem] };
    }
    if (layout.children && layout.children.length > 0) {
      return {
        ...layout,
        children: addToLayout(layout.children, targetLayoutId, newItem),
      };
    }
    return layout;
  });
};

const updateNested = (obj, pathArr, val) => {
  const [head, ...rest] = pathArr;
  if (rest.length === 0) {
    return { ...obj, [head]: val };
  }
  return {
    ...obj,
    [head]: updateNested(obj[head] || {}, rest, val),
  };
};

const updateImmediateChildrenHeight = (children, newHeight) => {
  return children.map((child) => ({
    ...child,
    properties: {
      ...child.properties,
      height: newHeight,
    },
  }));
};

const updateComponentInLayouts = (layouts, componentId, path, value) => {
  return layouts.map((item) => {
    // Jika ID ditemukan pada level ini
    if (item.id === componentId) {
      const pathArray = path.split(".");
      const updatedItem = {
        ...item,
        properties: updateNested(item.properties || {}, pathArray, value),
      };

      // *** KUNCI PERBAIKAN: Update children height ketika parent height berubah ***
      if (
        path === "height" &&
        updatedItem.children &&
        updatedItem.children.length > 0
      ) {
        // Konversi value ke format yang konsisten
        const normalizedHeight =
          typeof value === "string" && value.includes("px")
            ? value
            : `${value}px`;

        updatedItem.children = updateImmediateChildrenHeight(
          updatedItem.children,
          normalizedHeight
        );

        console.log(
          `Updated parent ${componentId} height to ${normalizedHeight}, children updated:`,
          updatedItem.children.length
        );
      }

      return updatedItem;
    }

    // *** PERBAIKAN BARU: Auto-sync container height ketika child height berubah ***
    if (item.children && item.children.length > 0) {
      const updatedChildren = updateComponentInLayouts(
        item.children,
        componentId,
        path,
        value
      );

      // Cek apakah ada perubahan pada children
      const hasChanges = updatedChildren !== item.children;

      if (hasChanges) {
        const updatedItem = { ...item, children: updatedChildren };

        // Jika ini adalah Container dan ada child yang height-nya berubah, sync container height
        if (item.name === "Container" && path === "height") {
          const maxChildHeight = updatedChildren.reduce((max, child) => {
            if (child.properties?.height) {
              const heightValue = parseInt(
                child.properties.height.replace("px", "")
              );
              return Math.max(max, heightValue);
            }
            return max;
          }, 0);

          if (maxChildHeight > 0) {
            updatedItem.properties = {
              ...updatedItem.properties,
              height: `${maxChildHeight}px`, // Container height = max child height + padding
            };
            console.log(
              `Auto-synced container ${item.id} to ${maxChildHeight}px`
            );
          }
        }

        return updatedItem;
      }
    }

    return item;
  });
};

const layoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_PAGES:
      return {
        ...state,
        pages: action.payload,
      };

    case types.ADD_PAGE:
      return {
        ...state,
        pages: [...state.pages, action.payload],
      };

    case types.DELETE_PAGE:
      return {
        ...state,
        pages: state.pages.filter((page) => page.id !== action.payload),
      };

    case types.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };

    // Layout Structure
    case types.ADD_LAYOUT:
      return {
        ...state,
        pages: state.pages.map((page) => {
          if (page.id === action.payload.pageId) {
            return {
              ...page,
              layouts: [...page.layouts, action.payload.layout],
            };
          }
          return page;
        }),
      };

    case types.DELETE_LAYOUT:
      return {
        ...state,
        pages: state.pages.map((page) => {
          if (page.id === action.payload.pageId) {
            return {
              ...page,
              layouts: removeFromLayout(page.layouts, action.payload.layoutId),
            };
          }
          return page;
        }),
      };

    case types.ADD_GRID:
      return {
        ...state,
        pages: state.pages.map((page) => {
          if (page.id === action.payload.pageId) {
            return {
              ...page,
              layouts: addToLayout(
                page.layouts,
                action.payload.layoutId,
                action.payload.grid
              ),
            };
          }
          return page;
        }),
      };

    case types.DELETE_GRID:
      return {
        ...state,
        pages: state.pages.map((page) => {
          if (page.id === action.payload.pageId) {
            return {
              ...page,
              layouts: removeFromLayout(page.layouts, action.payload.gridId),
            };
          }
          return page;
        }),
      };

    case types.APPLY_LAYOUT_TEMPLATE:
      return {
        ...state,
        pages: state.pages.map((page) => {
          if (page.id === action.payload.pageId) {
            return {
              ...page,
              layouts: [...action.payload.layouts],
            };
          }
          return page;
        }),
      };

    case types.ADD_COMPONENT_TO_GRID:
      return {
        ...state,
        pages: state.pages.map((page) => {
          if (page.id === action.payload.pageId) {
            const addComponentToGrid = (layouts, gridId, component) => {
              return layouts.map((layout) => {
                if (layout.id === gridId) {
                  // Cek apakah grid sudah memiliki children
                  if (layout.children && layout.children.length > 0) {
                    // Jika sudah ada children, replace dengan komponen baru
                    return {
                      ...layout,
                      children: [component],
                    };
                  } else {
                    // Jika belum ada children, tambahkan komponen
                    return {
                      ...layout,
                      children: [component],
                    };
                  }
                }
                if (layout.children && layout.children.length > 0) {
                  return {
                    ...layout,
                    children: addComponentToGrid(
                      layout.children,
                      gridId,
                      component
                    ),
                  };
                }
                return layout;
              });
            };

            return {
              ...page,
              layouts: addComponentToGrid(
                page.layouts,
                action.payload.gridId,
                action.payload.component
              ),
            };
          }
          return page;
        }),
      };

    // Selection Management
    case types.SET_SELECTED_LAYOUT:
      return {
        ...state,
        selectedLayout: action.payload,
      };

    case types.SET_SELECTED_GRID:
      return {
        ...state,
        selectedGrid: action.payload,
      };

    case types.SET_SELECTED_LAYOUT_INDEX:
      return {
        ...state,
        selectedLayoutIndex: action.payload,
      };

    case types.SET_ATRIBUT:
      return {
        ...state,
        atribut: action.payload,
      };

    case types.CLEAR_SELECTIONS:
      return {
        ...state,
        selectedLayout: null,
        selectedGrid: null,
        selectedLayoutIndex: null,
        atribut: null,
      };

    // Form Data Management
    case types.SET_FORM_DATA:
      return {
        ...state,
        formData: action.payload,
      };

    case types.UPDATE_FORM_DATA:
      const { path, value } = action.payload;
      const pathArray = path.split(".");
      return {
        ...state,
        formData: updateNested(state.formData, pathArray, value),
      };

    case types.SET_NEW_SIZE:
      return {
        ...state,
        newSize: action.payload,
      };

    case types.SET_NEW_HEIGHT:
      return {
        ...state,
        newHeight: action.payload,
      };

    case types.SET_NEW_MENU_ITEM:
      return {
        ...state,
        newMenuItem: action.payload,
      };

    // UI State Management
    case types.SET_ACTIVE_ID:
      return {
        ...state,
        activeId: action.payload,
      };

    case types.SET_MENU_ANCHOR_EL:
      return {
        ...state,
        menuAnchorEl: action.payload,
      };

    case types.SET_SELECTED_PAGE_FOR_MENU:
      return {
        ...state,
        selectedPageForMenu: action.payload,
      };

    case types.SET_TEMP:
      return {
        ...state,
        temp: action.payload,
      };

    // Component Properties
    case types.UPDATE_COMPONENT_PROPERTY: {
      const { componentId, path, value } = action.payload;

      if (!componentId) {
        return state;
      }

      return {
        ...state,
        pages: state.pages.map((page) => {
          if (page.id === state.currentPage) {
            let layouts = page.layouts;

            if (path === "height") {
              const parentInfo = findComponentAndParent(layouts, componentId);
              if (parentInfo && parentInfo.parent) {
                const parentId = parentInfo.parent.id;
                const siblings = parentInfo.parent.children || [];

                const updatedSiblings = siblings.map((child) => ({
                  ...child,
                  properties: {
                    ...child.properties,
                    height: value,
                  },
                }));

                layouts = recursivelyUpdateOrder(
                  layouts,
                  parentId,
                  updatedSiblings
                );
              }
            }
            const finalLayouts = updateComponentInLayouts(
              layouts,
              componentId,
              path,
              value
            );

            return {
              ...page,
              layouts: finalLayouts,
            };
          }
          return page;
        }),
      };
    }

    case types.AUTO_SYNC_CONTAINER_HEIGHT:
      return {
        ...state,
        pages: state.pages.map((page) => {
          if (page.id === action.payload.pageId) {
            return {
              ...page,
              layouts: action.payload.layouts,
            };
          }
          return page;
        }),
      };

    case types.UPDATE_SIBLING_HEIGHTS:
      {
        // Gunakan kurung kurawal untuk scope
        const { targetGridId, heightValue } = action.payload;

        // Helper rekursif untuk menemukan parent dan mengupdate semua children-nya
        const updateSiblingHeightsRecursive = (layouts, targetId) => {
          // Cari parent dari grid yang tingginya diubah
          const parentInfo = findComponentAndParent(layouts, targetId);

          // Jika tidak ditemukan atau tidak punya parent (misal, item root), jangan lakukan apa-apa
          if (!parentInfo || !parentInfo.parent) {
            // Jika tidak ada parent, mungkin item tersebut adalah layout root. Kita tidak handle kasus ini.
            // Jika butuh, bisa ditambahkan logikanya di sini.
            return layouts;
          }

          // Kita dapatkan ID dari parent-nya
          const parentId = parentInfo.parent.id;

          // Fungsi rekursif untuk menelusuri dan mengganti children dari parent yang ditemukan
          const applyUpdate = (items) => {
            return items.map((item) => {
              // Jika kita menemukan parent-nya
              if (item.id === parentId) {
                // Buat array children yang baru dengan tinggi yang sudah diupdate
                const updatedChildren = item.children.map((child) => ({
                  ...child,
                  properties: {
                    ...child.properties,
                    height: `${heightValue}px`, // Update tinggi untuk SEMUA sibling
                  },
                }));
                // Kembalikan item parent dengan children yang baru
                return { ...item, children: updatedChildren };
              }

              // Jika item ini punya children, cari di dalamnya secara rekursif
              if (item.children && item.children.length > 0) {
                return { ...item, children: applyUpdate(item.children) };
              }

              // Jika tidak ada perubahan, kembalikan item apa adanya
              return item;
            });
          };

          // Mulai proses update dari root layouts
          return applyUpdate(layouts);
        };

        return {
          ...state,
          pages: state.pages.map((page) => {
            if (page.id === state.currentPage) {
              return {
                ...page,
                layouts: updateSiblingHeightsRecursive(
                  page.layouts,
                  targetGridId
                ),
              };
            }
            return page;
          }),
        };
      }
      return {
        ...state,
        pages: state.pages.map((page) => {
          if (page.id === action.payload.pageId) {
            const { targetGridId, heightValue } = action.payload;

            const updateHeights = (layouts) => {
              const found = findComponentAndParent(layouts, targetGridId);

              if (found && found.parent) {
                const parentLayout = found.parent;
                const updatedChildren = parentLayout.children.map((child) => {
                  if (child.name === "Layout" || child.name === "Container") {
                    return {
                      ...child,
                      properties: {
                        ...child.properties,
                        height: `${heightValue}px`,
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
                      children: updateHeights(layout.children),
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
                        height: `${heightValue}px`,
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
                      children: updateHeights(layout.children),
                    };
                  }
                  return layout;
                });
              }
              return layouts;
            };

            return {
              ...page,
              layouts: updateHeights(page.layouts),
            };
          }
          return page;
        }),
      };

    case types.SAVE_ORDER:
      return {
        ...state,
        pages: state.pages.map((page) => {
          if (page.id === action.payload.pageId) {
            const updateOrder = (layouts) => {
              return layouts.map((layout) => {
                if (layout.id === action.payload.layoutId) {
                  const childrenMap = new Map(
                    layout.children.map((c) => [c.id, c])
                  );
                  const newChildren =
                    action.payload.tempData.newSlotItemMap.asArray
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

            return {
              ...page,
              layouts: updateOrder(page.layouts),
            };
          }
          return page;
        }),
      };

    //case left menu
    case types.UPDATE_LAYER_ORDER:
      return {
        ...state,
        pages: state.pages.map((page) => {
          if (page.id === action.payload.pageId) {
            const { parentId, newOrder } = action.payload;

            // Jika parentId null, berarti kita reorder di level root/pertama.
            if (parentId === null) {
              return {
                ...page,
                layouts: newOrder, // Langsung ganti layouts di root page
              };
            }
            // Jika parentId ada, kita reorder children di level nested.
            else {
              return {
                ...page,
                // Gunakan helper rekursif untuk mencari parent dan update children-nya
                layouts: recursivelyUpdateOrder(
                  page.layouts,
                  parentId,
                  newOrder
                ),
              };
            }
          }
          return page;
        }),
      };

    // Loading & Error
    case types.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case types.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default layoutReducer;
