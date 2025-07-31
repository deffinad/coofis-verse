import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid, Typography, Stack } from "@mui/material";
import { COLOR, SPACING } from "@/shared/AppConst";
import { Components } from "remoteApp/Components";

const PublishedPage = () => {
  const { pageId } = useParams();
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mengambil data dari publishedPages di localStorage
    const publishedPages = JSON.parse(
      localStorage.getItem("publishedPages") || "[]"
    );
    const currentPageData = publishedPages.find((p) => p.id === pageId);
    setPageData(currentPageData);
    setIsLoading(false);
  }, [pageId]);

  // Fungsi untuk mendapatkan ukuran responsive berdasarkan device
  const getResponsiveSize = (grid, deviceType = "desktop") => {
    const sizeProp = grid.properties?.size;
    if (typeof sizeProp === "object" && sizeProp !== null) {
      return sizeProp[deviceType] || sizeProp.desktop || 12;
    }
    return sizeProp || 12;
  };

  // Fungsi rekursif untuk me-render komponen
  const renderComponents = (components) => {
    return components.map((grid) => {
      // Validasi struktur grid
      if (!grid.properties || !grid.children) return null;
      
      // Cek apakah ini adalah komponen akhir (bukan layout)
      const isFinalComponent = grid.children[0]?.name;
      
      return (
        <Grid item size={getResponsiveSize(grid)} key={grid.id}>
          <Box
            sx={{
              minHeight: grid.properties.height || "auto",
              height: "100%",
            }}
          >
            {isFinalComponent ? (
              // Render komponen final menggunakan Components registry
              React.createElement(Components[grid.children[0].name], {
                key: grid.children[0].id,
                ...grid.children[0].properties,
              })
            ) : (
              // Render layout dalam (nested grid)
              <Grid container spacing={SPACING}>
                {renderComponents(grid.children)}
              </Grid>
            )}
          </Box>
        </Grid>
      );
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  // Page not found state
  if (!pageData) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">Page not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: COLOR.very_light_gray, 
      minHeight: "100vh",
      p: SPACING 
    }}>
      {pageData && pageData.layouts.length > 0 ? (
        // Render semua layout dalam page
        <Stack spacing={SPACING}>
          {pageData.layouts.map((layout) => (
            <Box
              key={layout.id}
              sx={{ minHeight: layout.properties?.height || "auto" }}
            >
              <Grid container spacing={SPACING}>
                {renderComponents(layout.children)}
              </Grid>
            </Box>
          ))}
        </Stack>
      ) : (
        // Empty state
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            backgroundColor: COLOR.white,
            borderRadius: "8px",
          }}
        >
          <Typography variant="h5" color="text.secondary">
            No content available on this page.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PublishedPage;