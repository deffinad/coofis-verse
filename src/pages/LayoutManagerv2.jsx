import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Drawer,
  Typography,
  Grid,
  TextField,
} from "@mui/material";
import { Components } from "remoteApp/Components";
import { createSwapy } from "swapy";

const LayoutManagerv2 = () => {
  const [pages, setPages] = useState([]);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [selectedGrid, setSelectedGrid] = useState(null);
  const containerRefs = useRef({});
  const [newSize, setNewSize] = useState(selectedGrid?.size || 12);
  const [currentPage, setCurrentPage] = useState(null);
  const [selectedLayoutIndex, setSelectedLayoutIndex] = useState();
  const [temp, setTemp] = useState();
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
    pages.forEach((page) => {
      page.layouts.forEach((layout) => {
        if (!containerRefs.current[layout.id]) return;
        if (containerRefs.current[layout.id].swapy?.destroy) {
          containerRefs.current[layout.id].swapy.destroy();
        }

        // Inisialisasi Swapy
        containerRefs.current[layout.id].swapy = createSwapy(
          containerRefs.current[layout.id]
        );

        containerRefs.current[layout.id].swapy.onSwap((event) => {
          console.log(`Swapped in ${layout.id}:`, event);
          setTemp(event);
        });
      });
    });

    return () => {
      pages.forEach((page) => {
        page.layouts.forEach((layout) => {
          if (containerRefs.current[layout.id]?.swapy?.destroy) {
            containerRefs.current[layout.id].swapy.destroy();
          }
        });
      });
    };
  }, [pages]);

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

  // add component to grid
  const addComponentToGrid = (type) => {
    if (!selectedLayout || !selectedGrid) return;

    const newComponent = {
      id: `comp${Date.now()}`,
      type,
      size: 12,
    };

    switch (type) {
      case "Ratings":
        newComponent.value = 0;
        break;
      case "Navbar":
        break;
      case "Text":
        break;
      default:
        break;
    }

    const gridselect = pages
      .find((page) => page.id === currentPage)
      ?.layouts.find((layout) => layout.id === selectedLayout)
      ?.children.find((grid) => grid.id === selectedGrid.id);

    if (gridselect?.children.length === 1) {
      alert("Grid sudah terisi");
      return;
    }

    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === currentPage
          ? {
              ...page,
              layouts: page.layouts.map((layout) =>
                layout.id === selectedLayout
                  ? {
                      ...layout,
                      children: layout.children.map((grid) =>
                        grid.id === selectedGrid.id
                          ? {
                              ...grid,
                              children: [...grid.children, newComponent],
                            }
                          : grid
                      ),
                    }
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

    localStorage.setItem("pages", JSON.stringify(updatedPages));
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

    const removeComponent = (components) =>
      components
        .filter((comp) => comp.id !== selectedGrid.id)
        .map((comp) =>
          comp.type === "grid"
            ? { ...comp, children: removeComponent(comp.children) }
            : comp
        );

    setPages((prevPages) =>
      prevPages.map((page) =>
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
      )
    );

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

      const childrenMap = Object.fromEntries(
        page.layouts[layoutIndex].children.map((component) => [
          component.id,
          { children: component.children, size: component.size },
        ])
      );

      const updatedChildren = temp?.newSlotItemMap?.asArray.map((slotItem) => {
        const matchedComponent = page.layouts[layoutIndex].children.find(
          (component) => component.id === slotItem.slot
        );

        return {
          ...matchedComponent,
          id: slotItem.item,
          children: childrenMap[slotItem.item]?.children || [],
          size: childrenMap[slotItem.item]?.size || 12,
        };
      });

      return {
        ...page,
        layouts: page.layouts.map((layout, index) =>
          index === layoutIndex
            ? { ...layout, children: updatedChildren }
            : layout
        ),
      };
    });

    // Simpan seluruh pages ke localStorage
    localStorage.setItem("savedPages", JSON.stringify(updatedPages));

    alert(`Order saved for layout ${layoutIndex}!`);
  };

  const renderComponents = (components) =>
    components.map((comp) => (
      <Grid
        item
        xs={comp.size}
        key={comp.id}
        data-swapy-slot={comp.type === "grid" ? `${comp.id}` : undefined}
      >
        {comp.type === "grid" ? (
          <Grid
            sx={{
              border:
                selectedGrid?.id === comp.id
                  ? "1px solid green"
                  : "1px dashed grey",
              padding: 1,
              borderRadius: '10px'
            }}
            minHeight={"50px"}
            data-swapy-item={`${comp.id}`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedGrid(comp);
              setNewSize(comp.size);
            }}
          >
            {renderComponents(comp.children)}
          </Grid>
        ) : (
          React.createElement(Components[comp.type], { key: comp.id, ...comp })
        )}
      </Grid>
    ));

  return (
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
          <Button
            variant="outlined"
            color="info"
            disabled={!(selectedGrid && selectedLayout && currentPage)}
            onClick={() => addComponentToGrid("Ratings")}
            sx={{ width: "100%" }}
          >
            Ratings
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            disabled={!(selectedGrid && selectedLayout && currentPage)}
            onClick={() => addComponentToGrid("Navbar")}
          >
            Navbar
          </Button>
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
                setSelectedLayout("")
                setSelectedLayoutIndex("")
                setSelectedGrid("")
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
                  }}
                >
                  <Grid container spacing={2}>
                    {renderComponents(layout.children)}
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

          <Typography sx={{ mt: 4 }}>Layout: {selectedLayout}</Typography>
          <Typography>Component: {selectedGrid?.id}</Typography>
          <Typography>Col: {selectedGrid?.size}</Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => saveOrder(selectedLayoutIndex)}
            sx={{ mt: 2 }}
          >
            Save Order
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
                fullWidth
                sx={{ mt: 2 }}
              >
                Simpan
              </Button>
            </form>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default LayoutManagerv2;
