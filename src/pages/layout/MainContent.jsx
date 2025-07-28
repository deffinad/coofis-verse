import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import DroppableGrid from "@/shared/components/DroppableGrid";
import { Components } from "remoteApp/Components";
import { COLOR, SPACING } from "@/shared/AppConst";
import { useDroppable } from "@dnd-kit/core";
import { LayoutTemplates } from "../../json/LayoutTemplates";

const MainContent = ({
  pages,
  currentPage,
  selectedLayout,
  selectedGrid,
  containerRefs,
  onLayoutClick,
  onGridClick,
  onAddLayoutOrGrid,
  onDelete,
  activeId,
}) => {
  const { setNodeRef: setMainContentDroppableRef, isOver: isMainContentOver } =
    useDroppable({
      id: "main-content-canvas",
    });

  const isLayoutTemplateDragging =
    activeId && LayoutTemplates.some((template) => template.id === activeId);

  const renderComponents = (layouts, layoutId, layoutidx) => {
    return layouts.map((layout) => (
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
          onClick={() => onGridClick(layout, layoutId, layoutidx)}
          selectedGrid={selectedGrid}
          disabled={isLayoutTemplateDragging}
          style={{
            minHeight: layout.properties?.height || "auto",
            display: layout.children?.length === 0 ? "flex" : "block",
            justifyContent:
              layout.children?.length === 0 ? "center" : "flex-start",
            alignItems: layout.children?.length === 0 ? "center" : "flex-start",
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
                return (
                  <Grid
                    item
                    size={
                      typeof child.properties.size === "object"
                        ? child.properties.size.desktop || 12
                        : child.properties.size || 12
                    }
                    key={child.id}
                    data-swapy-slot={child.id}
                  >
                    <DroppableGrid
                      id={child.id}
                      onClick={() => onGridClick(child, layoutId, layoutidx)}
                      selectedGrid={selectedGrid}
                      style={{ minHeight: child.properties.height || "auto" }}
                      disabled={isLayoutTemplateDragging}
                    >
                      {child.children?.length > 0 ? (
                        renderComponents(child.children, layoutId, layoutidx)
                      ) : (
                        <Typography variant="body2" sx={{ color: "gray" }}>
                          Empty Layout
                        </Typography>
                      )}
                    </DroppableGrid>
                  </Grid>
                );
              }
              return null;
            })
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" sx={{ color: "gray" }}>
                Empty Layout
              </Typography>
            </Box>
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
          borderRadius: SPACING,
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
            onClick={onAddLayoutOrGrid}
            sx={{
              backgroundColor: COLOR.light_gray,
              color: COLOR.dark_gray,
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
              backgroundColor: COLOR.red_rojo,
              color: COLOR.white_ice,
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
          backgroundColor: COLOR.white_winter,
          borderRadius: SPACING,
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
