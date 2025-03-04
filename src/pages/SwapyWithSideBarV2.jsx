import React, { useState } from "react";
import { Box, Button, Typography, Drawer, TextField, Slider } from "@mui/material";
import { Components } from "remoteApp/Components";

const RecursiveComponent = ({ component, onAddComponent }) => {
  const [ratingValue, setRatingValue] = useState(1);

  return (
    <Box
      sx={{
        border: "2px solid gray",
        padding: 2,
        marginTop: 2,
        backgroundColor: component.backgroundColor || "#f0f0f0",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onAddComponent(component.idDroppable);
      }}
    >
      {component.name === "Ratings" ? (
        <>
          <Components.Input.InputField
            id={"rating"}
            name={"rating"}
            label={"Rating"}
            value={ratingValue}
            type={"number"}
            onChange={(e) => setRatingValue(e.target.value)}
          />
          <Components.Ratings value={ratingValue} />
        </>
      ) : (
        component.name
      )}

      {component.components && component.components.map((child) => (
        <RecursiveComponent
          key={child.idDroppable}
          component={child}
          onAddComponent={onAddComponent}
        />
      ))}
    </Box>
  );
};

const SwapyWithSideBarV2 = () => {
  const [rows, setRows] = useState([]);
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [gridSettings, setGridSettings] = useState({
    column: 12,
    backgroundColor: "#ffffff",
  });

  const addRow = () => {
    const newRow = {
      idDroppable: Date.now(),
      name: "Row",
      components: [],
    };
    setRows([...rows, newRow]);
    setSelectedComponentId(newRow.idDroppable);
  };

  const addComponent = (parentId, type) => {
    const addComponentRecursively = (components) => {
      return components.map((component) => {
        if (component.idDroppable === parentId) {
          const newComponent = {
            idDroppable: Date.now(),
            name: type === "grid" ? "Grid" : "Ratings",
            column: gridSettings.column,
            backgroundColor: gridSettings.backgroundColor,
            components: [],
          };
          return {
            ...component,
            components: [...component.components, newComponent],
          };
        } else if (component.components.length > 0) {
          return {
            ...component,
            components: addComponentRecursively(component.components),
          };
        }
        return component;
      });
    };

    setRows(addComponentRecursively(rows));
  };

  const handleAddComponent = (parentId) => {
    const type = window.prompt("Masukkan tipe komponen (grid/ratings):");
    if (type === "grid" || type === "ratings") {
      addComponent(parentId, type);
    } else {
      alert("Tipe komponen tidak valid!");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar Kiri */}
      <Drawer variant="permanent" anchor="left" sx={{ width: 240, flexShrink: 0 }}>
        <Box sx={{ width: 240, p: 2 }}>
          <Button variant="contained" fullWidth onClick={addRow}>
            Tambah Layout
          </Button>
        </Box>
      </Drawer>

      {/* Konten Utama */}
      <Box sx={{ flexGrow: 1, p: 3, mt: 2 }}>
        {rows.map((row) => (
          <RecursiveComponent
            key={row.idDroppable}
            component={row}
            onAddComponent={handleAddComponent}
          />
        ))}
      </Box>

      {/* Sidebar Kanan */}
      <Drawer variant="permanent" anchor="right" sx={{ width: 240, flexShrink: 0 }}>
        <Box sx={{ width: 240, p: 2 }}>
          <Typography variant="h6">Pengaturan Grid</Typography>
          <TextField
            label="Warna Background"
            type="text"
            fullWidth
            value={gridSettings.backgroundColor}
            onChange={(e) =>
              setGridSettings({
                ...gridSettings,
                backgroundColor: e.target.value,
              })
            }
            sx={{ mt: 2 }}
          />
          <Typography sx={{ mt: 2 }}>Ukuran Kolom</Typography>
          <Slider
            value={gridSettings.column}
            min={1}
            max={12}
            step={1}
            marks
            valueLabelDisplay="auto"
            onChange={(e, newValue) =>
              setGridSettings({ ...gridSettings, column: newValue })
            }
          />
        </Box>
      </Drawer>
    </Box>
  );
};

export default SwapyWithSideBarV2;
