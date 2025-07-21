// FileName: src/pages/Preview.jsx
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import TabletMacIcon from "@mui/icons-material/TabletMac";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import CloseIcon from "@mui/icons-material/Close";
import { SPACING } from "@/shared/AppConst";
import { Components } from "remoteApp/Components";

const Preview = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [currentPageId, setCurrentPageId] = useState(null);
  const [previewSize, setPreviewSize] = useState({ width: 1440 });
  const [scale, setScale] = useState(1);
  const previewAreaRef = useRef(null);

  useEffect(() => {
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
  }, []);

  useLayoutEffect(() => {
    if (previewAreaRef.current) {
      const previewAreaWidth = previewAreaRef.current.offsetWidth;
      const calculatedScale = (previewAreaWidth * 0.95) / previewSize.width;
      setScale(Math.min(calculatedScale, 1));
    }
  }, [previewSize.width]);

  const activePage = pages.find((p) => p.id === currentPageId);

  const handleResize = (width) => {
    setPreviewSize({ width });
  };

  const handleClosePreview = () => {
    navigate("/layout");
  };

  // ✅ Fungsi renderComponents dengan logika kolom yang sama seperti sebelumnya
  const renderComponents = (components) => {
    return components.map((grid) => {
      if (!grid.properties || !grid.children) return null;
      const isFinalComponent = grid.children[0]?.name;
      return (
        // Menggunakan 'size' sesuai permintaan untuk konsistensi
        <Grid item size={grid.properties.size || 12} key={grid.id}>
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
              <Grid container spacing={2}>
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
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#EFEFEF",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: SPACING * 2,
        boxSizing: "border-box",
      }}
    >
      {/* Top Bar for Controls */}
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: "1200px",
          p: SPACING,
          mb: SPACING * 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "12px",
          backgroundColor: "#2C2C2C",
          color: "#FFFFFF",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, ml: 1 }}>
          Preview Mode
        </Typography>
        <ButtonGroup variant="contained" aria-label="device preview buttons">
          <Button
            onClick={() => handleResize(1440)}
            startIcon={<DesktopWindowsIcon />}
            sx={{
              textTransform: "none",
              backgroundColor: "#E3E3E3",
              color: "#2c2c2c",
              "&:hover": { backgroundColor: "#FFFFFF" },
            }}
          >
            Desktop
          </Button>
          <Button
            onClick={() => handleResize(1024)}
            startIcon={<TabletMacIcon />}
            sx={{
              textTransform: "none",
              backgroundColor: "#E3E3E3",
              color: "#2c2c2c",
              "&:hover": { backgroundColor: "#FFFFFF" },
            }}
          >
            Tablet
          </Button>
          <Button
            onClick={() => handleResize(480)}
            startIcon={<PhoneIphoneIcon />}
            sx={{
              textTransform: "none",
              backgroundColor: "#E3E3E3",
              color: "#2c2c2c",
              "&:hover": { backgroundColor: "#FFFFFF" },
            }}
          >
            Mobile
          </Button>
        </ButtonGroup>
        <IconButton
          onClick={handleClosePreview}
          sx={{ color: "#FFFFFF", "&:hover": { backgroundColor: "#4f4f4f" } }}
        >
          <CloseIcon />
        </IconButton>
      </Paper>

      {/* REDESIGNED Preview Content Area */}
      <Paper
        ref={previewAreaRef}
        elevation={0}
        sx={{
          flexGrow: 1,
          width: "100%",
          maxWidth: "1440px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "transparent",
          borderRadius: SPACING,
          overflow: "hidden",
          pt: 2,
        }}
      >
        <Box
          sx={{
            width: previewSize.width,
            height: `calc(100% / ${scale})`,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            borderRadius: "8px",
            backgroundColor: "#F9FDFE",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              mb: SPACING,
              overflowY: "auto",
              overflowX: "hidden",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f5f5f5",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#bdbdbd",
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: "#8d8d8d",
                },
              },
            }}
          >
            {activePage && activePage.layouts.length > 0 ? (
              // ✅ Grid container utama kini berada di dalam area scroll
              <Grid container spacing={2} sx={{ p: 2 }}>
                {activePage.layouts.map((layout) => (
                  <Grid item size={12} key={layout.id}>
                    <Box sx={{ minHeight: layout.properties.height || "auto" }}>
                      <Grid container spacing={2}>
                        {renderComponents(layout.children)}
                      </Grid>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
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
                  {activePage
                    ? "No content on this page."
                    : "No page selected."}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Preview;
