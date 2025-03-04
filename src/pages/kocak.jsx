import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { createSwapy } from "swapy";

const KocakLayout = () => {
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedGrid, setSelectedGrid] = useState(null);
  const swapy = useRef(null);
  const container = useRef(null);

  const initializeSwapy = () => {
    if (swapy.current?.destroy) {
      swapy.current.destroy();
    }

    if (container.current) {
      swapy.current = createSwapy(container.current);
      swapy.current.onSwap((event) => {
        console.log("Swapped:", event);
      });
    }
  };

  useEffect(() => {
    initializeSwapy();
  }, [rows]);

  const addRow = () => {
    const newRow = {
      idDroppable: Date.now(),
      name: "Row",
      components: [],
    };
    setRows([...rows, newRow]);
  };

  const addGridDalemRow = () => {
    if (selectedRow === null) return;
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.idDroppable === selectedRow
          ? {
              ...row,
              components: [
                ...row.components,
                {
                  idDroppable: Date.now(),
                  name: "Grid",
                  column: 12,
                  components: [],
                },
              ],
            }
          : row
      )
    );
  };

  const addRatingsDalemGrid = () => {
    if (selectedRow === null || selectedGrid === null) return;
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.idDroppable === selectedRow
          ? {
              ...row,
              components: row.components.map((grid) =>
                grid.idDroppable === selectedGrid
                  ? {
                      ...grid,
                      components: [
                        ...(grid.components || []),
                        {
                          idDroppable: Date.now(),
                          name: "Ratings",
                          column: 12,
                          props: { value: 0 },
                        },
                      ],
                    }
                  : grid
              ),
            }
          : row
      )
    );
  };

  return (
    <Box>
      <Button variant="contained" onClick={addRow}>Tambah Layout</Button>
      <Button
        variant="outlined"
        sx={{ ml: 2 }}
        disabled={selectedRow === null}
        onClick={addGridDalemRow}
      >
        Tambah grid dalam layout
      </Button>
      <Button
        variant="outlined"
        sx={{ ml: 2 }}
        disabled={selectedRow === null || selectedGrid === null}
        onClick={addRatingsDalemGrid}
      >
        Tambah rating dalam grid
      </Button>

      <Box ref={container} sx={{ mt: 2 }}>
        {rows.map((row, rowIndex) => (
          <Box
            key={row.idDroppable}
            sx={{
              border: `2px solid ${selectedRow === row.idDroppable ? "green" : "red"}`,
              padding: 2,
              marginTop: 2,
            }}
            onClick={() => {
              setSelectedRow(row.idDroppable);
              setSelectedGrid(null); // Reset selected grid when switching row
            }}
          >
            {row.components.map((grid, gridIndex) => (
              <Box
                key={grid.idDroppable}
                sx={{
                  border: `2px solid ${selectedGrid === grid.idDroppable ? "blue" : "orange"}`,
                  padding: 2,
                  marginTop: 2,
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent selecting row when clicking grid
                  setSelectedGrid(grid.idDroppable);
                }}
                // data-swapy-slot={`${rowIndex}-${gridIndex}`} // Tambahkan slot agar bisa swap dalam grid
              >
                {grid.components.map((comp, compIndex) => (
                  <Grid
                    size={{ xs: 4, sm: 8, md: comp.column }}
                    key={comp.idDroppable}
                    item
                    xs={12}
                    sx={{
                      border: "1px solid blue",
                      p: 1,
                      borderRadius: "5px",
                      cursor: "grab", // Tambahkan cursor agar lebih jelas bisa diswap
                      backgroundColor: "#f0f0f0",
                    }}
                    // data-swapy-item={`${rowIndex}-${gridIndex}-${compIndex}`} // Pastikan setiap item unik
                  >
                    {comp.name === "Ratings" && (
                      <Typography variant="h6">
                        ⭐ Rating Component
                      </Typography>
                    )}
                  </Grid>
                ))}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default KocakLayout;
