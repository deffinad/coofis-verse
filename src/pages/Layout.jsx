/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// React Core Libraries
import React, { useState, useRef, useEffect } from "react";

// Third-Party Libraries
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { createSwapy } from "swapy";

// Material-UI (MUI) Components
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
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

const Layout = () => {
  // --- STATE MANAGEMENT (Logika Stabil) ---
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [selectedLayoutIndex, setSelectedLayoutIndex] = useState();
  const [selectedGrid, setSelectedGrid] = useState(null);
  const [atribut, setAtribute] = useState(null);
  const [formData, setFormData] = useState({});
  const [newSize, setNewSize] = useState();
  const [newHeight, setNewHeight] = useState();
  const [temp, setTemp] = useState();
  const [newMenuItem, setNewMenuItem] = useState({ label: "", path: "" });

  // State khusus untuk UI
  const [activeId, setActiveId] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedPageForMenu, setSelectedPageForMenu] = useState(null);

  const containerRefs = useRef({});

  // --- EFEK & LIFECYCLE (Logika Stabil) ---
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

  useEffect(() => {
    localStorage.setItem("savedPages", JSON.stringify(pages));
    localStorage.setItem("curentPages", JSON.stringify(currentPage));
  }, [pages, currentPage]);

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
    setFormData(atribut || {});
    setNewSize(selectedGrid?.size);
    setNewHeight(selectedGrid?.height);
  }, [atribut, selectedGrid]);

  // --- FUNGSI GENERATOR ID ---
  const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 8);
  };

  const addPage = () => {
    const newPage = {
      id: `pages${pages.length + 1}`,
      name: `Page ${pages.length + 1}`,
      layouts: [],
    };
    setPages([...pages, newPage]);
    setCurrentPage(newPage.id);
  };

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
      properties: {
        size: 12,
        height: "100%",
      },
      children: [],
    };
    const updatedPages = [...pages];
    updatedPages[pageIndex].layouts.push(newLayout);
    setPages(updatedPages);
  };

  const addGrid = () => {
    if (!selectedLayout) {
      alert("Pilih layout terlebih dahulu.");
      return;
    }
    const newGrid = {
      id: generateRandomId(),
      name: "Layout",
      properties: {
        size: 12,
        height: "300px",
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

  const addLayoutOrGrid = () => {
    if (selectedLayout) {
      addGrid();
    } else {
      addLayout();
    }
  };

  const updateComponentSize = (componentId, size, height) => {
    const updateRecursive = (layouts) => {
      return layouts.map((layout) => {
        if (layout.id === componentId) {
          return {
            ...layout,
            properties: {
              ...layout.properties,
              size: size,
              height: height,
            },
          };
        }
        if (layout.children && layout.children.length > 0) {
          return { ...layout, children: updateRecursive(layout.children) };
        }
        return layout;
      });
    };

    setPages(
      pages.map((p) => ({
        ...p,
        layouts: updateRecursive(p.layouts),
      }))
    );
  };

  // --- Fungsi Render Components ---
  const renderComponents = (layouts, layoutId, layoutidx) => {
    return layouts.map((layout) => (
      <Grid
        item
        xs={parseInt(layout.properties?.size) || 12}
        key={layout.id}
        data-swapy-slot={layout.id}
      >
        <DroppableGrid
          id={layout.id}
          onClick={() => {
            setSelectedLayout(layoutId);
            setSelectedLayoutIndex(layoutidx);
            setSelectedGrid(layout);
            setAtribute(layout.children?.[0] || null);
          }}
          selectedGrid={selectedGrid}
          style={{ minHeight: layout.properties?.height || "auto" }}
        >
          {layout.children?.length > 0 ? (
            layout.children.map((child) => {
              // Jika child adalah component (memiliki name dan properties)
              if (child.name && child.properties) {
                return React.createElement(Components?.[child.name], {
                  key: child.id,
                  ...child.properties, // Spread properties sebagai props
                });
              }
              // Jika child adalah layout (struktur layout)
              else if (child.properties && !child.name) {
                return (
                  <Grid
                    item
                    xs={parseInt(child.properties.size) || 12}
                    key={child.id}
                    data-swapy-slot={child.id}
                  >
                    <DroppableGrid
                      id={child.id}
                      onClick={() => {
                        setSelectedLayout(layoutId);
                        setSelectedLayoutIndex(layoutidx);
                        setSelectedGrid(child);
                        setAtribute(child.children?.[0] || null);
                      }}
                      selectedGrid={selectedGrid}
                      style={{ minHeight: child.properties.height || "auto" }}
                    >
                      {child.children?.length > 0 ? (
                        renderComponents(child.children, layoutId, layoutidx)
                      ) : (
                        <p style={{ color: "gray" }}>Empty Layout</p>
                      )}
                    </DroppableGrid>
                  </Grid>
                );
              }
              return null;
            })
          ) : (
            <p style={{ color: "gray" }}>Empty Layout</p>
          )}
        </DroppableGrid>
      </Grid>
    ));
  };

  const deletePage = (pageIdToDelete) => {
    const updatedPages = pages.filter((page) => page.id !== pageIdToDelete);
    setPages(updatedPages);
    if (currentPage === pageIdToDelete) {
      setCurrentPage(updatedPages.length > 0 ? updatedPages[0].id : null);
    }
    handleMenuClose();
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

  const handleGridClick = (layout, layoutId, layoutidx) => {
    setSelectedLayout(layoutId);
    setSelectedLayoutIndex(layoutidx);
    setSelectedGrid(layout);
    setAtribute(layout.children?.[0] || null);
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

  const saveOrder = (layoutIndex) => {
    if (layoutIndex === undefined || !temp) {
      alert("Pilih layout dan ubah urutan terlebih dahulu.");
      return;
    }

    const updateOrder = (layouts) => {
      return layouts.map((layout, index) => {
        if (layout.id === selectedLayout) {
          const childrenMap = new Map(layout.children.map((c) => [c.id, c]));
          const newChildren = temp.newSlotItemMap.asArray
            .map((item) => childrenMap.get(item.item))
            .filter(Boolean);
          return { ...layout, children: newChildren };
        }
        if (layout.children && layout.children.length > 0) {
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

  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragEnd = (event) => {
    setActiveId(null);
    const { over, active } = event;
    if (!over) return;

    const gridId = over.id;
    const componentType = active.id;

    // Check if grid already has a component
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
        properties: {
          menuItems: [{ label: "Home", path: "/" }],
          height: 65,
        },
      },
      Ratings: {
        id: `component${generateRandomId()}`,
        name: "Ratings",
        properties: {
          score: 5,
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
        properties: {
          config1: KuotaCuti1,
          config2: KuotaCuti2,
        },
      },
      ListDate: {
        id: `component${generateRandomId()}`,
        name: "ListDate",
        properties: {
          config: DateData,
        },
      },
      MonitoringKuota: {
        id: `component${generateRandomId()}`,
        name: "MonitoringKuota",
        properties: {
          config: DataKuota,
        },
      },
      StatusDokumenCutiDashboard: {
        id: `component${generateRandomId()}`,
        name: "StatusDokumenCutiDashboard",
        properties: {
          config: DataCuti,
        },
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
        if (layout.children && layout.children.length > 0) {
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
        if (layout.children && layout.children.length > 0) {
          return { ...layout, children: updateAttrRecursive(layout.children) };
        }
        return layout;
      });
    };

    setPages(
      pages.map((p) => ({
        ...p,
        layouts: updateAttrRecursive(p.layouts),
      }))
    );
    alert("Properti disimpan!");
  };

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
        if (layout.children && layout.children.length > 0) {
          return { ...layout, children: updateNavRecursive(layout.children) };
        }
        return layout;
      });
    };

    setPages(
      pages.map((p) => ({
        ...p,
        layouts: updateNavRecursive(p.layouts),
      }))
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
        if (layout.children && layout.children.length > 0) {
          return { ...layout, children: updateNavRecursive(layout.children) };
        }
        return layout;
      });
    };

    setPages(
      pages.map((p) => ({
        ...p,
        layouts: updateNavRecursive(p.layouts),
      }))
    );
  };

  // --- FUNGSI BANTUAN UI ---
  const handleSave = () => {
    localStorage.setItem("savedPages", JSON.stringify(pages));
    alert("Project saved!");
  };
  const handlePreview = () => window.open("/hasil", "_blank");
  const handlePublish = () => alert("Project published!");
  const handleMenuOpen = (event, page) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedPageForMenu(page);
  };
  const handleMenuClose = () => setMenuAnchorEl(null);

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

  const RenderLayerTree = ({ layers }) => {
    return layers.map((layer) => {
      const isExpandable = layer.children && layer.children.length > 0;
      const isComponent = layer.name && !layer.properties;

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
              {/* Recursive call for children */}
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
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
            onDeleteLayout={deleteLayout}
            onDeleteGrid={handleDeleteGrid}
            onUpdateComponentSize={updateComponentSize}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onSizeChange={setNewSize}
            onHeightChange={setNewHeight}
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
          <Box
            sx={{
              backgroundColor: "white",
              padding: "8px 16px",
              borderRadius: "4px",
              boxShadow: 3,
              opacity: 0.9,
            }}
          >
            <Typography>{activeId}</Typography>
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Layout;
