/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// React Core Libraries
import React, { useState, useRef, useEffect, useCallback } from "react";

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
// [MODIFIED] Import arrayMove for reordering
import { arrayMove } from "@dnd-kit/sortable";

// Material-UI (MUI) Components
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
  Button,
} from "@mui/material";

// Material-UI (MUI) Icons
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Remote Micro-frontend Components
import { Components } from "remoteApp/Components";

// Local Application Components
import DroppableGrid from "@/shared/components/DroppableGrid";
import EditorNavbar from "./layout/EditorNavbar";
import LeftMenu from "./layout/LeftMenu";
import MainContent from "./layout/MainContent";
import RightMenu from "./layout/RightMenu";

// JSON Data Imports
import { DataCuti } from "../json/DocsCuti";
import { DataKuota } from "../json/DocsKuota";
import { DateData } from "../json/DateData";
import { KuotaCuti1 } from "../json/DocsKuotaCuti1";
import { KuotaCuti2 } from "../json/DocsKuotaCuti2";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

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

  // State untuk form dan properti di menu kanan
  const [formData, setFormData] = useState({});
  const [newSize, setNewSize] = useState();
  const [newHeight, setNewHeight] = useState();
  const [newMenuItem, setNewMenuItem] = useState({ label: "", path: "" });

  // State untuk fungsionalitas UI (DND, menu, etc.)
  const [activeId, setActiveId] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedPageForMenu, setSelectedPageForMenu] = useState(null);
  const [temp, setTemp] = useState(); // State untuk Swapy

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
  // Efek untuk memuat data dari localStorage saat komponen pertama kali dimuat
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

  // Efek untuk menyimpan data ke localStorage setiap kali ada perubahan
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

  // Efek untuk menginisialisasi atau menghancurkan Swapy.js saat halaman berubah
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

  // Efek untuk memperbarui form di menu kanan saat grid atau atributnya dipilih
  useEffect(() => {
    if (atribut) {
      setFormData(atribut.properties || {});
    } else {
      setFormData({});
    }
    if (selectedGrid?.properties) {
      setNewSize(selectedGrid.properties.size);
      setNewHeight(parseInt(selectedGrid.properties.height) || 0);
    }
  }, [atribut?.id, selectedGrid?.id]);

  useEffect(() => {
    setSelectedLayout(null);
    setSelectedGrid(null);
    setAtribute(null);
  }, [currentPage]);

  // --- 5. Helper Functions & Event Handlers ---

  // Fungsi utilitas
  const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 8);
  };

  // Handler untuk Pages
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

  // Handler untuk Layouts (Container)
  const addLayout = () => {
    if (!currentPage) {
      alert("Pilih halaman terlebih dahulu.");
      return;
    }
    const pageIndex = pages.findIndex((p) => p.id === currentPage);
    if (pageIndex === -1) return;

    const newLayout = {
      id: generateRandomId(),
      name: "Container",
      properties: { size: 12, height: "100%" },
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

  // Handler untuk Grids (Layout di dalam Container)
  const addGrid = () => {
    if (!selectedLayout) {
      alert("Pilih layout terlebih dahulu.");
      return;
    }
    const newGrid = {
      id: generateRandomId(),
      name: "Layout",
      properties: { size: 12, height: "140px" },
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

  // Handler Aksi Gabungan
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
      alert("Pilih sebuah layout atau grid untuk dihapus.");
    }
  };

  // Handler untuk Properti Komponen (di menu kanan)
  const updateComponentSize = (componentId, size, height) => {
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
                  size: parseInt(size) || 12,
                  height: `${height}px`,
                },
              };
            }
            if (layout.children?.length > 0) {
              return { ...layout, children: updateRecursive(layout.children) };
            }
            return layout;
          });
        };
        // Update layout/grid yang spesifik
        const newLayouts = updateRecursive(p.layouts);
        // Kemudian, sesuaikan tinggi di seluruh struktur
        return { ...p, layouts: adjustHeightsInRows(newLayouts) };
      });
      return updatedPages;
    });
  };

  // Fungsi untuk menyesuaikan tinggi layout/grid dalam baris yang sama
  const adjustHeightsInRows = (currentLayouts) => {
    if (!currentLayouts || currentLayouts.length === 0) {
      return currentLayouts;
    }

    let updatedLayouts = [...currentLayouts];
    let currentRow = [];
    let currentTotalSize = 0;

    for (let i = 0; i < updatedLayouts.length; i++) {
      const layout = updatedLayouts[i];
      const layoutSize = parseInt(layout.properties?.size || 12);

      // Jika layout ini adalah komponen, lewati (kita hanya peduli dengan layout/grid struktural)
      if (!layout.children) {
        // Rekursif untuk children dari komponen jika ada (meskipun tidak diharapkan di sini)
        if (layout.children && layout.children.length > 0) {
          layout.children = adjustHeightsInRows(layout.children);
        }
        continue;
      }

      // Cek apakah menambahkan layout ini akan melebihi 12 kolom
      if (currentTotalSize + layoutSize <= 12) {
        currentRow.push(layout);
        currentTotalSize += layoutSize;
      } else {
        // Baris penuh atau layout ini memulai baris baru
        if (currentRow.length > 1) {
          // Hanya proses jika ada lebih dari satu item di baris (sejajar)
          const minHeight = Math.min(
            ...currentRow.map((item) => parseInt(item.properties?.height || 0))
          );

          currentRow.forEach((item) => {
            item.properties = {
              ...item.properties,
              height: `${minHeight}px`,
            };
          });
        }

        // Mulai baris baru dengan layout saat ini
        currentRow = [layout];
        currentTotalSize = layoutSize;
      }

      // Rekursif untuk children dari layout saat ini
      if (layout.children && layout.children.length > 0) {
        layout.children = adjustHeightsInRows(layout.children);
      }
    }

    // Proses baris terakhir jika ada
    if (currentRow.length > 1) {
      const minHeight = Math.min(
        ...currentRow.map((item) => parseInt(item.properties?.height || 0))
      );
      currentRow.forEach((item) => {
        item.properties = {
          ...item.properties,
          height: `${minHeight}px`,
        };
      });
    }

    return updatedLayouts;
  };

  const debouncedUpdateComponentSize = useCallback(
    debounce((id, size, height) => {
      updateComponentSize(id, size, height);
    }, 300), // Debounce 300ms untuk mengurangi update yang terlalu sering
    [updateComponentSize]
  );

  const handleRealtimeSizeChange = useCallback(
    (newSizeValue) => {
      if (!selectedGrid) return;
      setNewSize(newSizeValue); // Update UI langsung
      debouncedUpdateComponentSize(selectedGrid.id, newSizeValue, newHeight); // Update state dengan debounce
    },
    [selectedGrid, newHeight, debouncedUpdateComponentSize]
  );

  const handleRealtimeHeightChange = useCallback(
    (newHeightValue) => {
      if (!selectedGrid) return;
      setNewHeight(newHeightValue); // Update UI langsung
      debouncedUpdateComponentSize(selectedGrid.id, newSize, newHeightValue); // Update state dengan debounce
    },
    [selectedGrid, newSize, debouncedUpdateComponentSize]
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

      // 1. Update formData untuk sinkronisasi dengan form
      setFormData((prev) => updateNested(prev, pathArray, value));

      // 2. Update pages state (sumber kebenaran)
      setPages((prevPages) => {
        return prevPages.map((page) => {
          if (page.id !== currentPage) return page;

          const updatedLayouts = page.layouts.map((layout) => {
            // Cari layout yang berisi selectedGrid
            const findAndUpdateGrid = (currentLayouts) => {
              return currentLayouts.map((l) => {
                if (l.id === selectedGrid?.id) {
                  // Ini adalah grid yang dipilih
                  return {
                    ...l,
                    children: l.children.map((child) => {
                      if (child.id === atribut?.id) {
                        // Ini adalah komponen di dalam grid
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
                // Jika layout memiliki children, cari di dalamnya
                if (l.children && l.children.length > 0) {
                  return { ...l, children: findAndUpdateGrid(l.children) };
                }
                return l;
              });
            };
            return findAndUpdateGrid([layout])[0]; // Panggil helper untuk mencari dan mengupdate
          });
          // Setelah update properti, sesuaikan tinggi di seluruh struktur
          return { ...page, layouts: adjustHeightsInRows(updatedLayouts) };
        });
      });
    },
    [currentPage, selectedGrid?.id, atribut?.id]
  );

  const handleSubmit = () => {
    if (!selectedGrid || !atribut) return;
    alert("Properti disimpan!"); // Notifikasi saja
  };

  // Handler untuk Menu Item pada Navbar
  const handleAddMenuItem = () => {
    if (!newMenuItem.label || !newMenuItem.path) {
      alert("Label dan Path harus diisi.");
      return;
    }

    // Dapatkan menuItems saat ini dari atribut.properties
    const currentMenuItems = atribut.properties?.menuItems || [];
    const updatedMenuItems = [...currentMenuItems, newMenuItem];

    // Gunakan handlePropertyChange untuk update
    handlePropertyChange("menuItems", updatedMenuItems);

    // Reset form
    setNewMenuItem({ label: "", path: "" });
  };

  const handleDeleteMenuItem = (indexToDelete) => {
    // Dapatkan menuItems saat ini dari atribut.properties
    const currentMenuItems = atribut.properties?.menuItems || [];
    const updatedMenuItems = currentMenuItems.filter(
      (_, i) => i !== indexToDelete
    );

    // Gunakan handlePropertyChange untuk update
    handlePropertyChange("menuItems", updatedMenuItems);
  };

  // Handler untuk Klik UI
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

  const handleMenuOpen = (event, page) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedPageForMenu(page);
  };

  const handleMenuClose = () => setMenuAnchorEl(null);

  // Handler untuk Drag and Drop (DND) dan Swapy
  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragEnd = (event) => {
    setActiveId(null);
    const { over, active } = event;
    if (!over) return;

    const gridId = over.id;
    const componentType = active.id;

    let gridHasChild = false;
    const checkGrid = (layouts) => {
      for (const layout of layouts) {
        if (layout.id === gridId && layout.children.length > 0) {
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
      alert("Grid sudah memiliki komponen. Hanya satu komponen per grid.");
      return;
    }

    const componentAttributes = {
      Navbar: {
        id: `component${generateRandomId()}`,
        name: "Navbar",
        properties: { menuItems: [{ label: "Home", path: "/" }], height: 65 },
      },
      Ratings: {
        id: `component${generateRandomId()}`,
        name: "Ratings",
        properties: { score: 5 },
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
        if (layout.id === gridId) {
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

  // [NEW] Handler for reordering layers in LeftMenu
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

        // Fungsi rekursif untuk mencari dan mengubah urutan array children yang tepat
        const findAndReorder = (items) => {
          // Cek apakah item yang di-drag ada di level ini
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);

          if (oldIndex !== -1 && newIndex !== -1) {
            // Jika ditemukan, ubah urutan array ini dan kembalikan
            return arrayMove(items, oldIndex, newIndex);
          }

          // Jika tidak, cari di dalam children setiap item
          for (const item of items) {
            // Hanya cari di dalam item yang memiliki properti 'children'
            if (item.children && item.children.length > 0) {
              const reorderedChildren = findAndReorder(item.children);

              // Jika urutan di dalam children berhasil diubah, update parent-nya
              if (reorderedChildren !== item.children) {
                return items.map((i) =>
                  i.id === item.id ? { ...i, children: reorderedChildren } : i
                );
              }
            }
          }

          // Kembalikan array asli jika tidak ada perubahan
          return items;
        };

        const newLayouts = findAndReorder(layouts);

        // Update state pages secara immutable
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
      alert("Pilih layout dan ubah urutan terlebih dahulu.");
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
    alert("Urutan disimpan!");
    setTemp(null);
  };

  // Handler untuk Global Actions (Navbar Editor)
  const handleSave = () => {
    localStorage.setItem("savedPages", JSON.stringify(pages));
    alert("Project saved!");
  };
  const handlePreview = () => window.open("/hasil", "_blank");
  const handlePublish = () => alert("Project published!");

  // --- 6. Render Functions ---
  // The old RenderLayerTree is removed as its logic is now in LeftMenu.jsx

  const sectionComponents = [
    { title: "Page" },
    { title: "Layout" },
    { title: "Menu" },
    { title: "Form" },
    { title: "Widget" },
  ];

  console.log("Struktur JSON Pages:", JSON.stringify(pages, null, 2));

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#F5F5F5",
        }}
      >
        <EditorNavbar
          onSave={handleSave}
          onPreview={handlePreview}
          onPublish={handlePublish}
          projectName={
            pages.find((p) => p.id === currentPage)?.name || "Untitled Project"
          }
        />
        <Box sx={{ display: "flex", flexGrow: 1, p: 3, gap: 3 }}>
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
            sectionComponents={sectionComponents}
            onLayerReorder={handleLayerDragEnd}
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
          />
          {/* Right Menu */}
          <RightMenu
            selectedLayout={selectedLayout}
            selectedGrid={selectedGrid}
            atribut={atribut}
            formData={formData}
            newSize={newSize}
            newHeight={newHeight}
            newMenuItem={newMenuItem}
            onDelete={handleDelete}
            onUpdateComponentSize={updateComponentSize}
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
              backgroundColor: "white",
              color: "#1E1E1E",
              borderColor: "#1E1E1E",
              justifyContent: "flex-start",
              textTransform: "none",
              width: "280px",
              boxShadow: 3,
              cursor: "grabbing",
            }}
          >
            {activeId}
          </Button>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Layout;
