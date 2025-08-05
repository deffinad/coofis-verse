// pages/preview/PreviewPage.jsx
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  ButtonGroup,
  Typography,
  Grid,
  CircularProgress,
  Chip,
  Stack,
} from "@mui/material";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import TabletMacIcon from "@mui/icons-material/TabletAndroid";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PublishIcon from "@mui/icons-material/Publish";
import { COLOR, SPACING } from "@/shared/constants/AppConst";
import { Components } from "remoteApp/Components";

const PreviewPage = () => {
  // Changed from Preview to PreviewPage
  const { pageId } = useParams(); // Get pageId from URL
  const navigate = useNavigate(); // For back navigation

  const [pages, setPages] = useState([]); // State to hold all pages
  const [activePage, setActivePage] = useState(null); // State for the current active page
  const [previewSize, setPreviewSize] = useState({ width: "100%" });
  const [scale, setScale] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceType, setDeviceType] = useState("Desktop");
  const previewAreaRef = useRef(null);

  useEffect(() => {
    // Load all pages from localStorage
    const savedPages = localStorage.getItem("savedPages");
    if (savedPages) {
      try {
        const parsedPages = JSON.parse(savedPages);
        setPages(parsedPages);
        // Find the active page based on pageId from URL
        const foundPage = parsedPages.find((p) => p.id === pageId);
        setActivePage(foundPage);
      } catch (e) {
        console.error("Failed to parse pages from localStorage", e);
        setActivePage(null);
      }
    } else {
      setActivePage(null);
    }

    // Simulate loading
    const loadPreviewData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsLoading(false);
    };
    loadPreviewData();
  }, [pageId]); // Re-run when pageId changes

  useLayoutEffect(() => {
    if (previewAreaRef.current?.parentElement && !isLoading) {
      const availableWidth = previewAreaRef.current.parentElement.offsetWidth;
      const targetWidth = previewSize.width;
      const calculatedScale = availableWidth / targetWidth;
      setScale(Math.min(calculatedScale, 1));
    }
  }, [previewSize.width, isLoading, activePage]);

  const handleResize = (width, type) => {
    setPreviewSize({ width });
    setDeviceType(type);
  };

  const handleBackToEditor = () => {
    navigate("/layout"); // Navigate back to the editor page
  };

  const handlePublish = () => {
    console.log("Publishing page from preview...");
    // You might want to dispatch an event or call an API here
  };

  const getResponsiveSize = (grid) => {
    const sizeProp = grid.properties?.size;
    if (typeof sizeProp === "object" && sizeProp !== null) {
      return sizeProp[deviceType.toLowerCase()] || sizeProp.desktop || 12;
    }
    return sizeProp || 12;
  };

  const renderComponents = (components) => {
    return components.map((grid) => {
      if (!grid.properties || !grid.children) return null;
      const isFinalComponent = grid.children[0]?.name;
      return (
        <Grid item size={getResponsiveSize(grid)} key={grid.id}>
          {" "}
          {/* Use xs for responsive grid */}
          <Box
            sx={{
              minHeight: grid.properties.height || "auto",
              height: "100%",
            }}
          >
            {isFinalComponent ? (
              React.createElement(Components[grid.children[0].name], {
                key: grid.children[0].id,
                ...grid.children[0].properties,
              })
            ) : (
              <Grid container spacing={SPACING}>
                {renderComponents(grid.children)}
              </Grid>
            )}
          </Box>
        </Grid>
      );
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: COLOR.very_light_gray,
      }}
    >
      {/* Fullwidth Navbar */}
      <Box
        sx={{
          width: "100%",
          zIndex: 1000,
          flexShrink: 0, // Prevent shrinking
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: SPACING,
            backgroundColor: COLOR.very_light_gray,
            maxWidth: "1788px",
            margin: "0 auto",
            px: SPACING,
          }}
        >
          {/* Left Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: SPACING }}>
            <Button
              onClick={handleBackToEditor} // Changed handler name
              startIcon={<ArrowBackIcon />}
              sx={{
                color: COLOR.white_ice,
                backgroundColor: COLOR.medium_dark_gray,
                borderRadius: "8px",
                px: SPACING,
                py: 1,
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 600,
                transition: "all 0.2s ease",
              }}
            >
              Back to Editor
            </Button>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label="PREVIEW MODE"
                size="small"
                sx={{
                  backgroundColor: COLOR.green_malachite,
                  color: COLOR.white_ice,
                  fontWeight: "bold",
                  fontSize: "11px",
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.7 },
                    "100%": { opacity: 1 },
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{ color: COLOR.medium_dark_gray }}
              >
                {activePage?.name || "Untitled Page"}
              </Typography>
            </Box>
          </Box>

          {/* Center Section */}
          <ButtonGroup
            variant="contained"
            sx={{
              "& .MuiButton-root": {
                backgroundColor: "#333",
                color: "#fff",
                borderColor: "#555",
                textTransform: "none",
                px: SPACING,
                "&:hover": { backgroundColor: "#555" },
                "&.active": {
                  backgroundColor: "#007FFF",
                  "&:hover": { backgroundColor: "#0066CC" },
                },
              },
            }}
          >
            <Button
              onClick={() => handleResize("100%", "Desktop")}
              startIcon={<DesktopWindowsIcon />}
              className={deviceType === "Desktop" ? "active" : ""}
            >
              Desktop
            </Button>
            <Button
              onClick={() => handleResize(768, "Tablet")}
              startIcon={<TabletMacIcon />}
              className={deviceType === "Tablet" ? "active" : ""}
            >
              Tablet
            </Button>
            <Button
              onClick={() => handleResize(481, "Mobile")}
              startIcon={<PhoneIphoneIcon />}
              className={deviceType === "Mobile" ? "active" : ""}
            >
              Mobile
            </Button>
          </ButtonGroup>

          {/* Right Section */}
          <Button
            onClick={handlePublish}
            startIcon={<PublishIcon />}
            sx={{
              backgroundColor: COLOR.green_malachite,
              color: COLOR.white_ice,
              borderRadius: "8px",
              px: 3,
              py: 1,
              textTransform: "none",
              fontWeight: 600,
              transition: "all 0.2s ease",
            }}
          >
            Publish
          </Button>
        </Box>
      </Box>

      {/* Main Content Area for Preview */}
      <Box
        sx={{
          flex: 1, // Takes remaining vertical space
          width: "100%",
          pb: SPACING,
          backgroundColor: COLOR.very_light_gray,
          overflowY: "auto",
          overflowX: "hidden",
          position: "relative", // For scoped loading overlay
          minHeight: "calc(100vh - 120px)", // PERBAIKAN: Pastikan ada tinggi minimum
        }}
      >
        {isLoading ? (
          // Scoped Loading Indicator - FIXED
          <Box
            sx={{
              position: "fixed", // PERBAIKAN: Fixed positioning untuk menghindari efek geser
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              pointerEvents: "none",
            }}
          >
            <CircularProgress color="primary" size={60} />
            <Typography
              variant="h6"
              sx={{
                mt: SPACING,
                color: COLOR.dark_gray,
                textAlign: "center",
              }}
            >
              Loading Preview...
            </Typography>
          </Box>
        ) : null}

        {/* Content Area - Selalu ada, visibility diatur berdasarkan loading */}
        <Box
          sx={{
            width: "100%", // PERBAIKAN: Full width
            minHeight: "100%",
            opacity: isLoading ? 0 : 1,
            visibility: isLoading ? "hidden" : "visible",
            p: SPACING, // PERBAIKAN: Visibility control
          }}
        >
          <Box
            ref={previewAreaRef}
            sx={{
              width: "100%", // PERBAIKAN: Full width content
              maxWidth: previewSize.width, // PERBAIKAN: Max width berdasarkan device
              margin: "0 auto", // PERBAIKAN: Center alignment
              transform: deviceType === "Desktop" ? "none" : `scale(${scale})`,
              transformOrigin: "top center",
              transition: isLoading
                ? "none"
                : "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              backgroundColor: COLOR.white,
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxSizing: "border-box",
              p: SPACING,
            }}
          >
            {activePage && activePage.layouts.length > 0 ? (
              <Stack spacing={SPACING} sx={{ minHeight: "100%" }}>
                {activePage.layouts.map((layout) => (
                  <Box
                    key={layout.id}
                    sx={{ minHeight: layout.properties.height || "auto" }}
                  >
                    <Grid container spacing={SPACING} sx={{ p: 0 }}>
                      {renderComponents(layout.children)}
                    </Grid>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  minHeight: "400px",
                  backgroundColor: COLOR.white,
                }}
              >
                <Typography variant="h5" color="text.secondary">
                  {activePage
                    ? "No content on this page."
                    : "No page selected or found."}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Device Size Indicator */}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          left: 24,
          backgroundColor: "rgba(0,0,0,0.8)",
          color: COLOR.white_ice,
          px: SPACING,
          py: 1,
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 600,
          zIndex: 1001,
        }}
      >
        {deviceType}: {previewSize.width}px
      </Box>
    </Box>
  );
};

export default PreviewPage;
