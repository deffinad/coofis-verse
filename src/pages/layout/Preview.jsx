// FileName: /Preview.jsx
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
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
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import TabletMacIcon from "@mui/icons-material/TabletAndroid";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PublishIcon from "@mui/icons-material/Publish";
import { COLOR, SPACING } from "@/shared/AppConst";
import { Components } from "remoteApp/Components";

const Preview = ({ open, onClose, pages, currentPageId, container }) => {
  const [previewSize, setPreviewSize] = useState({ width: 1280 });
  const [scale, setScale] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceType, setDeviceType] = useState("Desktop");
  const previewAreaRef = useRef(null);

  useEffect(() => {
    if (open) {
      const loadPreviewData = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIsLoading(false);
      };
      loadPreviewData();
    }
  }, [open]);

  useLayoutEffect(() => {
    if (previewAreaRef.current && !isLoading && open) {
      const previewAreaWidth = previewAreaRef.current.offsetWidth;
      const calculatedScale = previewAreaWidth / previewSize.width;
      setScale(Math.min(calculatedScale, 1));
    }
  }, [previewSize.width, isLoading, open]);

  const activePage = pages.find((p) => p.id === currentPageId);

  const handleResize = (width, type) => {
    setPreviewSize({ width });
    setDeviceType(type);
  };

  const handleClosePreview = () => {
    onClose();
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

  // Backdrop untuk loading tetap fullscreen karena ini adalah state awal
  if (isLoading && open) {
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
    <Dialog
      open={open}
      onClose={handleClosePreview}
      container={container}
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: (theme) => theme.zIndex.modal + 100,
        backgroundColor: COLOR.very_light_gray,
        "& .MuiBackdrop-root": {
          position: "absolute",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        "& .MuiDialog-paper": {
          backgroundColor: COLOR.very_light_gray,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          maxWidth: "100%",
          maxHeight: "100%",
          margin: 0,
          borderRadius: 0,
        },
      }}
    >
      {/* Fullwidth Navbar */}
      <Box
        sx={{
          width: "100%",
          zIndex: 1000,
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
          }}
        >
          {/* Left Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: SPACING }}>
            <Button
              onClick={handleClosePreview}
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
              transition: "all 0.2s ease",
            }}
          >
            Publish
          </Button>
        </Box>
      </Box>

      <DialogContent
        sx={{
          flex: 1,
          width: "100%",
          backgroundColor: COLOR.very_light_gray,
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
          ref={previewAreaRef}
          sx={{
            display: "flex",
            justifyContent: "center",
            boxSizing: "border-box",
            minHeight: "100%",
            p: SPACING,
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
      </DialogContent>

      {/* Floating Action Buttons (jika masih diperlukan, bisa di DialogActions) */}
      <DialogActions
        sx={{
          position: "absolute",
          bottom: 24,
          right: 24,
          display: "flex",
          flexDirection: "column",
          gap: SPACING,
          zIndex: 1001,
          backgroundColor: "transparent",
          p: 0,
        }}
      >
        {/* Anda bisa menambahkan tombol lain di sini jika ada */}
      </DialogActions>

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
    </Dialog>
  );
};

export default Preview;
