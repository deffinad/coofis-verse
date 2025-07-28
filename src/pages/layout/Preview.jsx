import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  ButtonGroup,
  Typography,
  Grid,
  Backdrop,
  CircularProgress,
  Chip,
  Stack,
} from "@mui/material";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import TabletMacIcon from "@mui/icons-material/TabletMac";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PublishIcon from "@mui/icons-material/Publish";
import { COLOR, SPACING } from "@/shared/AppConst";
import { Components } from "remoteApp/Components";

const Preview = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [currentPageId, setCurrentPageId] = useState(null);
  const [previewSize, setPreviewSize] = useState({ width: 1280 });
  const [scale, setScale] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceType, setDeviceType] = useState("Desktop");
  const previewAreaRef = useRef(null);

  useEffect(() => {
    const loadPreviewData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const savedPages = localStorage.getItem("savedPages");
      const currentPagesId = localStorage.getItem("curentPages");

      if (savedPages) {
        try {
          setPages(JSON.parse(savedPages));
        } catch (e) {
          console.error("Failed to parse pages from localStorage", e);
        }
      }
      if (currentPagesId) {
        try {
          setCurrentPageId(JSON.parse(currentPagesId));
        } catch (e) {
          console.error("Failed to parse currentPageId from localStorage", e);
        }
      }
      setIsLoading(false);
    };

    loadPreviewData();
  }, []);

  useLayoutEffect(() => {
    if (previewAreaRef.current && !isLoading) {
      const previewAreaWidth = previewAreaRef.current.offsetWidth;
      const calculatedScale = previewAreaWidth / previewSize.width;
      setScale(Math.min(calculatedScale, 1));
    }
  }, [previewSize.width, isLoading]);

  const activePage = pages.find((p) => p.id === currentPageId);

  const handleResize = (width, type) => {
    setPreviewSize({ width });
    setDeviceType(type);
  };

  const handleClosePreview = () => {
    navigate("/layout");
  };

  const handlePublish = () => {
    console.log("Publishing page...");
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

  if (isLoading) {
    return (
      <Backdrop open={isLoading} sx={{ zIndex: 9999 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress color="primary" size={60} />
          <Typography variant="h6" sx={{ mt: SPACING, color: COLOR.white_ice }}>
            Loading Preview...
          </Typography>
        </Box>
      </Backdrop>
    );
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: COLOR.very_light_gray,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Fullwidth Navbar */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: COLOR.dark_gray,
          borderBottom: "1px solid #333",
          zIndex: 1000,
          
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            py: SPACING,
            maxWidth: "none",
          }}
        >
          {/* Left Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: SPACING }}>
            <Button
              onClick={handleClosePreview}
              startIcon={<ArrowBackIcon />}
              sx={{
                color: COLOR.dark_gray,
                backgroundColor: COLOR.light_gray,
                borderRadius: "8px",
                px: SPACING,
                py: 1,
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#555",
                  transform: "translateY(-1px)",
                },
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
              <Typography variant="body2" sx={{ color: "#ccc" }}>
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
              onClick={() => handleResize(1280, "Desktop")}
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
              "&:hover": {
                backgroundColor: "#00A844",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Publish
          </Button>
        </Box>
      </Box>

      {/* Preview Content Area */}
      <Box
        ref={previewAreaRef}
        sx={{
          flex: 1,
          width: "100%",
          backgroundColor: COLOR.light_gray,
          overflowY: "auto",
          overflowX: "hidden",
          p: SPACING,
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f8f8f8",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#c1c1c1",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#a8a8a8",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            boxSizing: "border-box",
            minHeight: "100%",
            p: SPACING ,
            mr: SPACING,
          }}
        >
          <Box
            sx={{
              p: SPACING,
              width: deviceType === "Desktop" ? "100%" : previewSize.width,
              maxWidth: "100%",
              height:
                deviceType === "Desktop" ? "auto" : `calc(100% / ${scale})`,
              transform: deviceType === "Desktop" ? "none" : `scale(${scale})`,
              transformOrigin: "top center",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              backgroundColor: COLOR.white,
              border: deviceType === "Desktop" ? "none" : "1px solid #ddd",
              borderRadius: "8px",
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
                    : "No page selected."}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Floating Action Buttons */}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          display: "flex",
          flexDirection: "column",
          gap: SPACING,
          zIndex: 1001,
        }}
      ></Box>

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

export default Preview;
