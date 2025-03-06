import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Drawer,
  Typography,
  Grid,
  TextField,
} from "@mui/material";
import { Components } from "remoteApp/Components";
import { createSwapy } from "swapy";

const SwapyWithSideBarv4 = () => {
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const container = useRef(null);
  const swapy = useRef(null);

  const [newSize, setNewSize] = useState(selectedComponent?.size || 12);

  const handleChangeCol = (event) => {
    setNewSize(event.target.value);
  };

  const handleSubmitCol = (event) => {
    event.preventDefault();
    if (selectedComponent) {
      updateComponentSize(selectedComponent.id, parseInt(newSize, 10));
    }
  };

  useEffect(() => {
    const savedRows = localStorage.getItem("savedLayout");
    if (savedRows) {
      setRows(JSON.parse(savedRows));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("savedLayout", JSON.stringify(rows));
  }, [rows]);

  useEffect(() => {
    if (swapy.current?.destroy) {
      swapy.current.destroy();
    }
    if (container.current) {
      swapy.current = createSwapy(container.current);
      swapy.current.onSwap((event) => console.log("Swapped:", event));
    }
  }, [rows]);

  const addRow = () => {
    const newRow = { id: "Layout" + Date.now(), name: "Layout", components: [] };
    setRows([...rows, newRow]);
    setSelectedRow(newRow.id);
  };

  const addComponent = (type) => {
    if (!selectedRow) return;

    if (selectedComponent === null) {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === selectedRow
            ? {
                ...row,
                components: [
                  ...row.components,
                  {
                    id: Date.now(),
                    type,
                    ...(type === "Ratings" ? { value: 0 } : {}),
                    ...(type === "grid" ? { children: [] } : {}),
                    size: 12,
                  },
                ],
              }
            : row
        )
      );

      if (type === "grid") {
        const newGridId = Date.now();
        setSelectedComponent(newGridId);
      }
    } else {
      addComponentToGrid(type);
    }
  };

  const addComponentToGrid = (type) => {
    if (!selectedComponent) return;

    const updateGrid = (components) =>
      components.map((comp) =>
        comp.id === selectedComponent?.id
          ? {
              ...comp,
              children: [
                ...comp.children,
                {
                  id: Date.now(),
                  type,
                  children: type === "grid" ? [] : "disabled",
                  size: 12,
                },
              ],
            }
          : comp.type === "grid"
          ? { ...comp, children: updateGrid(comp.children) }
          : comp
      );

    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        components: updateGrid(row.components),
      }))
    );
  };

  const deleteRow = () => {
    if (!selectedRow) return;
    setRows(rows.filter((row) => row.id !== selectedRow));
    setSelectedRow(null);
  };

  const handleDeleteComponent = () => {
    if (!selectedComponent) return;

    const removeComponent = (components) =>
      components
        .filter((comp) => comp.id !== selectedComponent.id)
        .map((comp) =>
          comp.type === "grid"
            ? { ...comp, children: removeComponent(comp.children) }
            : comp
        );

    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        components: removeComponent(row.components),
      }))
    );

    setSelectedComponent(null);
  };

  const updateComponentSize = (id, newSize) => {
    const updateSizeRecursively = (components) =>
      components.map((comp) => {
        if (comp.id === id) {
          return { ...comp, size: newSize };
        } else if (comp.type === "grid") {
          return { ...comp, children: updateSizeRecursively(comp.children) };
        }
        return comp;
      });

    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        components: updateSizeRecursively(row.components),
      }))
    );
  };

  const renderComponents = (components) => {
    return components.map((comp) => (
      <Grid item xs={comp.size} key={comp.id}>
        {comp.type === "grid" ? (
          <Grid
            sx={{
              border:
                selectedComponent?.id === comp.id
                  ? "1px solid green"
                  : "1px dashed grey",
              "&:hover": {
                cursor: "pointer",
                border: "1px solid green",
              },
              padding: comp.type === "grid" ? 1 : 0, // Padding hanya untuk grid
            }}
            minHeight={"50px"}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedComponent(comp);
              setNewSize(comp.size);
            }}
          >
            {renderComponents(comp.children, comp.id)}
          </Grid>
        ) : (
          React.createElement(Components[comp.type], { key: comp.id, ...comp })
        )}
      </Grid>
    ));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer variant="permanent" anchor="left" sx={{ width: 240 }}>
        <Box sx={{ width: 240, p: 2 }}>
          <Button variant="contained" fullWidth onClick={addRow}>
            Tambah Layout
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            disabled={!selectedRow}
            onClick={() => addComponent("grid")}
          >
            Tambah Grid
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            disabled={!selectedRow && !selectedComponent}
            onClick={() => addComponentToGrid("Ratings")}
          >
            Tambah Rating
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            disabled={!selectedRow && !selectedComponent}
            onClick={() => addComponentToGrid("Navbar")}
          >
            Tambah Menu
          </Button>
        </Box>
      </Drawer>

      <Box ref={container} sx={{ flexGrow: 1, p: 5, mt: 2 }}>
        {rows.map((row, rowIndex) => (
          <Box
            key={row.id}
            sx={{
              border: `2px solid ${selectedRow === row.id ? "green" : "red"}`,
              padding: 1,
              marginBottom: 2,
              flexGrow: 1,
              cursor: "pointer",
              minHeight: "50vh",
            }}
            onClick={() => {
              setSelectedRow(row.id);
              setSelectedComponent(null);
            }}
          >
            <Box sx={{ display: "flex" }}>
              <Grid container spacing={2}>
                {renderComponents(row.components, row.id)}
              </Grid>
            </Box>
          </Box>
        ))}
      </Box>

      <Drawer variant="permanent" anchor="right" sx={{ width: 240 }}>
        <Box sx={{ width: 240, p: 2 }}>
          <Typography>Layout: {selectedRow}</Typography>
          <Typography>Component: {selectedComponent?.id}</Typography>
          <Typography>Col: {selectedComponent?.size}</Typography>

          {/* Form untuk mengubah col */}
          {selectedComponent && (
            <form onSubmit={handleSubmitCol}>
              <TextField
                label="Ubah Col"
                type="number"
                fullWidth
                value={newSize}
                onChange={handleChangeCol}
                sx={{ mt: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Simpan
              </Button>
            </form>
          )}

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={!selectedRow}
            onClick={deleteRow}
          >
            Hapus Layout
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={!selectedComponent}
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleDeleteComponent}
          >
            Hapus Komponen
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default SwapyWithSideBarv4;
