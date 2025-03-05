import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Drawer, Typography } from "@mui/material";
import { Components } from "remoteApp/Components"; // Import remote components
import { createSwapy } from "swapy";

const SwapyWithSideBarv4 = () => {
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const container = useRef(null);
  const swapy = useRef(null);

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
    const newRow = { id: "Row" + Date.now(), name: "Row", components: [] };
    setRows([...rows, newRow]);
    setSelectedRow(newRow.id);
  };

  const addComponent = (type, name) => {
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
                    ...(type === "grid" ? { children: [], size: 12 } : {}),
                    name: name,
                  },
                ],
              }
            : row
        )
      );
    } else {
      addComponentToGrid(type);
    }
  };

  const addComponentToGrid = (type) => {
    if (!selectedComponent) return;

    const updateGrid = (components) =>
      components.map((comp) =>
        comp.id === selectedComponent
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
        .filter((comp) => comp.id !== selectedComponent)
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

  const renderComponents = (components, parentGridId) => {
    return components.map((comp) => (
      <React.Fragment key={comp.id}>
        {comp.type === "grid" ? (
          <Components.Layout.LayoutGrid
            style={{
              border: `2px solid ${
                selectedComponent === comp.id ? "green" : "red"
              }`,
              padding: 2,
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedComponent(comp.id);
            }}
            size={comp.size}
          >
            {renderComponents(comp.children, comp.id)}
          </Components.Layout.LayoutGrid>
        ) : (
          React.createElement(
            comp.name
              ? Components[comp.type]?.[comp.name]
              : Components[comp.type],
            { key: comp.id, ...comp }
          )
        )}
      </React.Fragment>
    ));
  };

  console.log("rows", rows);
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
            onClick={() => addComponent("Ratings", "")}
          >
            Tambah Rating
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            disabled={!selectedRow && !selectedComponent}
            onClick={() => addComponent("Menu", "Navbar")}
          >
            Tambah Menu
          </Button>
        </Box>
      </Drawer>

      <Box ref={container} sx={{ flexGrow: 1, p: 5, mt: 2 }}>
        {rows.map((row) => (
          <Box
            key={row.id}
            sx={{
              border: `2px solid ${selectedRow === row.id ? "green" : "red"}`,
              padding: 2,
              marginTop: 2,
            }}
            onClick={() => {
              setSelectedRow(row.id);
              setSelectedComponent(null);
            }}
          >
            {renderComponents(row.components, row.id)}
          </Box>
        ))}
      </Box>

      <Drawer variant="permanent" anchor="right" sx={{ width: 240 }}>
        <Box sx={{ width: 240, p: 2 }}>
          <Typography>Layout: {selectedRow}</Typography>
          <Typography>Component: {selectedComponent}</Typography>
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
