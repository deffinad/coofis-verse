import React from "react";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import DroppableGrid from "@/shared/components/DroppableGrid";
import { Components } from "remoteApp/Components";

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
}) => {
  // Fungsi untuk render components (dipindahkan dari Layout.jsx)
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
                    xs={parseInt(child.properties.size) || 12}
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

  return (
    <Box
      sx={{
        minWidth: "1140px",
        maxWidth: "1140px",
        mx: "auto",
        position:"sticky",
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
          borderRadius: 2,
          mb: 2,
        }}
      >
        <Typography variant="h6">
          {pages.find((page) => page.id === currentPage)?.name ||
            "Pilih atau buat halaman baru"}
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            onClick={onAddLayoutOrGrid}
            sx={{
              backgroundColor: "#E3E3E3",
              color: "#2c2c2c",
              borderRadius: 3,
              textTransform: "none",
            }}
          >
            {selectedLayout ? "Add Grid" : "Add Layout"}
          </Button>
          <IconButton
            color="inherit"
            onClick={() => onSaveOrder(selectedLayoutIndex)}
          >
            <SaveOutlinedIcon sx={{ width: "35px", height: "35px" }} />
          </IconButton>
        </Box>
      </Box>

      {/* Kanvas Utama */}
      <Box
        component="main"
        sx={{
          p: 3,
          backgroundColor: "#FFFFFF",
          borderRadius: 2,
          border: "1px solid #D9D9D9",
          height: "auto",
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
                      backgroundColor: "#E3E3E3",
                      border:
                        selectedLayout === layout.id
                          ? "1px solid green"
                          : "1px solid transparent",
                      padding: 1,
                      marginBottom: 2,
                      minHeight: "300px",
                      boxShadow:
                        selectedLayout === layout.id
                          ? "0px 4px 10px rgba(0, 128, 0, 0.5)"
                          : "0px 2px 5px rgba(0, 0, 0, 0.2)",
                      cursor: "pointer",
                    }}
                    onClick={() => onLayoutClick(layout.id, layoutidx)}
                  >
                    <Grid
                      container
                      spacing={1}
                      ref={(el) => (containerRefs.current[layout.id] = el)}
                    >
                      {renderComponents(layout.children, layout.id, layoutidx)}
                    </Grid>
                  </Box>
                </Grid>
              ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default MainContent;