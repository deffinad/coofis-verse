import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, Typography, Switch } from "@mui/material";
import { COLOR, SPACING } from "@/shared/AppConst";

const RightMenu = ({
  selectedGrid,
  atribut,
  formData,
  newSize,
  newHeight,
  onInputChange,
  onSizeChange,
  onHeightChange,
}) => {
  const [menuHeight, setMenuHeight] = useState("calc(100vh - 150px)");
  const menuRef = useRef(null);

  // Hook untuk menghitung tinggi dinamis berdasarkan scroll position
  useEffect(() => {
    const calculateHeight = () => {
      if (menuRef.current) {
        const rect = menuRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const topOffset = rect.top;
        const bottomPadding = 20;

        const availableHeight = viewportHeight - topOffset - bottomPadding;

        const minHeight = 300;
        const finalHeight = Math.max(availableHeight, minHeight);

        setMenuHeight(`${finalHeight}px`);
      }
    };

    calculateHeight();

    // Event listener untuk scroll dan resize
    const handleScroll = () => calculateHeight();
    const handleResize = () => calculateHeight();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Helper function to get nested value from an object
  const getNestedValue = (obj, pathArr) => {
    return pathArr.reduce((acc, part) => acc && acc[part], obj);
  };
  // Helper function to convert fullPath string to array
  const pathArrayFromFullPath = (fullPath) => fullPath.split(".");

  const renderPropertyField = (key, valueFromProps, onChange, path = "") => {
    const fullPath = path ? `${path}.${key}` : key;
    const currentValue =
      getNestedValue(formData, pathArrayFromFullPath(fullPath)) !== undefined
        ? getNestedValue(formData, pathArrayFromFullPath(fullPath))
        : valueFromProps;

    // --- Penanganan untuk String dan Number ---
    if (
      typeof valueFromProps === "string" ||
      typeof valueFromProps === "number"
    ) {
      return (
        <TextField
          key={fullPath}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          name={fullPath}
          type={typeof valueFromProps === "number" ? "number" : "text"}
          value={currentValue}
          onChange={(e) => onChange(fullPath, e.target.value)}
          fullWidth
          sx={{ mt: SPACING }}
        />
      );
    }

    // --- Penanganan untuk Boolean ---
    else if (typeof valueFromProps === "boolean") {
      return (
        <Box
          key={fullPath}
          sx={{ mt: SPACING, display: "flex", alignItems: "center" }}
        >
          <Typography>{key.charAt(0).toUpperCase() + key.slice(1)}:</Typography>
          <Switch
            checked={!!currentValue}
            onChange={(e) => onChange(fullPath, e.target.checked)}
            name={fullPath}
          />
        </Box>
      );
    } else if (Array.isArray(valueFromProps)) {
      return (
        <TextField
          key={fullPath}
          label={`${key.charAt(0).toUpperCase() + key.slice(1)} (JSON Array)`}
          name={fullPath}
          multiline
          rows={5}
          value={JSON.stringify(currentValue, null, 2)}
          onChange={(e) => onChange(fullPath, e.target.value, "json")}
          fullWidth
          sx={{ mt: SPACING }}
          helperText="Edit array dalam format JSON."
        />
      );
    }

    // --- Penanganan untuk Object (rekursif) ---
    else if (typeof valueFromProps === "object" && valueFromProps !== null) {
      return (
        <Box
          key={fullPath}
          sx={{ mt: SPACING, border: "1px solid #eee", p: 1 }}
        >
          <Typography variant="subtitle1">
            {key.charAt(0).toUpperCase() + key.slice(1)} (Object):
          </Typography>
          {Object.entries(valueFromProps).map(([subKey, subValue]) =>
            renderPropertyField(
              subKey,
              currentValue?.[subKey] !== undefined
                ? currentValue[subKey]
                : subValue,
              onChange,
              fullPath
            )
          )}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box
      ref={menuRef}
      sx={{
        width: 300,
        backgroundColor: COLOR.white_winter,
        borderRadius: SPACING,
        border: `1px solid ${COLOR.light_gray}`,
        flexShrink: 0,
        position: "sticky",
        top: "105px",
        height: menuHeight,
        overflowY: "auto",
        overflowX: "hidden",
        transition: "height 0.1s ease-out",
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
      <Box sx={{ p: 1 }}>
        {/* Header */}
        <Box
          sx={{
            backgroundColor: COLOR.dark_gray,
            color: COLOR.white_ice,
            borderRadius: SPACING,
            p: 1.5,
            mb: SPACING,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6">Properties</Typography>
          </Box>
        </Box>
        {selectedGrid && (
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ mt: 1, mb: 1, color: COLOR.dark_gray }}
            >
              Responsive Columns
            </Typography>
            <TextField
              label="Desktop Cols (1-12)"
              type="number"
              fullWidth
              value={newSize?.desktop || ""}
              onChange={(e) => onSizeChange("desktop", e.target.value)}
              inputProps={{ min: 1, max: 12 }}
              sx={{ mb: SPACING }}
            />
            <TextField
              label="Tablet Cols (1-12)"
              type="number"
              fullWidth
              value={newSize?.tablet || ""}
              onChange={(e) => onSizeChange("tablet", e.target.value)}
              inputProps={{ min: 1, max: 12 }}
              sx={{ mb: SPACING }}
            />
            <TextField
              label="Mobile Cols (1-12)"
              type="number"
              fullWidth
              value={newSize?.mobile || ""}
              onChange={(e) => onSizeChange("mobile", e.target.value)}
              inputProps={{ min: 1, max: 12 }}
              sx={{ mb: SPACING }}
            />

            <Typography
              variant="subtitle1"
              sx={{ mb: 1, color: COLOR.dark_gray }}
            >
              Sizing
            </Typography>
            <TextField
              label="Min Height (px)"
              type="number"
              fullWidth
              value={newHeight || ""}
              onChange={(e) => onHeightChange(e.target.value)}
              sx={{}}
              inputProps={{ min: 0 }}
            />
            {/* Input Component Properties */}
            {atribut && atribut.properties && (
              <Box sx={{ mt: SPACING }}>
                <Box
                  sx={{
                    backgroundColor: COLOR.dark_gray,
                    color: COLOR.white_ice,
                    borderRadius: SPACING,
                    p: 1.5,
                    mb: SPACING,
                  }}
                >
                  <Typography variant="h6">Component Properties</Typography>
                </Box>
                {Object.entries(atribut.properties).map(([key, value]) =>
                  renderPropertyField(key, value, onInputChange)
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RightMenu;
