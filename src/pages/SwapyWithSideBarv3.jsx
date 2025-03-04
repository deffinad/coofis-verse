import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Drawer, Typography } from "@mui/material";
import { Components } from "remoteApp/Components"; // Import remote components
import { createSwapy } from "swapy";
import { Padding } from "@mui/icons-material";

const SwapyWithSideBarv3 = () => {
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedGrid, setSelectedGrid] = useState(null); // Grid yang dipilih

  const container = useRef(null);
  const swapy = useRef(null);

  useEffect(() => {
    if (swapy.current?.destroy) {
      swapy.current.destroy();
    }

    if (container.current) {
      swapy.current = createSwapy(container.current);
      swapy.current.onSwap((event) => console.log("Swapped:", event));
    }
  }, [rows]);

  // Tambah baris baru
  const addRow = () => {
    const newRow = {
      id: Date.now(),
      name: "Row",
      components: [],
    };
    setRows([...rows, newRow]);
    setSelectedRow(newRow.id);
  };

  // Tambah komponen ke dalam row
  const addComponent = (type) => {
    if (!selectedRow) return;
    if (selectedGrid === null) {
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
                    value: type === "rating" || type === "menu" ? 0 : "",
                    children: type === "grid" ? [] : "disabled",
                  },
                ],
              }
            : row
        )
      );
    } else if (selectedGrid) {
      addComponentToGrid(type);
    }
  };

  // Tambah komponen ke dalam Grid yang dipilih
  const addComponentToGrid = (type) => {
    if (!selectedGrid) return;

    if (type === "rating") {
      setRows((prevRows) =>
        prevRows.map((row) => ({
          ...row,
          components: row.components.map((comp) =>
            comp.id === selectedGrid
              ? {
                  ...comp,
                  children: [
                    ...comp.children,
                    { id: Date.now(), type, value: 0 },
                  ],
                }
              : comp
          ),
        }))
      );
    } else if (type === "menu") {
      setRows((prevRows) =>
        prevRows.map((row) => ({
          ...row,
          components: row.components.map((comp) =>
            comp.id === selectedGrid
              ? {
                  ...comp,
                  children: [...comp.children, { id: Date.now(), type }],
                }
              : comp
          ),
        }))
      );
    }
  };

  // Ubah nilai rating di dalam state rows
  const handleChange = (rowId, compId, newValue) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              components: row.components.map((comp) =>
                comp.id === compId ? { ...comp, value: newValue } : comp
              ),
            }
          : row
      )
    );
  };

  console.log(rows);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar Kiri */}
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
            disabled={!selectedRow && !selectedGrid}
            onClick={() => addComponent("rating")}

            // onClick={() => addComponentToGrid("rating")}
          >
            Tambah Rating
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            disabled={!selectedRow && !selectedGrid}
            onClick={() => addComponent("menu")}

            // onClick={() => addComponentToGrid("rating")}
          >
            Tambah Menu
          </Button>
        </Box>
      </Drawer>

      {/* Area Layout */}
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
              setSelectedGrid(null); // Unselect Grid saat pilih Row
            }}
          >
            {row.components.map((comp) => (
              <React.Fragment key={comp.id}>
                {/* Component yang ada di dalam Grid */}
                {comp.type === "grid" && (
                  <Components.Layout.LayoutGrid
                    style={{
                      border: `1px solid ${
                        selectedGrid === comp.id ? "blue" : "gray"
                      }`,
                      padding: 2,
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Hindari mengganti selectedRow saat pilih Grid
                      setSelectedGrid(comp.id);
                    }}
                  >
                    {comp.children.map((child) => (
                      <React.Fragment key={child.id}>
                        {child.type === "rating" ? (
                          <>
                            <Components.Input.InputField
                              id={`rating-${child.id}`}
                              name={`rating-${child.id}`}
                              label="Rating"
                              value={child.value}
                              type="number"
                              onChange={(e) =>
                                handleChange(row.id, child.id, e.target.value)
                              }
                            />
                            <Components.Ratings value={child.value} />
                          </>
                        ) : (
                          child.type === "menu" && (
                            <Components.Menu.Navbar></Components.Menu.Navbar>
                          )
                        )}
                      </React.Fragment>
                    ))}
                  </Components.Layout.LayoutGrid>
                )}

                {/* Component yang bukan di dalam Grid */}
                {comp.type === "rating" && comp.children === "disabled" && (
                  <>
                    <Components.Input.InputField
                      id={`rating-${comp.id}`}
                      name={`rating-${comp.id}`}
                      label="Rating"
                      value={comp.value}
                      type="number"
                      onChange={(e) =>
                        handleChange(row.id, comp.id, e.target.value)
                      }
                    />
                    <Components.Ratings value={comp.value} />
                  </>
                )}

                {/* Component yang bukan di dalam Grid */}
                {comp.type === "menu" && comp.children === "disabled" && (
                  <div style={{ paddingBottom: "10px" }}>
                    <Components.Menu.Navbar></Components.Menu.Navbar>
                  </div>
                )}
              </React.Fragment>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SwapyWithSideBarv3;
