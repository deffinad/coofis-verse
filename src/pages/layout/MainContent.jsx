import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";

// --- Local/Shared Imports ---
import DroppableGrid from "@/shared/components/DroppableGrid";
import { Components } from "remoteApp/Components";
import { BORDER_RADIUS, COLOR, SPACING } from "@/shared/constants/AppConst";
import { LayoutTemplates } from "../../json/LayoutTemplates";

import {
  setSelectedLayout,
  setSelectedLayoutIndex,
  setSelectedGrid,
  setAtribut,
  clearSelections,
  addLayout,
  addGrid,
  deleteLayout,
  deleteGrid,
} from "../../redux/actions/layoutActions";
import { showAlert } from "../../redux/actions/alertActions";

const MainContent = ({ containerRefs }) => {
  const dispatch = useDispatch();

  const { pages, currentPage, selectedLayout, selectedGrid, activeId } =
    useSelector((state) => state.layout);

  const { setNodeRef: setMainContentDroppableRef, isOver: isMainContentOver } =
    useDroppable({
      id: "main-content-canvas",
    });

  const isLayoutTemplateDragging =
    activeId && LayoutTemplates.some((template) => template.id === activeId);

  const handleLayoutClick = useCallback(
    (layoutId, layoutidx) => {
      if (selectedLayout === layoutId) {
        dispatch(clearSelections());
      } else {
        dispatch(setSelectedLayout(layoutId));
        dispatch(setSelectedLayoutIndex(layoutidx));
        dispatch(setSelectedGrid(null));
        dispatch(setAtribut(null));
      }
    },
    [dispatch, selectedLayout]
  );

  const handleGridClick = useCallback(
    (layout, layoutId, layoutidx) => {
      // Mencegah klik saat drag-and-drop template
      if (isLayoutTemplateDragging) return;

      dispatch(setSelectedLayout(layoutId));
      dispatch(setSelectedLayoutIndex(layoutidx));
      dispatch(setSelectedGrid(layout));
      dispatch(setAtribut(layout.children?.[0] || null));
    },
    [dispatch, isLayoutTemplateDragging]
  );

  const handleAddLayoutOrGrid = useCallback(() => {
    if (selectedLayout) {
      dispatch(addGrid());
    } else {
      dispatch(addLayout());
    }
  }, [dispatch, selectedLayout]);

  const handleDelete = useCallback(() => {
    if (selectedGrid) {
      dispatch(deleteGrid(selectedGrid.id));
    } else if (selectedLayout) {
      dispatch(deleteLayout(selectedLayout));
    } else {
      dispatch(showAlert("Please select a layout to delete.", "warning"));
    }
  }, [dispatch, selectedLayout, selectedGrid]);

  const calculateContainerHeight = (children) => {
    if (!children || children.length === 0) return "auto";

    // Cari tinggi maksimum dari children
    const maxHeight = children.reduce((max, child) => {
      if (child.properties?.height) {
        const heightValue = parseInt(child.properties.height.replace("px", ""));
        return Math.max(max, heightValue);
      }
      return max;
    }, 0);

    // Tambahkan padding untuk container (misal 20px)
    return maxHeight > 0 ? `${maxHeight + 20}px` : "auto";
  };

  const renderComponents = (layouts, layoutId, layoutidx) => {
    return layouts.map((layout) => {
      const containerHeight =
        layout.name === "Container"
          ? calculateContainerHeight(layout.children)
          : layout.properties?.height || "auto";

      return (
        <Grid
          item
          size={
            typeof layout.properties?.size === "object"
              ? layout.properties.size.desktop || 12
              : layout.properties?.size || 12
          }
          key={layout.id}
          data-swapy-slot={layout.id}
        >
          <DroppableGrid
            id={layout.id}
            onClick={(e) => {
              handleGridClick(layout, layoutId, layoutidx);
            }}
            selectedGrid={selectedGrid}
            disabled={isLayoutTemplateDragging}
            style={{
              height: containerHeight,
              minHeight: layout.name === "Container" ? containerHeight : "auto",
              display: layout.children?.length === 0 ? "flex" : "block",
              justifyContent:
                layout.children?.length === 0 ? "center" : "flex-start",
              alignItems:
                layout.children?.length === 0 ? "center" : "flex-start",
            }}
          >
            {layout.children?.length > 0 ? (
              layout.children.map((child) => {
                if (child.name && child.properties) {
                  return React.createElement(Components?.[child.name], {
                    key: child.id,
                    ...child.properties,
                  });
                } else if (child.properties && !child.name) {
                  // Ini adalah kasus nested grid, render rekursif
                  return renderComponents([child], layoutId, layoutidx);
                }
                return null;
              })
            ) : (
              <Typography variant="body2" sx={{ color: "gray", p: 2 }}>
                Empty Layout
              </Typography>
            )}
          </DroppableGrid>
        </Grid>
      );
    });
  };

  return (
    <Box
      sx={{
        minWidth: "1140px",
        maxWidth: "1140px",
      }}
    >
      {/* Header di atas kanvas */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: COLOR.dark_gray,
          color: COLOR.white_ice,
          p: "18px",
          borderRadius: BORDER_RADIUS,
          mb: SPACING,
          position: "sticky",
          top: "105px",
          zIndex: 1,
        }}
      >
        <Typography variant="h6">
          {pages.find((page) => page.id === currentPage)?.name ||
            "Select or create a new page"}
        </Typography>
        <Box sx={{ display: "flex", gap: SPACING }}>
          <Button
            variant="contained"
            onClick={handleAddLayoutOrGrid}
            sx={{
              backgroundColor: COLOR.light_gray,
              color: COLOR.dark_gray,
              borderRadius: BORDER_RADIUS,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            Add New Layout
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={!selectedLayout && !selectedGrid}
            onClick={handleDelete}
            sx={{
              backgroundColor: COLOR.red_rojo,
              color: COLOR.white_ice,
              borderRadius: BORDER_RADIUS,
              textTransform: "none",
              display: selectedLayout || selectedGrid ? "block" : "none",
              "&:hover": {
                backgroundColor: "#d32f2f",
              },
            }}
          >
            Delete Selected Layout
          </Button>
        </Box>
      </Box>

      {/* Kanvas Utama */}
      <Box
        component="main"
        ref={setMainContentDroppableRef}
        sx={{
          p: SPACING,
          backgroundColor: COLOR.white_winter,
          borderRadius: BORDER_RADIUS,
          border:
            isMainContentOver && isLayoutTemplateDragging
              ? `2px dashed ${COLOR.honolulu_blue}`
              : `1px solid ${COLOR.light_gray}`,
          minHeight: "100vh",
          height: "fit-content",
          transition: "border 0.2s ease",
        }}
      >
        <Grid container spacing={2}>
          {currentPage &&
            pages
              .find((page) => page.id === currentPage)
              ?.layouts.map((layout, layoutidx) => (
                <Grid item key={layout.id} xs={12} sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      border:
                        selectedLayout === layout.id && !selectedGrid
                          ? `2px solid ${COLOR.green_malachite}`
                          : "1px dashed black",
                      padding: SPACING,
                      cursor: "pointer",
                      borderRadius: BORDER_RADIUS,
                      height: "fit-content",
                      minHeight:
                        layout.children?.length === 0 ? "80vh" : "auto",
                      transition: "border 0.3s ease-in-out",
                    }}
                    onClick={() => handleLayoutClick(layout.id, layoutidx)}
                  >
                    <Grid
                      container
                      spacing={1}
                      ref={(el) => (containerRefs.current[layout.id] = el)}
                      sx={{ height: "fit-content" }}
                    >
                      {renderComponents(layout.children, layout.id, layoutidx)}
                    </Grid>
                  </Box>
                </Grid>
              ))}
          {!currentPage ||
            (pages.find((p) => p.id === currentPage)?.layouts.length === 0 && (
              <Box
                sx={{
                  p: 4,
                  textAlign: "center",
                  color: "grey.500",
                  width: "100%",
                }}
              >
                <Typography variant="h6">
                  Drag a layout template or component here to start building!
                </Typography>
              </Box>
            ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default MainContent;
