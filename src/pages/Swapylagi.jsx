import { createSwapy } from "swapy";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  MenuItem,
  Select,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

const STORAGE_KEY = "swapy_rows";

const DraggableItem = ({ text, onDelete }) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Typography variant="h6">{text}</Typography>
      <Button variant="contained" color="error" size="small" onClick={onDelete}>
        Hapus
      </Button>
    </div>
  );
};

const Swapyswapy = () => {
  const swapy = useRef(null);
  const container = useRef(null);
  const [rows, setRows] = useState(() => {
    const savedRows = localStorage.getItem(STORAGE_KEY);
    return savedRows ? JSON.parse(savedRows) : [];
  });

  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedGrid, setSelectedGrid] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  }, [rows]);

  const initializeSwapy = () => {
    if (swapy.current?.destroy) {
      swapy.current.destroy();
    }

    if (container.current) {
      swapy.current = createSwapy(container.current);
      swapy.current.onSwap((event) => {
        console.log("swap", event);
      });
    }
  };

  useEffect(() => {
    initializeSwapy();
  }, [rows]);

  const addLayout = () => {
    const newRow = {
      idDroppable: Date.now(),
      column: 12,
      name: "Layout",
      components: null,
      props: null,
    };
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const addGridDalemLayout = () => {
    if (selectedRow === null) return;

    setRows((prevRows) =>
      prevRows.map((row) =>
        row.idDroppable === selectedRow
          ? {
              ...row,
              components: [
                ...(row.components || []),
                {
                  idDroppable: Date.now(),
                  column: 12,
                  name: "Grid",
                  components: null,
                  props: null,
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
              components: row.components
                ? row.components.map((grid) =>
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
                  )
                : row.components,
            }
          : row
      )
    );
  };
  
  const removeLayout = () => {
    if (selectedRow === null) return;

    setRows((prevRows) =>
      prevRows.filter((row) => row.idDroppable !== selectedRow)
    );
    setSelectedRow(null);
  };

  console.log(rows);

  return (
    <Box>
      <Button variant="contained" onClick={addLayout}>
        Tambah Layout
      </Button>

      <Button
        variant="outlined"
        sx={{ ml: 2 }}
        disabled={selectedRow === null}
        onClick={addGridDalemLayout}
      >
        Tambah grid dalem layout
      </Button>

      <Button
        variant="outlined"
        sx={{ ml: 2 }}
        disabled={selectedGrid === null}
        onClick={addRatingsDalemGrid}
      >
        Tambah rating dalem grid
      </Button>

      <Button
        variant="contained"
        color="error"
        sx={{ ml: 2 }}
        disabled={selectedRow === null}
        onClick={removeLayout}
      >
        Hapus Layout
      </Button>

      <Box
        ref={container}
        p={2}
        sx={{
          border: "",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          border: "1px solid black",
        }}
      >
        {rows.map((row, rowIndex) => (
          // box untuk layout
          <Box
            key={row.idDroppable}
            sx={{
              width: "100%",
              border:
                selectedRow === row.idDroppable
                  ? "2px dashed green"
                  : "2px dashed red",
              cursor: "pointer",
              minHeight: "100px",
              borderRadius: "5px",
            }}
            onClick={() => {
              setSelectedRow(row.idDroppable);
              setSelectedGrid(null);
            }}
          >
            <Box sx={{ flexGrow: 1, p: 2 }}>
              {(row.components || []).map((item, itemIndex) => (
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  key={item.idDroppable}
                  minHeight={"100px"}
                  sx={{
                    border:
                      selectedGrid === item.idDroppable
                        ? "2px dashed red"
                        : "2px dashed black",
                    p: 1,
                    cursor: "pointer",
                    borderRadius: "5px",
                    mb: 2,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGrid(item.idDroppable);
                  }}
                  data-swapy-slot={`${rowIndex}-${itemIndex}`}
                >
                  {(item.components || []).map((comp, compIndex) => (
                    <Grid
                      size={{ xs: 4, sm: 8, md: comp.column }}
                      key={comp.idDroppable}
                      item
                      xs={12}
                      sx={{
                        border: "1px solid blue",
                        p: 1,
                        borderRadius: "5px",
                      }}
                      data-swapy-item={`${rowIndex}-${itemIndex}`}
                    >
                      {comp.name === "Ratings" && (
                        <Typography variant="h6">
                          ⭐ Rating Component
                        </Typography>
                      )}
                    </Grid>
                  ))}
                </Grid>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Swapyswapy;
