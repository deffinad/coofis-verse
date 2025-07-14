import React from "react";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const RightMenu = ({
  selectedLayout,
  selectedGrid,
  atribut,
  formData,
  newSize,
  newHeight,
  newMenuItem,
  onDeleteLayout,
  onDeleteGrid,
  onUpdateComponentSize,
  onInputChange,
  onSubmit,
  onSizeChange,
  onHeightChange,
  onMenuItemChange,
  onAddMenuItem,
  onDeleteMenuItem,
}) => {
  return (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          position: "relative",
          height: "auto",
          border: "1px solid #D9D9D9",
          backgroundColor: "#FFFFFF",
          borderRadius: 2,
        },
      }}
    >
      <Box sx={{ width: 240, overflow: "auto", height: "100%", p: 1 }}>
        {/* Header */}
        <Box
          sx={{
            backgroundColor: "#2C2C2C",
            color: "#FFFFFF",
            borderRadius: 2,
            p: 1.5,
            mb: 2,
            display: "flex",
          }}
        >
          <Typography variant="h6">Properties</Typography>
        </Box>

        {/* Delete Layout Button */}
        <Button
          variant="contained"
          color="error"
          fullWidth
          disabled={!selectedLayout}
          onClick={onDeleteLayout}
        >
          Hapus Layout
        </Button>

        {/* Delete Grid Button */}
        <Button
          variant="contained"
          color="error"
          disabled={!selectedGrid}
          fullWidth
          sx={{ mt: 2 }}
          onClick={onDeleteGrid}
        >
          Hapus Grid
        </Button>

        {/* Grid Properties Form */}
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
              sx={{ mt: 2, mb: 2 }}
            />
            <TextField
              label="Ubah Height"
              type="number"
              fullWidth
              value={newHeight || ""}
              onChange={(e) => onHeightChange(e.target.value)}
              sx={{ mt: 2, mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Save
            </Button>
          </form>
        )}

        {/* Component Properties */}
        {atribut && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              <strong>ID:</strong> {atribut.id}
            </Typography>
            <Typography variant="body1">
              <strong>Type:</strong> {atribut.type}
            </Typography>

            {/* Input Component Properties */}
            {atribut.type === "Input" ? (
              <>
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name || ""}
                  onChange={onInputChange}
                  fullWidth
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Label"
                  name="label"
                  value={formData.label || ""}
                  onChange={onInputChange}
                  fullWidth
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Placeholder"
                  name="placeholder"
                  value={formData.placeholder || ""}
                  onChange={onInputChange}
                  fullWidth
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Tipe"
                  name="tipe"
                  value={formData.tipe || ""}
                  onChange={onInputChange}
                  fullWidth
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Value"
                  name="value"
                  value={formData.value || ""}
                  onChange={onInputChange}
                  fullWidth
                  sx={{ mt: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onSubmit}
                  sx={{ mt: 2 }}
                >
                  Simpan
                </Button>
              </>
            ) : atribut.type === "Navbar" ? (
              <>
                {/* Add Menu Item Form */}
                <Box>
                  <TextField
                    label="Label"
                    variant="outlined"
                    value={newMenuItem.label}
                    onChange={(e) =>
                      onMenuItemChange("label", e.target.value)
                    }
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    label="Path"
                    variant="outlined"
                    value={newMenuItem.path}
                    onChange={(e) =>
                      onMenuItemChange("path", e.target.value)
                    }
                    sx={{ mt: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={onAddMenuItem}
                    sx={{ mt: 2 }}
                  >
                    Add Menu Item
                  </Button>
                </Box>

                {/* Menu Items List */}
                <List>
                  {formData.menuItems?.map((item, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => onDeleteMenuItem(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={item.label}
                        secondary={item.path}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            ) : null}
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default RightMenu;