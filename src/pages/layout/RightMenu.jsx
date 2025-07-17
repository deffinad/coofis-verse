import React from "react";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  Switch,
} from "@mui/material";
import { SPACING } from "@/shared/AppConst";

const RightMenu = ({
  selectedLayout,
  selectedGrid,
  atribut,
  formData,
  newSize,
  newHeight,
  newMenuItem,
  onDelete,
  onUpdateComponentSize,
  onInputChange,
  onSubmit,
  onSizeChange,
  onHeightChange,
  onMenuItemChange,
  onAddMenuItem,
  onDeleteMenuItem,
}) => {
  const renderPropertyField = (key, valueFromProps, onChange, path = "") => {
    const fullPath = path ? `${path}.${key}` : key;

    // Dapatkan nilai dari formData. Jika tidak ada di formData, gunakan nilai default dari props (valueFromProps)
    // Ini penting untuk properti bersarang yang mungkin belum ada di formData saat inisialisasi awal
    const currentValue =
      getNestedValue(formData, pathArrayFromFullPath(fullPath)) !== undefined
        ? getNestedValue(formData, pathArrayFromFullPath(fullPath))
        : valueFromProps;

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
          value={currentValue} // <-- Selalu gunakan currentValue dari formData
          onChange={(e) => onChange(fullPath, e.target.value)}
          fullWidth
          sx={{ mt: SPACING }}
        />
      );
    } else if (typeof valueFromProps === "boolean") {
      return (
        <Box
          key={fullPath}
          sx={{ mt: SPACING, display: "flex", alignItems: "center" }}
        >
          <Typography>{key.charAt(0).toUpperCase() + key.slice(1)}:</Typography>
          <Switch
            checked={currentValue} // <-- Selalu gunakan currentValue dari formData
            onChange={(e) => onChange(fullPath, e.target.checked)}
            name={fullPath}
          />
        </Box>
      );
    } else if (Array.isArray(valueFromProps)) {
      // Untuk array, kita perlu memastikan formData[key] juga array
      const currentArray =
        getNestedValue(formData, pathArrayFromFullPath(fullPath)) || [];
      return (
        <Box
          key={fullPath}
          sx={{ mt: SPACING, border: "1px dashed #ccc", p: 1 }}
        >
          <Typography variant="subtitle1">
            {key.charAt(0).toUpperCase() + key.slice(1)} (Array):
          </Typography>
          <List>
            {currentArray.map(
              (
                item,
                index // <-- Iterasi currentArray dari formData
              ) => (
                <ListItem
                  key={`${fullPath}-${index}`}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      // Perhatikan: untuk delete item array, onInputChange perlu tahu index dan aksi 'delete'
                      onClick={() => onChange(fullPath, index, "delete")}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  {typeof item === "object" && item !== null ? (
                    <ListItemText primary={Object.values(item).join(" - ")} />
                  ) : (
                    <ListItemText primary={item.toString()} />
                  )}
                </ListItem>
              )
            )}
          </List>
        </Box>
      );
    } else if (typeof valueFromProps === "object" && valueFromProps !== null) {
      // Untuk objek bersarang, kita perlu memastikan formData[key] juga objek
      const currentObject =
        getNestedValue(formData, pathArrayFromFullPath(fullPath)) || {};
      return (
        <Box
          key={fullPath}
          sx={{ mt: SPACING, border: "1px solid #eee", p: 1 }}
        >
          <Typography variant="subtitle1">
            {key.charAt(0).toUpperCase() + key.slice(1)} (Object):
          </Typography>
          {Object.entries(valueFromProps).map(([subKey, subValue]) =>
            // Rekursif, tapi pastikan subValue yang diteruskan adalah dari currentObject
            renderPropertyField(
              subKey,
              currentObject[subKey] !== undefined
                ? currentObject[subKey]
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

  // Helper function to get nested value from an object
  const getNestedValue = (obj, pathArr) => {
    return pathArr.reduce((acc, part) => acc && acc[part], obj);
  };
  // Helper function to convert fullPath string to array
  const pathArrayFromFullPath = (fullPath) => fullPath.split(".");

  return (
    <Box
      sx={{
        width: 300,
        backgroundColor: "#FFFFFF",
        borderRadius: SPACING,
        border: "1px solid #D9D9D9",
        flexShrink: 0,
        position: "sticky",
        top: "24px",
        height: "80vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: 1 }}>
        {/* Header */}
        <Box
          sx={{
            backgroundColor: "#2C2C2C",
            color: "#FFFFFF",
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onUpdateComponentSize(
                selectedGrid.id,
                parseInt(newSize),
                parseInt(newHeight)
              );
            }}
          >
            <TextField
              label="Ubah Col"
              type="number"
              fullWidth
              value={newSize || ""}
              onChange={(e) => onSizeChange(e.target.value)}
              sx={{ mt: SPACING, mb: SPACING }}
            />
            <TextField
              label="Ubah Height"
              type="number"
              fullWidth
              value={newHeight || ""}
              onChange={(e) => onHeightChange(e.target.value)}
              sx={{}}
            />
            {/* Input Component Properties */}
            {atribut &&
            atribut.properties &&
            Object.keys(atribut.properties).length > 0 ? (
              <Box sx={{ mt: SPACING }}>
                <Box
                  sx={{
                    backgroundColor: "#2C2C2C",
                    color: "#FFFFFF",
                    borderRadius: SPACING,
                    p: 1.5,
                    mb: SPACING,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="h7">Component Properties</Typography>
                  </Box>
                </Box>
                {Object.entries(atribut.properties).map(([key, value]) =>
                  renderPropertyField(key, value, onInputChange)
                )}
              </Box>
            ) : atribut ? (
              <Typography sx={{ mt: SPACING }}>
                Tidak ada properti yang dapat diedit untuk komponen ini.
              </Typography>
            ) : null}
          </form>
        )}

        {/* Component Properties */}
        {atribut && (
          <Box sx={{ mt: SPACING }}>
            <Typography variant="body1">
              <strong>ID:</strong> {atribut.id}
            </Typography>
            <Typography variant="body1">
              <strong>Type:</strong> {atribut.name}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RightMenu;
