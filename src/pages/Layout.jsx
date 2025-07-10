/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Drawer,
  Typography,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
} from "@mui/material";
import { Components } from "remoteApp/Components";
import { createSwapy } from "swapy";
import { DndContext } from "@dnd-kit/core";
import DeleteIcon from "@mui/icons-material/Delete";
import { KuotaCuti1 } from "../json/DocsKuotaCuti1";
import { KuotaCuti2 } from "../json/DocsKuotaCuti2";
import { DateData } from "../json/DateData";
import { DataKuota } from "../json/DocsKuota";
import { DataCuti } from "../json/DocsCuti";
import DroppableGrid from "@/shared/components/DroppableGrid";
import DraggableComponent from "@/shared/components/DraggableComponent";
import EditorNavbar from "./components/EditorNavbar";
import MenuPages from "./components/MenuPages";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DividingLine from "./components/DividingLine";

const Layout = () => {
  const [user, setUser] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [selectedGrid, setSelectedGrid] = useState(null);
  const containerRefs = useRef({});
  const gridRef = useRef(null);
  const [atribut, setAtribute] = useState();
  const [formData, setFormData] = useState(atribut);
  const [newSize, setNewSize] = useState();
  const [newHeight, setNewHeight] = useState();
  const [currentPage, setCurrentPage] = useState(null);
  const [selectedLayoutIndex, setSelectedLayoutIndex] = useState();
  const [temp, setTemp] = useState();
  const [newMenuItem, setNewMenuItem] = useState({ label: "", path: "" });
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedPageForMenu, setSelectedPageForMenu] = useState(null);

  // get json from local storage
  useEffect(() => {
    const savedPages = localStorage.getItem("savedPages");
    const currentpages = localStorage.getItem("curentPages");
    if (savedPages) {
      setPages(JSON.parse(savedPages));
      setCurrentPage(JSON.parse(currentpages));
    }
  }, []);

  // save json to local storage
  useEffect(() => {
    localStorage.setItem("savedPages", JSON.stringify(pages));
    localStorage.setItem("curentPages", JSON.stringify(currentPage));
  }, [pages, currentPage]);

  // create swapy
  useEffect(() => {
    if (!currentPage) return;

    const activePage = pages.find((p) => p.id === currentPage);
    if (!activePage) return;

    activePage.layouts.forEach((layout) => {
      if (!containerRefs.current[layout.id]) return;

      if (containerRefs.current[layout.id].swapy?.destroy) {
        containerRefs.current[layout.id].swapy.destroy();
      }

      containerRefs.current[layout.id].swapy = createSwapy(
        containerRefs.current[layout.id]
      );

      containerRefs.current[layout.id].swapy.onSwap((event) => {
        console.log(`Swapped in ${layout.id}:`, event);
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
  }, [currentPage, pages]);

  // EditorNavbar function
  const handleSave = () => {
    console.log("Saving...");
    localStorage.setItem("savedPages", JSON.stringify(pages));
    alert("Project saved!");
  };

  // menu pages function
  const handleMenuOpen = (event, page) => {
    event.stopPropagation(); // Mencegah event lain terpanggil
    setMenuAnchorEl(event.currentTarget);
    setSelectedPageForMenu(page);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedPageForMenu(null);
  };

  const handlePreview = () => {
    window.open("/hasil", "_blank");
  };

  const handlePublish = () => {
    console.log("Publishing...");
    alert("Project published!");
  };

  // add page
  const addPage = () => {
    const newPage = {
      id: `pages${pages.length + 1}`,
      name: `Page ${pages.length + 1}`,
      layouts: [],
    };
    setPages([...pages, newPage]);
    setCurrentPage(newPage.id);
  };

  // add layout inside page
  const addLayout = (pageId) => {
    const pageIndex = pages.findIndex((p) => p.id === pageId);
    if (pageIndex === -1) return;

    const newLayout = {
      id: `layouts${pageIndex + 1}${pages[pageIndex].layouts.length + 1}`,
      name: "Layout",
      children: [],
    };

    setPages(
      pages.map((page, idx) =>
        idx === pageIndex
          ? { ...page, layouts: [...page.layouts, newLayout] }
          : page
      )
    );

    setCurrentPage(pageId);
  };

  // add Grid inside layout
  const addGrid = (pageId) => {
    if (!pageId || !selectedLayout) {
      alert("Silakan aktifkan halaman dan pilih layout terlebih dahulu.");
      return;
    }

    if (pageId !== currentPage) {
      alert("Anda hanya bisa menambah grid pada halaman yang sedang aktif.");
      return;
    }

    const pageIndex = pages.findIndex((p) => p.id === pageId);
    if (pageIndex === -1) return;

    const layoutIndex = pages[pageIndex].layouts.findIndex(
      (l) => l.id === selectedLayout
    );
    if (layoutIndex === -1) return;

    const newGrid = {
      id: `grid-${Date.now()}`,
      type: "grid",
      size: 12,
      height: 80,
      children: [],
    };

    setPages((prevPages) =>
      prevPages.map((page, pIdx) =>
        pIdx === pageIndex
          ? {
              ...page,
              layouts: page.layouts.map((layout, lIdx) =>
                lIdx === layoutIndex
                  ? { ...layout, children: [...layout.children, newGrid] }
                  : layout
              ),
            }
          : page
      )
    );
  };

  // delete page
  const deletePage = (pageIdToDelete) => {
    if (!pageIdToDelete) return;

    const updatedPages = pages.filter((page) => page.id !== pageIdToDelete);
    setPages(updatedPages);

    if (currentPage === pageIdToDelete) {
      if (updatedPages.length > 0) {
        setCurrentPage(updatedPages[0].id);
      } else {
        setCurrentPage(null);
      }
    }
  };

  // delete layout
  const deleteLayout = () => {
    if (!selectedLayout || !currentPage) return;

    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === currentPage
          ? {
              ...page,
              layouts: page.layouts.filter(
                (layout) => layout.id !== selectedLayout
              ),
            }
          : page
      )
    );
    setSelectedLayout(null);
  };

  // delete grid
  const handleDeleteGrid = () => {
    if (!selectedGrid || !currentPage || !selectedLayout) return;

    const removeComponent = (components) => {
      const updatedComponents = components
        .filter((comp) => comp.id !== selectedGrid?.id)
        .map((comp) =>
          comp.type === "grid"
            ? { ...comp, children: removeComponent(comp.children) }
            : comp
        );
      return updatedComponents;
    };

    setPages((prevPages) => {
      const newPages = prevPages.map((page) =>
        page.id === currentPage
          ? {
              ...page,
              layouts: page.layouts.map((layout) =>
                layout.id === selectedLayout
                  ? { ...layout, children: removeComponent(layout.children) }
                  : layout
              ),
            }
          : page
      );
      return newPages;
    });

    setSelectedGrid(null);
  };

  const updateComponentSize = (componentId, newSize, newHeight) => {
    setPages((prevPages) =>
      prevPages.map((page) => ({
        ...page,
        layouts: page.layouts.map((layout) => ({
          ...layout,
          children: updateSizeRecursively(
            layout.children,
            componentId,
            newSize,
            newHeight
          ),
        })),
      }))
    );
  };

  const updateSizeRecursively = (components, gridId, newSize, newHeight) => {
    return components.map((comp) => {
      const updatedComp =
        comp.id === gridId ? { ...comp, size: newSize } : comp;

      if (updatedComp.type === "grid") {
        return {
          ...updatedComp,
          children: updatedComp.children.map((child) =>
            child.id === atribut?.id ? { ...child, height: newHeight } : child
          ),
        };
      }

      return updatedComp;
    });
  };

  const saveOrder = (layoutIndex) => {
    const updatedPages = pages.map((page) => {
      if (!page.layouts[layoutIndex]) return page;

      return {
        ...page,
        layouts: page.layouts.map((layout, index) => {
          if (index !== layoutIndex) return { ...layout };

          const childrenCopy = JSON.parse(JSON.stringify(layout.children));

          const childrenMap = Object.fromEntries(
            childrenCopy.map((component) => [
              component.id,
              { children: component.children, size: component.size },
            ])
          );

          const updatedChildren = childrenCopy.map((component) => {
            const slotItem = temp?.newSlotItemMap?.asArray.find(
              (slot) => slot.slot === component.id
            );

            if (!slotItem) return component;

            return {
              ...component,
              id: slotItem.item,
              children: childrenMap[slotItem.item]?.children || [],
            };
          });

          return { ...layout, children: updatedChildren };
        }),
      };
    });

    localStorage.removeItem("savedPages");
    localStorage.setItem("savedPages", JSON.stringify(updatedPages));
    window.location.reload();
  };

  const handleDragEnd = (event) => {
    const { over, active } = event;
    if (over) {
      const gridId = over.id;
      const componentType = active?.id || "Unknown";

      const componentAttributes = {
        Navbar: {
          id: `navbar-${Date.now()}`,
          type: "Navbar",
          menuItems: [
            { label: "Home", path: "/" },
            { label: "About", path: "/about" },
            { label: "Contact", path: "/contact" },
          ],
          height: 65,
        },
        Ratings: { id: `ratings-${Date.now()}`, type: "Ratings", score: 5 },
        Input: {
          id: `input-${Date.now()}`,
          type: "Input",
          name: "userInput",
          label: "Your Name",
          value: "",
          placeholder: "Enter your name",
          tipe: "text",
        },
        ArsipCuti: { id: `arsipcuti-${Date.now()}`, type: "ArsipCuti" },
        KuotaCutiSaatIni: {
          id: `kuotacutisaatini-${Date.now()}`,
          config1: KuotaCuti1,
          config2: KuotaCuti2,
          type: "KuotaCutiSaatIni",
        },
        ListDate: {
          id: `listdate-${Date.now()}`,
          config: DateData,
          type: "ListDate",
        },
        MonitoringKuota: {
          id: `monitoringkuota-${Date.now()}`,
          config: DataKuota,
          type: "MonitoringKuota",
        },
        StatusDokumenCutiDashboard: {
          id: `statusdokumencutidashboard-${Date.now()}`,
          config: DataCuti,
          type: "StatusDokumenCutiDashboard",
        },
      };

      const newComponent = componentAttributes[componentType] || {
        id: `unknown-${Date.now()}`,
        type: "Unknown",
      };

      setPages((prevPages) =>
        prevPages.map((page) => ({
          ...page,
          layouts: page.layouts.map((layout) => ({
            ...layout,
            children: layout.children.map((grid) =>
              grid.id === gridId
                ? {
                    ...grid,
                    children: [
                      ...(Array.isArray(grid.children) ? grid.children : []),
                      newComponent,
                    ],
                  }
                : grid
            ),
          })),
        }))
      );
    }
  };

  const renderComponents = (components, layoutId, layoutidx) =>
    components.map((comp) => (
      <Grid
        ref={gridRef}
        item
        xs={comp.size}
        key={comp.id}
        data-swapy-slot={comp.type === "grid" ? `${comp.id}` : undefined}
      >
        <DroppableGrid
          key={comp.id}
          id={comp.id}
          onClick={() => {
            setSelectedLayoutIndex(layoutidx);
            setSelectedLayout(layoutId);
            setSelectedGrid(comp);
            setNewSize(comp.size);
            setAtribute(comp.children[0]);
          }}
          selectedGrid={selectedGrid}
        >
          {comp.children && comp.children.length > 0 ? (
            comp.children.map((child) =>
              React.createElement(Components?.[child.type], {
                key: child.id,
                ...child,
              })
            )
          ) : (
            <p style={{ color: "gray" }}>Empty Grid</p>
          )}
        </DroppableGrid>
      </Grid>
    ));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      id: atribut?.id,
      label: formData?.label,
      name: formData?.name,
      placeholder: formData?.placeholder,
      tipe: formData?.tipe,
      value: formData?.value,
    };

    setPages((prevPages) => {
      return prevPages.map((page) => {
        return {
          ...page,
          layouts: page.layouts.map((layout) => {
            return {
              ...layout,
              children: layout.children.map((grid) => {
                if (grid.id === selectedGrid?.id) {
                  return {
                    ...grid,
                    children: grid.children.map((child) => {
                      if (child.id === payload?.id) {
                        return {
                          ...child,
                          label: payload?.label,
                          name: payload?.name,
                          placeholder: payload?.placeholder,
                          tipe: payload?.tipe,
                          value: payload?.value,
                        };
                      }
                      return child;
                    }),
                  };
                }
                return grid;
              }),
            };
          }),
        };
      });
    });
  };

  const handleAddMenuItem = () => {
    if (newMenuItem.label && newMenuItem.path && newHeight !== undefined) {
      setNewMenuItem({ label: "", path: "" });

      setPages((prevPages) =>
        prevPages.map((page) => ({
          ...page,
          layouts: page.layouts.map((layout) => ({
            ...layout,
            children: layout.children.map((grid) => {
              if (grid.id === selectedGrid?.id) {
                return {
                  ...grid,
                  children: grid.children.map((child) => {
                    if (child.id === atribut?.id) {
                      return {
                        ...child,
                        menuItems: [...(child.menuItems || []), newMenuItem],
                        height: newHeight,
                      };
                    }
                    return child;
                  }),
                };
              }
              return grid;
            }),
          })),
        }))
      );
    } else {
      console.error("Label, Path, atau Height tidak valid.");
    }
  };

  const handleDeleteMenuItem = (indexToDelete) => {
    setPages((prevPages) =>
      prevPages.map((page) => ({
        ...page,
        layouts: page.layouts.map((layout) => ({
          ...layout,
          children: layout.children.map((grid) =>
            grid.id === selectedGrid?.id
              ? {
                  ...grid,
                  children: grid.children.map((child) =>
                    child.id === atribut?.id
                      ? {
                          ...child,
                          menuItems: child.menuItems.filter(
                            (_, index) => index !== indexToDelete
                          ),
                        }
                      : child
                  ),
                }
              : grid
          ),
        })),
      }))
    );
  };

  const sectionLayers = [
    {
      title: "Header",
      content: (
        <Typography variant="body2" sx={{ color: "#1E1E1E" }}>
          (Belum ada layer)
        </Typography>
      ),
    },
    {
      title: "Section 1",
      content: (
        <Typography variant="body2" sx={{ color: "#1E1E1E" }}>
          (Belum ada layer)
        </Typography>
      ),
    },
    {
      title: "Section 2",
      content: (
        <Typography variant="body2" sx={{ color: "#1E1E1E" }}>
          (Belum ada layer)
        </Typography>
      ),
    },
    {
      title: "Section 3",
      content: (
        <Typography variant="body2" sx={{ color: "#1E1E1E" }}>
          (Belum ada layer)
        </Typography>
      ),
    },
    {
      title: "Footer",
      content: (
        <Typography variant="body2" sx={{ color: "#1E1E1E" }}>
          (Belum ada layer)
        </Typography>
      ),
    },
  ];

  const sectionComponents = [
    {
      title: "Page",
      content: (
        <Typography variant="body2" sx={{ color: "#1E1E1E" }}>
          (Belum ada komponen)
        </Typography>
      ),
    },
    {
      title: "Layout",
      content: (
        <Typography variant="body2" sx={{ color: "#1E1E1E" }}>
          (Belum ada komponen)
        </Typography>
      ),
    },
    {
      title: "Menu",
      content: (
        <Typography variant="body2" sx={{ color: "#1E1E1E" }}>
          (Belum ada komponen)
        </Typography>
      ),
    },
    {
      title: "Form",
      content: (
        <Typography variant="body2" sx={{ color: "#1E1E1E" }}>
          (Belum ada komponen)
        </Typography>
      ),
    },
    {
      title: "Widget",
      content: (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            width: "100%",
          }}
        >
          {[
            "Ratings",
            "Navbar",
            "ArsipCuti",
            "KuotaCutiSaatIni",
            "ListDate",
            "MonitoringKuota",
            "StatusDokumenCutiDashboard",
          ].map((id) => (
            <DraggableComponent key={id} id={id}>
              <Button
                variant="outlined"
                fullWidth
                disabled={!(selectedGrid && selectedLayout && currentPage)}
                sx={{
                  color: "#1E1E1E",
                  borderColor: "#1E1E1E",
                  justifyContent: "flex-start",
                  textTransform: "none",
                }}
              >
                {id}
              </Button>
            </DraggableComponent>
          ))}
        </Box>
      ),
    },
  ];

  return (
    <DndContext onDragEnd={handleDragEnd}>
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
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          {/* Left Menu */}
          <Box
            sx={{
              flexShrink: 0,
              maxWidth: "300px",
              border: "1px solid #D9D9D9",
              backgroundColor: "#FFFFFF",
              borderRadius: 2,
              m: 3,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <MenuPages
              anchorEl={menuAnchorEl}
              onClose={handleMenuClose}
              selectedPage={selectedPageForMenu}
              onDeletePage={deletePage}
            />

            {/* Bagian Atas: Pages & Actions */}
            <Box sx={{ p: 1 }}>
              {/* Header "Pages" */}
              <Box
                sx={{
                  backgroundColor: "#2C2C2C",
                  color: "#FFFFFF",
                  borderRadius: 2,
                  p: 1.5,
                  m: 0,
                  mb: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h6">Pages</Typography>
                  <Typography variant="body2" sx={{ color: "#ccc" }}>
                    Description
                  </Typography>
                </Box>

                <IconButton
                  size="small"
                  sx={{ color: "white" }}
                  onClick={addPage}
                >
                  <AddIcon />
                </IconButton>
              </Box>

              {/* Daftar Tombol Pages */}
              <List sx={{ width: "100%", p: 0 }}>
                {pages.map((page) => (
                  <ListItemButton
                    key={page.id}
                    onClick={() => {
                      // Fungsi pindah halaman Anda
                      setCurrentPage(page.id);
                    }}
                    sx={{
                      mb: 1,
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="button"
                          sx={{
                            color: "#1E1E1E",
                            textTransform: "none",
                            fontWeight: 500,
                          }}
                        >
                          {page.name}
                        </Typography>
                      }
                    />

                    {/* 2. IconButton untuk menu kebab */}
                    <IconButton
                      edge="end" // Prop ini membantu positioning di kanan
                      size="small"
                      onClick={(e) => handleMenuOpen(e, page)}
                      sx={{ color: "#1E1E1E" }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </ListItemButton>
                ))}
              </List>
            </Box>

            {/* Garis Pemisah */}
            <DividingLine />

            {/* Bagian Tengah: Layers */}
            <Box sx={{ p: 1 }}>
              {/* Header "Layers" */}
              <Box
                sx={{
                  backgroundColor: "#2C2C2C",
                  color: "#FFFFFF",
                  borderRadius: 2,
                  p: 1.5,
                  m: 0,
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">Layers</Typography>
              </Box>

              <Box
                sx={{
                  flex: 0,
                  display: "flex",
                  justifyContent: "center",
                  minWidth: 240,
                }}
              ></Box>

              {/* Daftar Accordion Layers */}
              {sectionLayers.map((sectionLayers, index) => (
                <Accordion
                  key={index}
                  disableGutters
                  elevation={0}
                  sx={{
                    "&:before": { display: "none" },
                    backgroundColor: "transparent",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                    sx={{
                      padding: "6px 8px",
                      minHeight: "48px",
                      "& .MuiAccordionSummary-content": {
                        margin: 0,
                      },
                    }}
                  >
                    <Typography
                      variant="button"
                      sx={{
                        color: "#1E1E1E",
                        textTransform: "none",
                        fontWeight: 500,
                        // 1. Jadikan Typography sebagai flex container
                        display: "flex",
                        alignItems: "center", // 2. Sejajarkan item di dalamnya secara vertikal
                      }}
                    >
                      <DragIndicatorIcon
                        sx={{
                          mr: 1, // 3. Beri jarak antara ikon dan teks
                          cursor: "grab", // 4. (Opsional) Ubah kursor untuk menandakan bisa di-drag
                        }}
                      />
                      {sectionLayers.title}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails sx={{ padding: "8px", ml: 1 }}>
                    {sectionLayers.content}
                  </AccordionDetails>
                </Accordion>
              ))}

              {/* Garis Pemisah */}
              <DividingLine />
            </Box>

            {/* Bagian Bawah: Components & Logout */}
            <Box sx={{ p: 1 }}>
              {/* Header "Components" */}
              <Box
                sx={{
                  backgroundColor: "#2C2C2C",
                  color: "#FFFFFF",
                  borderRadius: 2,
                  p: 1.5,
                  m: 0,
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">Components</Typography>
                <IconButton size="small" sx={{ color: "white" }}>
                  <AddIcon />
                </IconButton>
              </Box>

              <Box
                sx={{
                  flex: 0,
                  display: "flex",
                  justifyContent: "center",
                  minWidth: 240,
                }}
              >
                <TextField
                  variant="outlined"
                  placeholder="Search Component"
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchRoundedIcon sx={{ color: "#666" }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 5,
                      width: 260,
                      height: 35,
                      mb: 2,
                    },
                  }}
                />
              </Box>

              {/* Daftar Accordion Components */}
              {sectionComponents.map((sectionComponents, index) => (
                <Accordion
                  key={index}
                  disableGutters
                  elevation={0}
                  sx={{
                    "&:before": { display: "none" },
                    backgroundColor: "transparent",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<KeyboardArrowRightIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                    sx={{
                      padding: "6px 8px",
                      minHeight: "48px",
                      "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                        transform: "rotate(90deg)",
                      },

                      "& .MuiAccordionSummary-content": {
                        margin: 0,
                      },
                    }}
                  >
                    <Typography
                      variant="button"
                      sx={{
                        color: "#1E1E1E",
                        textTransform: "none",
                        fontWeight: 500,
                      }}
                    >
                      {sectionComponents.title}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails sx={{ padding: "8px", ml: 1 }}>
                    {sectionComponents.content}
                  </AccordionDetails>
                </Accordion>
              ))}

              {/* Tombol Logout & Garis Pemisah Terakhir */}
              {/* <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("username");
                  window.location.href = "/login";
                }}
              >
                Logout
              </Button> */}
              {/* Garis Pemisah */}
              <DividingLine />
            </Box>
          </Box>

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              backgroundColor: "#FFFFFF",
              m: 3,
              borderRadius: 2,
              border: "1px solid #D9D9D9",
              minHeight: "calc(100vh - 120px)", // Minimum height dengan pengurangan untuk margin dan navbar
              maxHeight: "calc(100vh - 120px)", // Maksimum height untuk membuat scrollable
              overflow: "auto", // Membuat scrollable jika konten melebihi maxHeight
              position: "sticky",
              top: 24, // Sesuaikan dengan margin yang diinginkan dari top
              alignSelf: "flex-start", // Memastikan box tidak mengikuti flex container height
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "1440px",
                mx: "auto",
                minHeight: "100%", // Memastikan konten mengisi minimum height
              }}
            >
              {currentPage && (
                <>
                  <Typography
                    variant="h4"
                    sx={{
                      color: "#F3F3F3",
                      backgroundColor: "#2C2C2C",
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      p: 2,
                      margin: "-24px -24px 16px -24px", // Negative margin untuk mengompensasi padding parent
                    }}
                  >
                    {pages.find((page) => page.id === currentPage)?.name}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 2, my: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => addLayout(currentPage)}
                    >
                      Tambah Layout
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => addGrid(currentPage)}
                      disabled={!selectedLayout}
                    >
                      Tambah Grid
                    </Button>
                  </Box>
                  {pages
                    .find((page) => page.id === currentPage)
                    ?.layouts.map((layout, layoutidx) => (
                      <Box
                        ref={(el) => (containerRefs.current[layout.id] = el)}
                        key={layout.id}
                        sx={{
                          border:
                            selectedLayout === layout.id
                              ? "1px solid green"
                              : "",
                          borderRadius: "10px",
                          padding: 1,
                          marginBottom: 2,
                          minHeight: "100px",
                          boxShadow:
                            selectedLayout === layout.id
                              ? "0px 4px 10px rgba(0, 128, 0, 0.5)"
                              : "0px 2px 5px rgba(0, 0, 0, 0.2)",
                        }}
                        onClick={() => {
                          setSelectedLayout(layout.id);
                          setSelectedLayoutIndex(layoutidx);
                          setSelectedGrid(null);
                          setAtribute(null);
                        }}
                      >
                        <Grid container spacing={2}>
                          {renderComponents(
                            layout.children,
                            layout.id,
                            layoutidx
                          )}
                        </Grid>
                      </Box>
                    ))}
                </>
              )}
            </Box>
          </Box>

          {/* Right Drawer */}
          <Drawer
            variant="permanent"
            anchor="right"
            sx={{
              width: 240,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: 240,
                boxSizing: "border-box",
                position: "relative",
                height: "auto",
                border: "1px solid #D9D9D9",
                backgroundColor: "#FFFFFF",
                borderRadius: 2,
                m: 3,
              },
            }}
          >
            {/* Wrapper Box untuk scrolling di dalam Drawer */}
            <Box sx={{ width: 240, overflow: "auto", height: "100%" }}>
              <Box sx={{ p: 1 }}>
                <Button
                  variant="contained"
                  color="error"
                  disabled={!currentPage}
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={deletePage}
                >
                  Hapus Halaman
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={!selectedLayout}
                  onClick={deleteLayout}
                >
                  Hapus Layout
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  disabled={!(selectedLayout && selectedGrid)}
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleDeleteGrid}
                >
                  Hapus Grid
                </Button>
                {selectedGrid && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateComponentSize(
                        selectedGrid.id,
                        parseInt(newSize),
                        parseInt(newHeight)
                      );
                    }}
                  >
                    <TextField
                      label="Ubah Col"
                      type="number"
                      fullWidth
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      sx={{ mt: 2, mb: 2 }}
                    />
                    <TextField
                      label="Ubah Height"
                      type="number"
                      fullWidth
                      value={newHeight}
                      onChange={(e) => setNewHeight(e.target.value)}
                      sx={{ mt: 2, mb: 2 }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Save
                    </Button>
                  </form>
                )}
                {atribut && (
                  <>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1">
                        <strong>ID:</strong> {atribut?.id}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Type:</strong> {atribut?.type}
                      </Typography>
                      {atribut.type === "Input" ? (
                        <>
                          <TextField
                            label="Name"
                            name="name"
                            value={formData?.name || ""}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mt: 2 }}
                          />
                          <TextField
                            label="Label"
                            name="label"
                            value={formData?.label || ""}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mt: 2 }}
                          />
                          <TextField
                            label="Placeholder"
                            name="placeholder"
                            value={formData?.placeholder || ""}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mt: 2 }}
                          />
                          <TextField
                            label="Tipe"
                            name="tipe"
                            value={formData?.tipe || ""}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mt: 2 }}
                          />
                          <TextField
                            label="Value"
                            name="value"
                            value={formData?.value || ""}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mt: 2 }}
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{ mt: 2 }}
                          >
                            Simpan
                          </Button>
                        </>
                      ) : atribut.type === "Navbar" ? (
                        <>
                          <Box>
                            <TextField
                              label="Label"
                              variant="outlined"
                              value={newMenuItem.label}
                              onChange={(e) =>
                                setNewMenuItem((prev) => ({
                                  ...prev,
                                  label: e.target.value,
                                }))
                              }
                              sx={{ mt: 2 }}
                            />
                            <TextField
                              label="Path"
                              variant="outlined"
                              value={newMenuItem.path}
                              onChange={(e) =>
                                setNewMenuItem((prev) => ({
                                  ...prev,
                                  path: e.target.value,
                                }))
                              }
                              sx={{ mt: 2 }}
                            />
                            <Button
                              variant="contained"
                              onClick={handleAddMenuItem}
                              sx={{ mt: 2 }}
                            >
                              Add Menu Item
                            </Button>
                          </Box>
                          <Box>
                            {atribut.menuItems?.map((item, index) => (
                              <ListItem
                                key={index}
                                secondaryAction={
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => handleDeleteMenuItem(index)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                }
                              >
                                <ListItemText
                                  primary={item.label}
                                  secondary={item.path}
                                />
                              </ListItem>
                            ))}
                          </Box>
                        </>
                      ) : (
                        <></>
                      )}
                    </Box>
                  </>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => saveOrder(selectedLayoutIndex)}
                  sx={{ mt: 2 }}
                >
                  Save Order
                </Button>
              </Box>
            </Box>
          </Drawer>
        </Box>
      </Box>
    </DndContext>
  );
};

export default Layout;
