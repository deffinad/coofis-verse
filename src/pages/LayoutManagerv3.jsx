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
import { Draggable } from "../Draggable";

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
  const [isPreview, setIsPreview] = useState(true);

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

  const renderComponents = (components, layoutId, layoutidx) =>
    components.map((comp) => (
      <Grid
        item
        xs={comp.size}
        key={comp.id}
        data-swapy-slot={comp.type === "grid" ? `${comp.id}` : undefined}
      >
        {comp.type === "grid" ? (
          <Grid
            sx={
              isPreview
                ? {
                    border:
                      selectedGrid?.id === comp.id
                        ? "1px solid green"
                        : "1px dashed grey",
                    padding: 1,
                    borderRadius: "10px",
                  }
                : {
                    border:
                      selectedGrid?.id === comp.id
                        ? "1px solid green"
                        : "1px dashed grey",
                    padding: 1,
                    borderRadius: "10px",
                  }
            }
            minHeight={"50px"}
            data-swapy-item={`${comp.id}`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLayoutIndex(layoutidx);
              setSelectedLayout(layoutId);
              setSelectedGrid(comp);
              setNewSize(comp.size);
            }}
          >
            {renderComponents(comp.children)}
          </Grid>
        ) : (
          React.createElement(Components?.[comp.type], {
            key: comp.id,
          })
        )}
      </Grid>
    ));

  const [components, setComponents] = useState([]);

  const handleDragEnd = (e) => {
    console.log(e);

    e.over !== null
      ? setComponents((prevComponents) => {
          // Buat nyari index parent
          const parentIndex = prevComponents.findIndex(
            (comp) => comp.idDroppable === e.over.id
          );

          if (parentIndex !== -1) {
            // Buat nambahin children kalau parent exist
            return prevComponents.map((comp, index) =>
              index === parentIndex
                ? {
                    ...comp,
                    component: {
                      idComponent: e.active.id,
                      name: e.active.id,
                      props: [],
                    },
                  }
                : comp
            );
          } else {
            // Kalau parent doesn't exist, buat parent baru
            return [
              ...prevComponents,
              {
                idDroppable: e.over.id,
                name: e.over.id || "Unknown",
                props: [],
                component: {
                  idComponent: e.active.id,
                  name: e.active.id || "Unnamed Component",
                  props: [],
                },
              },
            ];
          }
        })
      : null;
  };


  return (
    <DndContext onDragEnd={handleDragEnd} sx={{ bgColor: "black" }}>
      <Box sx={{ display: "flex" }}>
        <Drawer variant="permanent" anchor="left" sx={{ width: 240, overflowX:'hidden' }}>
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
            <Draggable id="Navbar">
              <Components.Navbar></Components.Navbar>
            </Draggable>
          </Box>
        </Drawer>
      </Box>
    </DndContext>
  );
};

export default LayoutManagerv3;
