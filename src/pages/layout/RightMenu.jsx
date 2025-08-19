import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, TextField, Typography, Switch } from "@mui/material";
import { BORDER_RADIUS, COLOR, SPACING } from "@/shared/constants/AppConst";
import { useDynamicMenuHeight } from "@/shared/utils/utility";
import { debounce } from "@/shared/utils/debounce";
import {
  updateComponentProperty,
  updateSiblingHeights,
} from "../../redux/actions/layoutActions";

const RightMenu = () => {
  const dispatch = useDispatch();

  const { selectedGrid, atribut } = useSelector((state) => state.layout);

  const menuRef = useRef(null);
  const menuHeight = useDynamicMenuHeight(menuRef);
  const [localSize, setLocalSize] = useState({
    desktop: 12,
    tablet: 12,
    mobile: 12,
  });
  const [localHeight, setLocalHeight] = useState("");
  const [localFormData, setLocalFormData] = useState({});

  useEffect(() => {
    if (selectedGrid?.properties) {
      const { size, height } = selectedGrid.properties;
      // Normalisasi data 'size' jika hanya number
      const normalizedSize =
        typeof size === "object" && size !== null
          ? size
          : { desktop: size || 12, tablet: 12, mobile: 12 };
      setLocalSize(normalizedSize);
      setLocalHeight(parseInt(height) || "");
    } else {
      setLocalSize({ desktop: 12, tablet: 12, mobile: 12 });
      setLocalHeight("");
    }

    if (atribut?.properties) {
      setLocalFormData(atribut.properties);
    } else {
      setLocalFormData({});
    }
  }, [selectedGrid, atribut]);

  const debouncedUpdate = useCallback(
    debounce((id, path, value) => {
      dispatch(updateComponentProperty(id, path, value));
    }, 500),
    [dispatch]
  );

  const debouncedUpdateSiblingsHeight = useCallback(
    debounce((gridId, height) => {
      dispatch(updateSiblingHeights(gridId, height));
    }, 500),
    [dispatch]
  );

  const handleSizeChange = useCallback(
    (device, value) => {
      if (!selectedGrid) return;
      const numValue = value === "" ? "" : parseInt(value, 10);
      let finalValue = numValue;
      if (numValue !== "" && (isNaN(numValue) || numValue < 1)) finalValue = 1;
      else if (numValue > 12) finalValue = 12;

      const updatedSize = { ...localSize, [device]: finalValue };
      setLocalSize(updatedSize);
      debouncedUpdate(selectedGrid.id, "size", updatedSize);
    },
    [selectedGrid, localSize, debouncedUpdate]
  );

  const handleHeightChange = useCallback(
  (value) => {
    if (!selectedGrid) return;
    
    // Pastikan nilai height dalam format yang benar
    let finalHeight = value === "" ? "" : parseInt(value, 10);
    
    // Validasi nilai minimum (opsional)
    if (finalHeight !== "" && finalHeight < 0) {
      finalHeight = 0;
    }

    setLocalHeight(finalHeight);

    const heightValue = finalHeight === "" ? "" : `${finalHeight}px`;
    
    debouncedUpdate(selectedGrid.id, "height", heightValue);
  },
  [selectedGrid, debouncedUpdate]
);

  const handleLocalInputChange = useCallback(
    (path, value) => {
      const updateNested = (obj, pathArr, val) => {
        if (pathArr.length === 1) return { ...obj, [pathArr[0]]: val };
        const [head, ...rest] = pathArr;
        return { ...obj, [head]: updateNested(obj[head] || {}, rest, val) };
      };

      const pathArray = path.split(".");
      setLocalFormData((prev) => updateNested(prev, pathArray, value));

      if (atribut?.id) {
        debouncedUpdate(atribut.id, path, value);
      }
    },
    [atribut?.id, debouncedUpdate]
  );

  const getNestedValue = (obj, pathArr) =>
    pathArr.reduce((acc, part) => acc && acc[part], obj);

  const renderPropertyField = (key, valueFromProps, path = "") => {
    const fullPath = path ? `${path}.${key}` : key;
    const pathArray = fullPath.split(".");
    const currentValue =
      getNestedValue(localFormData, pathArray) ?? valueFromProps;

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
          onChange={(e) => handleLocalInputChange(fullPath, e.target.value)}
          fullWidth
          sx={{ mt: SPACING }}
        />
      );
    }

    else if (typeof valueFromProps === "boolean") {
      return (
        <Box
          key={fullPath}
          sx={{ mt: SPACING, display: "flex", alignItems: "center" }}
        >
          <Typography>{key.charAt(0).toUpperCase() + key.slice(1)}:</Typography>
          <Switch
            checked={!!currentValue}
            onChange={(e) => handleLocalInputChange(fullPath, e.target.checked)}
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
          onChange={(e) => handleLocalInputChange(fullPath, e.target.value)}
          fullWidth
          sx={{ mt: SPACING }}
          helperText="Edit array dalam format JSON."
        />
      );
    }

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
              getNestedValue(
                localFormData,
                pathArrayFromFullPath(`${fullPath}.${subKey}`)
              ) !== undefined
                ? getNestedValue(
                    localFormData,
                    pathArrayFromFullPath(`${fullPath}.${subKey}`)
                  )
                : subValue,
              handleLocalInputChange,
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
        borderRadius: BORDER_RADIUS,
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
          borderRadius: BORDER_RADIUS,
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
            borderRadius: BORDER_RADIUS,
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
              value={localSize?.desktop || ""}
              onChange={(e) => handleSizeChange("desktop", e.target.value)}
              inputProps={{ min: 1, max: 12 }}
              sx={{ mb: SPACING }}
            />
            <TextField
              label="Tablet Cols (1-12)"
              type="number"
              fullWidth
              value={localSize?.tablet || ""}
              onChange={(e) => handleSizeChange("tablet", e.target.value)}
              inputProps={{ min: 1, max: 12 }}
              sx={{ mb: SPACING }}
            />
            <TextField
              label="Mobile Cols (1-12)"
              type="number"
              fullWidth
              value={localSize?.mobile || ""}
              onChange={(e) => handleSizeChange("mobile", e.target.value)}
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
              value={localHeight}
              onChange={(e) => handleHeightChange(e.target.value)}
              inputProps={{ min: 0 }}
            />
            {/* Input Component Properties */}
            {atribut && (
              <Box sx={{ mt: SPACING }}>
                <Box
                  sx={{
                    backgroundColor: COLOR.dark_gray,
                    color: COLOR.white_ice,
                    borderRadius: BORDER_RADIUS,
                    p: 1.5,
                    mb: SPACING,
                  }}
                >
                  <Typography variant="h6">Component Properties</Typography>
                </Box>
                {Object.entries(localFormData).map(([key, value]) =>
                  renderPropertyField(key, value)
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
