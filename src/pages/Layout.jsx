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
  ListItem,
  ListItemText,
  IconButton,
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
  const addLayout = () => {
    const currentPageIndex = pages.findIndex((p) => p.id === currentPage);
    if (currentPageIndex === -1) return;

    const newLayout = {
      id: `layouts${currentPageIndex + 1}${
        pages[currentPageIndex].layouts.length + 1
      }`,
      name: "Layout",
      children: [],
    };

    setPages(
      pages.map((page, idx) =>
        idx === currentPageIndex
          ? { ...page, layouts: [...page.layouts, newLayout] }
          : page
      )
    );
  };

  // add Grid inside layout
  const addGrid = () => {
    if (!currentPage || !selectedLayout) return;

    const currentPageIndex = pages.findIndex((p) => p.id === currentPage);
    if (currentPageIndex === -1) return;

    const layoutIndex = pages[currentPageIndex].layouts.findIndex(
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
        pIdx === currentPageIndex
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
  const deletePage = () => {
    if (!currentPage) return;
    const updatedPages = pages.filter((page) => page.id !== currentPage);
    setPages(updatedPages);

    // Set halaman aktif ke halaman pertama setelah dihapus
    if (updatedPages.length > 0) {
      setCurrentPage(updatedPages[0].id);
    } else {
      setCurrentPage(null);
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
        ArsipCuti: {
          id: `arsipcuti-${Date.now()}`,
          type: "ArsipCuti",
        },
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

      console.log(newComponent);

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
    components.map((comp) => {
      return (
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
      );
    });

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

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Box sx={{ display: "flex" }}>
        <Drawer variant="permanent" anchor="left" sx={{ width: 240 }}>
          <Box sx={{ width: 240, p: 2 }}>
            <Typography variant="h5" gutterBottom>
              {user?.username}
            </Typography>
          </Box>
          <Box sx={{ width: 240, p: 2 }}>
            <Button variant="contained" fullWidth onClick={addPage}>
              Tambah Halaman
            </Button>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={addLayout}
            >
              Tambah Layout
            </Button>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={!selectedLayout}
              onClick={() => addGrid()}
            >
              Tambah Grid
            </Button>
          </Box>
          <Box sx={{ width: 240, p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Daftar Komponen
            </Typography>
            <DraggableComponent id="Ratings">
              <Button
                variant="outlined"
                color="info"
                fullWidth
                disabled={!(selectedGrid && selectedLayout && currentPage)}
              >
                Ratings
              </Button>
            </DraggableComponent>
            <DraggableComponent id="Navbar">
              <Button
                variant="outlined"
                fullWidth
                disabled={!(selectedGrid && selectedLayout && currentPage)}
                sx={{ mt: 1 }}
              >
                Navbar
              </Button>
            </DraggableComponent>
            <DraggableComponent id="ArsipCuti">
              <Button
                variant="outlined"
                fullWidth
                disabled={!(selectedGrid && selectedLayout && currentPage)}
                sx={{ mt: 1 }}
              >
                ArsipCuti
              </Button>
            </DraggableComponent>
            <DraggableComponent id="KuotaCutiSaatIni">
              <Button
                variant="outlined"
                fullWidth
                disabled={!(selectedGrid && selectedLayout && currentPage)}
                sx={{ mt: 1 }}
              >
                Kuota Cuti
              </Button>
            </DraggableComponent>
            <DraggableComponent id="ListDate">
              <Button
                variant="outlined"
                fullWidth
                disabled={!(selectedGrid && selectedLayout && currentPage)}
                sx={{ mt: 1 }}
              >
                List Date
              </Button>
            </DraggableComponent>
            <DraggableComponent id="MonitoringKuota">
              <Button
                variant="outlined"
                fullWidth
                disabled={!(selectedGrid && selectedLayout && currentPage)}
                sx={{ mt: 1 }}
              >
                Monitoring Kuota
              </Button>
            </DraggableComponent>
            <DraggableComponent id="StatusDokumenCutiDashboard">
              <Button
                variant="outlined"
                fullWidth
                disabled={!(selectedGrid && selectedLayout && currentPage)}
                sx={{ mt: 1 }}
              >
                Status Dokumen Cuti
              </Button>
            </DraggableComponent>
          </Box>
          <Box sx={{ width: 240, p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Daftar Halaman
            </Typography>
            {pages.map((page) => (
              <Button
                key={page.id}
                variant="outlined"
                fullWidth
                sx={{ mb: 1 }}
                onClick={() => {
                  Object.values(containerRefs.current).forEach((ref) => {
                    if (ref?.swapy?.destroy) {
                      ref.swapy.destroy();
                    }
                  });

                  containerRefs.current = {};

                  setSelectedLayout("");
                  setSelectedLayoutIndex("");
                  setSelectedGrid("");
                  setCurrentPage(page.id);
                }}
              >
                {page.name}
              </Button>
            ))}

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => {
                window.open("/hasil", "_blank"); 
              }}
            >
              Preview
            </Button>

            <Button
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
            </Button>
          </Box>
        </Drawer>

        <Box sx={{ flexGrow: 1, p: 5 }}>
          {currentPage && (
            <>
              <Typography variant="h4">
                {pages.find((page) => page.id === currentPage)?.name}
              </Typography>

              {/* show layout */}
              {pages
                .find((page, pageidx) => page.id === currentPage)
                ?.layouts.map((layout, layoutidx) => (
                  <Box
                    ref={(el) => (containerRefs.current[layout.id] = el)}
                    key={layout.id}
                    sx={{
                      border:
                        selectedLayout === layout.id ? "1px solid green" : "",
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
                      {renderComponents(layout.children, layout.id, layoutidx)}
                    </Grid>
                  </Box>
                ))}
            </>
          )}
        </Box>

        <Drawer variant="permanent" anchor="right" sx={{ width: 240 }}>
          <Box sx={{ width: 240, p: 2 }}>
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
                  {/* Editable Fields */}
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
                      {/* Form untuk menambah menu item */}
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

                      {/* List Menu Item */}
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
        </Drawer>
      </Box>
    </DndContext>
  );
};

export default Layout;
