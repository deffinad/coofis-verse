/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// React Core Libraries
import React, { useState, useRef, useEffect } from "react";

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
  useEffect(() => {
    localStorage.setItem("savedPages", JSON.stringify(pages));
    localStorage.setItem("curentPages", JSON.stringify(currentPage));
  }, [pages, currentPage]);

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
    setFormData(atribut || {});
    setNewSize(selectedGrid?.properties?.size);
    setNewHeight(parseInt(selectedGrid?.properties?.height) || 0);
  }, [atribut, selectedGrid]);

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
    setPages(pages.map((p) => ({ ...p, layouts: updateRecursive(p.layouts) })));
  };

  const handleRealtimeSizeChange = (newSizeValue) => {
    if (!selectedGrid) return;
    setNewSize(newSizeValue);
    updateComponentSize(selectedGrid.id, newSizeValue, newHeight);
  };

  const handleRealtimeHeightChange = (newHeightValue) => {
    if (!selectedGrid) return;
    setNewHeight(newHeightValue);
    updateComponentSize(selectedGrid.id, newSize, newHeightValue);
  };

  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    if (!selectedGrid || !atribut) return;
    const updateAttrRecursive = (layouts) => {
      return layouts.map((layout) => {
        if (layout.id === selectedGrid.id) {
          return {
            ...layout,
            children: layout.children.map((child) =>
              child.id === atribut.id
                ? {
                    ...child,
                    properties: { ...child.properties, ...formData },
                  }
                : child
            ),
          };
        }
        if (layout.children?.length > 0) {
          return { ...layout, children: updateAttrRecursive(layout.children) };
        }
        return layout;
      });
    };
    setPages(
      pages.map((p) => ({ ...p, layouts: updateAttrRecursive(p.layouts) }))
    );
    alert("Properti disimpan!");
  };

  // Handler untuk Menu Item pada Navbar
  const handleAddMenuItem = () => {
    if (!newMenuItem.label || !newMenuItem.path) {
      alert("Label dan Path harus diisi.");
      return;
    }
    const updateItems = (items) => [...(items || []), newMenuItem];
    const updateNavRecursive = (layouts) => {
      return layouts.map((layout) => {
        if (layout.id === selectedGrid.id) {
          return {
            ...layout,
            children: layout.children.map((child) =>
              child.id === atribut.id
                ? {
                    ...child,
                    properties: {
                      ...child.properties,
                      menuItems: updateItems(child.properties.menuItems),
                    },
                  }
                : child
            ),
          };
        }
        if (layout.children?.length > 0) {
          return { ...layout, children: updateNavRecursive(layout.children) };
        }
        return layout;
      });
    };

    setPages(
      pages.map((p) => ({ ...p, layouts: updateNavRecursive(p.layouts) }))
    );
    setNewMenuItem({ label: "", path: "" });
  };

  const handleDeleteMenuItem = (indexToDelete) => {
    const updateItems = (items) => items.filter((_, i) => i !== indexToDelete);
    const updateNavRecursive = (layouts) => {
      return layouts.map((layout) => {
        if (layout.id === selectedGrid.id) {
          return {
            ...layout,
            children: layout.children.map((child) =>
              child.id === atribut.id
                ? {
                    ...child,
                    properties: {
                      ...child.properties,
                      menuItems: updateItems(child.properties.menuItems),
                    },
                  }
                : child
            ),
          };
        }
        if (layout.children?.length > 0) {
          return { ...layout, children: updateNavRecursive(layout.children) };
        }
        return layout;
      });
    };
    setPages(
      pages.map((p) => ({ ...p, layouts: updateNavRecursive(p.layouts) }))
    );
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
  // Fungsi ini dideklarasikan di sini agar tidak dibuat ulang pada setiap render
  const RenderLayerTree = ({ layers }) => {
    return layers.map((layer) => {
      const isExpandable = layer.children && layer.children.length > 0;
      return (
        <Accordion
          key={layer.id}
          disableGutters
          elevation={0}
          sx={{
            "&:before": { display: "none" },
            backgroundColor: "transparent",
            ml: 1,
          }}
        >
          <AccordionSummary
            expandIcon={
              isExpandable ? <ExpandMoreIcon /> : <Box sx={{ width: 24 }} />
            }
            sx={{ p: "6px 8px", minHeight: "48px" }}
          >
            <Typography
              variant="button"
              sx={{
                color: "#1E1E1E",
                textTransform: "none",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
              }}
            >
              <DragIndicatorIcon sx={{ mr: 1, cursor: "grab" }} />
              {layer.name}
            </Typography>
          </AccordionSummary>
          {isExpandable && (
            <AccordionDetails sx={{ padding: "8px", ml: 1 }}>
              <RenderLayerTree layers={layer.children} />
            </AccordionDetails>
          )}
        </Accordion>
      );
    });
  };

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
            // Props untuk Pages
            pages={pages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onAddPage={addPage}
            menuAnchorEl={menuAnchorEl}
            onMenuClose={handleMenuClose}
            selectedPageForMenu={selectedPageForMenu}
            onDeletePage={deletePage}
            onMenuOpen={handleMenuOpen}
            // Props untuk Components
            selectedGrid={selectedGrid}
            sectionComponents={sectionComponents}
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
            onInputChange={handleInputChange}
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
