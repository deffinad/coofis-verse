import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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

import { BORDER_RADIUS, COLOR, SPACING } from "@/shared/constants/AppConst";
import { Components } from "remoteApp/Components";

// --- Redux Actions ---
import {
  loadPreviewPage,
  clearPreview,
  setPreviewDevice,
} from "../../redux/actions/previewActions";

const PreviewPage = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { pageData, isLoading, error, device } = useSelector(
    (state) => state.preview
  );

  const [previewSize, setPreviewSize] = useState({ width: "100%" });
  const [scale, setScale] = useState(1);
  const previewAreaRef = useRef(null);

  useEffect(() => {
    if (pageId) {
      dispatch(loadPreviewPage(pageId));
    }

    return () => {
      dispatch(clearPreview());
    };
  }, [dispatch, pageId]);

  useLayoutEffect(() => {
    if (previewAreaRef.current?.parentElement && !isLoading) {
      const availableWidth = previewAreaRef.current.parentElement.offsetWidth;
      const targetWidth = previewSize.width;
      if (typeof targetWidth === "number") {
        const calculatedScale = availableWidth / targetWidth;
        setScale(Math.min(calculatedScale, 1));
      } else {
        setScale(1);
      }
    }
  }, [previewSize.width, isLoading, pageData]);

  const handleResize = (width, deviceType) => {
    setPreviewSize({ width });
    dispatch(setPreviewDevice(deviceType));
  };

  const handleBackToEditor = () => {
    navigate("/layout");
  };

  const getResponsiveSize = (grid) => {
    const sizeProp = grid.properties?.size;
    if (typeof sizeProp === "object" && sizeProp !== null) {
      return sizeProp[device.toLowerCase()] || sizeProp.desktop || 12;
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: COLOR.very_light_gray,
      }}
    >
      <Box sx={{ width: "100%", zIndex: 1000, flexShrink: 0 }}>
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
              onClick={handleBackToEditor}
              startIcon={<ArrowBackIcon />}
              sx={{
                color: COLOR.white_ice,
                backgroundColor: COLOR.medium_dark_gray,
                borderRadius: BORDER_RADIUS,
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
                {pageData?.name || "Untitled Page"}
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
              className={device === "Desktop" ? "active" : ""}
            >
              Desktop
            </Button>
            <Button
              onClick={() => handleResize(768, "Tablet")}
              startIcon={<TabletMacIcon />}
              className={device === "Tablet" ? "active" : ""}
            >
              Tablet
            </Button>
            <Button
              onClick={() => handleResize(481, "Mobile")}
              startIcon={<PhoneIphoneIcon />}
              className={device === "Mobile" ? "active" : ""}
            >
              Mobile
            </Button>
          </ButtonGroup>

        </Box>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          width: "100%",
          pb: SPACING,
          backgroundColor: COLOR.very_light_gray,
          overflowY: "auto",
          overflowX: "hidden",
          position: "relative",
          minHeight: "calc(100vh - 120px)",
        }}
      >
        {isLoading && (
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <CircularProgress color="primary" size={60} />
            <Typography
              variant="h6"
              sx={{ mt: SPACING, color: COLOR.dark_gray }}
            >
              Loading Preview...
            </Typography>
          </Box>
        )}

        {error && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              minHeight: "400px",
            }}
          >
            <Typography variant="h5" color="error">
              Error: {error}
            </Typography>
          </Box>
        )}

        {/* Content Area */}
        <Box
          sx={{
            width: "100%",
            minHeight: "100%",
            opacity: isLoading || error ? 0 : 1,
            visibility: isLoading || error ? "hidden" : "visible",
            p: SPACING,
          }}
        >
          <Box
            ref={previewAreaRef}
            sx={{
              width: "100%",
              maxWidth: previewSize.width,
              margin: "0 auto",
              transform: device === "Desktop" ? "none" : `scale(${scale})`,
              transformOrigin: "top center",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              backgroundColor: COLOR.white,
              border: "1px solid #ddd",
              borderRadius: BORDER_RADIUS,
              boxSizing: "border-box",
              p: SPACING,
            }}
          >
            {pageData && pageData.layouts.length > 0 ? (
              <Stack spacing={SPACING} sx={{ minHeight: "100%" }}>
                {pageData.layouts.map((layout) => (
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
              !isLoading && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    minHeight: "400px",
                  }}
                >
                  <Typography variant="h5" color="text.secondary">
                    No content on this page.
                  </Typography>
                </Box>
              )
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
          borderRadius: BORDER_RADIUS,
          fontSize: "12px",
          fontWeight: 600,
          zIndex: 1001,
        }}
      >
        {device}:{" "}
        {typeof previewSize.width === "number"
          ? `${previewSize.width}px`
          : "100%"}
      </Box>
    </Box>
  );
};

export default PreviewPage;
