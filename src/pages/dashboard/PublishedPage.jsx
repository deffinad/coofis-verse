import React, { useEffect, useState, useCallback, useRef, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, Typography, Stack, CircularProgress, Alert } from "@mui/material";
import { BORDER_RADIUS, COLOR, SPACING } from "@/shared/constants/AppConst";
import { Components } from "remoteApp/Components";
import { fetchPublishedPage } from "../../redux/actions/publishedPageActions";

const PublishedPage = () => {
  const { pageId } = useParams();
  const dispatch = useDispatch();
  const { loading, data: pageData, error } = useSelector((state) => state.publishedPage);
  const [device, setDevice] = useState("desktop"); // Default device type
  const previewAreaRef = useRef(null);

  const getDeviceType = useCallback(() => {
    const width = window.innerWidth;
    if (width >= 992) {
      return "desktop";
    } else if (width >= 768) {
      return "tablet";
    } else {
      return "mobile";
    }
  }, []);

  useEffect(() => {
    // Set initial device type
    setDevice(getDeviceType());

    // Event listener for window resize
    const handleResize = () => {
      setDevice(getDeviceType());
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [getDeviceType]);


  useEffect(() => {
    // Memanggil action untuk mengambil data halaman
    dispatch(fetchPublishedPage(pageId));
  }, [dispatch, pageId]);

  // Fungsi untuk mendapatkan ukuran responsive berdasarkan device
  const getResponsiveSize = useCallback((grid) => {
    const sizeProp = grid.properties?.size;
    if (typeof sizeProp === "object" && sizeProp !== null) {
      return sizeProp[device] || sizeProp.desktop || 12;
    }
    return sizeProp || 12;
  }, [device]);

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
              height: grid.properties.height || "auto",
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
              <Grid container spacing={SPACING} sx={{ p: 0 }}>
                {renderComponents(grid.children)}
              </Grid>
            )}
          </Box>
        </Grid>
      );
    });
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  // Page not found state
  if (error || !pageData) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Alert severity="error">{error || "Page not found"}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: COLOR.very_light_gray,
        minHeight: "100vh",
        p: SPACING,
      }}
    >
      <Box
        ref={previewAreaRef}
        sx={{
          width: "100%",
          maxWidth: "100%",
          margin: "0 auto",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          backgroundColor: COLOR.white,
          border: "1px solid #ddd",
          borderRadius: BORDER_RADIUS,
          boxSizing: "border-box",
          p: SPACING,
        }}
      >
        {pageData && pageData.layouts.length > 0 ? (
          // Render semua layout dalam page
          <Stack spacing={SPACING}>
            {pageData.layouts.map((layout) => (
              <Box
                key={layout.id}
                sx={{ minHeight: layout.properties?.height || "auto" }}
              >
                <Grid container spacing={SPACING} sx={{ p: 0 }}>
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
              borderRadius: BORDER_RADIUS,
            }}
          >
            <Typography variant="h5" color="text.secondary">
              No content available on this page.
            </Typography>
          </Box>
        )}
        </Box>
      </Box>
    );
  };
  
  export default PublishedPage;
