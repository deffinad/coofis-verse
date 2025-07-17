import React from "react";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import DroppableGrid from "@/shared/components/DroppableGrid";
import { Components } from "remoteApp/Components";
import { SPACING } from "@/shared/AppConst";
import { useDroppable } from "@dnd-kit/core";

const MainContent = ({
  pages,
  currentPage,
  selectedLayout,
  selectedGrid,
  selectedLayoutIndex,
  containerRefs,
  onLayoutClick,
  onGridClick,
  onAddLayoutOrGrid,
  onSaveOrder,
  onDelete,
}) => {
  const { setNodeRef: setMainContentDroppableRef, isOver: isMainContentOver } =
    useDroppable({
      id: "main-content-canvas", // ID unik untuk kanvas utama
    });

  // Fungsi untuk render components
  const renderComponents = (layouts, layoutId, layoutidx) => {
    return layouts.map((layout) => (
      <Grid
        item
        // Ubah dari parseInt(layout.properties?.size) ke size langsung
        size={layout.properties?.size || 12}
        key={layout.id}
        data-swapy-slot={layout.id}
      >
        <DroppableGrid
          id={layout.id}
          onClick={() => onGridClick(layout, layoutId, layoutidx)}
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
                    // Ubah dari parseInt ke size langsung
                    size={child.properties.size || 12} // Default size 12
                    key={child.id}
                    data-swapy-slot={child.id}
                  >
                    <DroppableGrid
                      id={child.id}
                      onClick={() => onGridClick(child, layoutId, layoutidx)}
                      selectedGrid={selectedGrid}
                      style={{ minHeight: child.properties.height || "auto" }}
                    >
                      {child.children?.length > 0 ? (
                        renderComponents(child.children, layoutId, layoutidx)
                      ) : (
                        <p style={{ color: "gray" }}>
                          This layout is currently empty
                        </p>
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

  return (
    <Box
      sx={{
        minWidth: "1140px",
        maxWidth: "1140px",
        mx: "auto",
      }}
    >
      {/* Header di atas kanvas */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#2C2C2C",
          color: "#FFFFFF",
          p: "18px",
          borderRadius: SPACING,
          mb: SPACING,
        }}
      >
        <Typography variant="h6">
          {pages.find((page) => page.id === currentPage)?.name ||
            "Select or create a new page"}
        </Typography>
        <Box sx={{ display: "flex", gap: SPACING }}>
          <Button
            variant="contained"
            onClick={onAddLayoutOrGrid}
            sx={{
              backgroundColor: "#E3E3E3",
              color: "#2c2c2c",
              borderRadius: SPACING,
              textTransform: "none",
            }}
          >
            Add New Layout
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={!selectedLayout}
            onClick={onDelete}
            sx={{
              backgroundColor: "#dc143c",
              color: "#ffffff",
              borderRadius: SPACING,
              textTransform: "none",
              display: selectedLayout ? "block" : "none",
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
          p: 3,
          backgroundColor: "#FFFFFF",
          borderRadius: SPACING,
          border: isMainContentOver ? "2px dashed green" : "1px solid #D9D9D9", // ✅ Visual feedback saat hover
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
                          ? "1px solid blue"
                          : "1px dashed black",
                      padding: SPACING,
                      cursor: "pointer",
                      borderRadius: SPACING,
                      height: "fit-content",
                      minHeight:
                        layout.children?.length === 0 ? "80vh" : "auto",
                    }}
                    onClick={() => onLayoutClick(layout.id, layoutidx)}
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
