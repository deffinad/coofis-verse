import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Drawer,
  Typography,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import { Components } from "remoteApp/Components";
import { createSwapy } from "swapy";

import { DndContext } from "@dnd-kit/core";
import DroppableGrid from "../DroppableGrid";
import DraggableComponent from "../DraggableComponent";

const LOCAL_STORAGE_KEY = "inputProps";

const LayoutManagerv3 = () => {
  const [pages, setPages] = useState([]);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [selectedGrid, setSelectedGrid] = useState(null);
  const containerRefs = useRef({});
  const [newSize, setNewSize] = useState(selectedGrid?.size || 12);
  const [currentPage, setCurrentPage] = useState(null);
  const [selectedLayoutIndex, setSelectedLayoutIndex] = useState();
  const [temp, setTemp] = useState();

  const [value, setValue] = useState("");
  const [inputProps, setInputProps] = useState(null);
  const [editedProps, setEditedProps] = useState(null);

  // Load data dari Local Storage saat komponen pertama kali dirender
  useEffect(() => {
    const storedProps = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedProps) {
      const parsedProps = JSON.parse(storedProps);
      setInputProps(parsedProps);
      setEditedProps(parsedProps);
      setValue(parsedProps.value || "");
    }
  }, []);

  // Fungsi untuk menangkap props saat input diklik
  const handleInspect = (props) => {
    setInputProps(props);
    setEditedProps(props);
  };

  // Fungsi untuk mengubah nilai di form properties
  const handleChangeProps = (key, newValue) => {
    setEditedProps((prevProps) => ({
      ...prevProps,
      [key]: newValue,
    }));
  };

  // Fungsi untuk menyimpan perubahan props ke state dan local storage
  const handleSaveProps = () => {
    setInputProps(editedProps);
    setValue(editedProps.value);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(editedProps)); // Simpan ke Local Storage
  };

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
      id: `grid${currentPageIndex + 1}${layoutIndex + 1}${
        pages[currentPageIndex].layouts[layoutIndex].children.length + 1
      }`,
      type: "grid",
      size: 12,
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

  const updateComponentSize = (componentId, newSize) => {
    setPages((prevPages) =>
      prevPages.map((page) => ({
        ...page,
        layouts: page.layouts.map((layout) => ({
          ...layout,
          children: updateSizeRecursively(
            layout.children,
            componentId,
            newSize
          ),
        })),
      }))
    );
  };

  const updateSizeRecursively = (components, componentId, newSize) => {
    return components.map((comp) =>
      comp.id === componentId
        ? { ...comp, size: newSize }
        : comp.type === "grid"
        ? {
            ...comp,
            children: updateSizeRecursively(
              comp.children,
              componentId,
              newSize
            ),
          }
        : comp
    );
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
    // console.log("Event Drop:", event);

    if (over) {
      const gridId = over.id;

      const componentType = active?.id || "Unknown";

      const componentAttributes = {
        Navbar: {
          id: `navbar-${Date.now()}`,
          type: "Navbar",
          menuItems: ["Home", "About", "Contact"],
        },
        Ratings: { id: `ratings-${Date.now()}`, type: "Ratings", score: 5 },
        ArsipCuti: {
          id: `arsipcuti-${Date.now()}`,
          type: "ArsipCuti",
          history: [],
        },
        Input: {
          id: `input-${Date.now()}`,
          type: "Input",
          placeholder: "Enter text",
        },
        ArsipCuti: {
          id: `arsipcuti-${Date.now()}`,
          type: "ArsipCuti",
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
    components.map((comp) => {
      return (
        <Grid
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
            }}
            selectedGrid={selectedGrid}
            size={comp.size}
          >
            {comp.children && comp.children.length > 0 ? (
              comp.children.map((child) =>
                React.createElement(Components?.[child.type], {
                  key: child.id,
                })
              )
            ) : (
              <p style={{ color: "gray" }}>Empty Grid</p>
            )}
          </DroppableGrid>
        </Grid>
      );
    });

  console.log(pages);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Box sx={{ display: "flex" }}>
        <Drawer variant="permanent" anchor="left" sx={{ width: 240 }}>
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
                disabled={!(selectedGrid && selectedLayout && currentPage)}
                sx={{ width: "100%" }}
              >
                Ratings
              </Button>
            </DraggableComponent>
            <DraggableComponent id="Input">
              <Button
                variant="outlined"
                color="info"
                disabled={!(selectedGrid && selectedLayout && currentPage)}
                sx={{ width: "100%", mt: 2, mb: 2 }}
              >
                Input
              </Button>
            </DraggableComponent>
            <DraggableComponent id="Navbar">
              <Button
                variant="outlined"
                fullWidth
                disabled={!(selectedGrid && selectedLayout && currentPage)}
              >
                Navbar
              </Button>
            </DraggableComponent>
            <DraggableComponent id="ArsipCuti">
              <Button
                variant="outlined"
                fullWidth
                disabled={!(selectedGrid && selectedLayout && currentPage)}
                sx={{ mt: 2 }}
              >
                ArsipCuti
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
                      setEditedProps(null);
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
                  updateComponentSize(selectedGrid.id, parseInt(newSize));
                }}
              >
                <TextField
                  label="Ubah Col"
                  type="number"
                  fullWidth
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  sx={{ mt: 2 }}
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
            {editedProps ? (
              <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <Typography sx={{ mt: 4 }}>Layout: {selectedLayout}</Typography>
                <Typography>Component: {selectedGrid?.id}</Typography>
                {Object.keys(editedProps).map((key) =>
                  key === "type" ? (
                    <TextField
                      select
                      key={key}
                      label={key}
                      value={editedProps[key]}
                      onChange={(e) => handleChangeProps(key, e.target.value)}
                      size="small"
                    >
                      <MenuItem value="text">text</MenuItem>
                      <MenuItem value="number">number</MenuItem>
                    </TextField>
                  ) : (
                    <TextField
                      key={key}
                      label={key}
                      value={editedProps[key]}
                      onChange={(e) => handleChangeProps(key, e.target.value)}
                      size="small"
                    />
                  )
                )}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSaveProps}
                >
                  Save
                </Button>
              </Box>
            ) : (
              <Typography variant="body2">
                {/* Klik input untuk melihat props */}
              </Typography>
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

export default LayoutManagerv3;
