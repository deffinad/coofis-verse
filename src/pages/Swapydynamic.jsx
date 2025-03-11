import { createSwapy } from "swapy";
import { useEffect, useRef, useState } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";

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

  // Tambah Row (kosong)
  const addRow = () => {
    setRows((prevRows) => [...prevRows, []]);
  };

  // Tambah Kolom di dalam Row
  const addColumn = (rowIndex) => {
    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index === rowIndex
          ? [
              ...row,
              {
                id: Date.now().toString(),
                component: `Component-${row.length + 1}`,
                width: 12,
              },
            ]
          : row
      )
    );
  };

  // Hapus Kolom
  const removeColumn = (rowIndex, colIndex) => {
    setRows((prevRows) =>
      prevRows
        .map((row, index) =>
          index === rowIndex ? row.filter((_, i) => i !== colIndex) : row
        )
        .filter((row) => row.length > 0)
    );
  };

  return (
    <Box>
      <Button variant="contained" sx={{ mb: 2 }} onClick={addRow}>
        Tambah Layout (Row)
      </Button>

      <Box
        ref={container}
        p={2}
        sx={{ border: "", display: "flex", flexDirection: "column", gap: 2 }}
      >
        {rows.map((row, rowIndex) => (
          // <Box
          //   key={rowIndex}
          //   sx={{ width: "100%", border: "1px solid black" }}
          //   // data-swapy-slot={`${rowIndex}`} // Pastikan slot ada di level paling luar
          // >
          //   {row.map((item, itemIndex) => (
          //     <Box
          //       key={item.id}
          //       // data-swapy-item={`${rowIndex}-${itemIndex}`} // Item langsung ada dalam slot
          //       sx={{
          //         flex: item.width / 12,
          //         minWidth: "100px",
          //         border: "10px dashed red",
          //         p: 1,
          //       }}
          //     >
          //       <DraggableItem
          //         text={item.component}
          //         onDelete={() => removeColumn(rowIndex, itemIndex)}
          //       />
          //     </Box>
          //   ))}
          // </Box>

          <Box data-swapy-slot={`${rowIndex}`} key={rowIndex} sx={{ width: "100%", border: "1px solid black" }}>
            <Box sx={{ p:2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Layout {rowIndex + 1}
              </Typography>
              {row.length === 0 ? (
                <Typography
                  variant="body2"
                  sx={{ fontStyle: "italic", color: "gray" }}
                >
                  (Kosong - Tambahkan Kolom)
                </Typography>
              ) : (
                <Box display="flex" gap={2}>
                  {row.map((item, itemIndex) => (
                    <Box
                      key={item.id}
                      data-swapy-item={`${rowIndex}-${itemIndex}`}
                      sx={{
                        flex: item.width / 12,
                        minWidth: "100px",
                        border: "10px dashed red",
                        p: 1,
                      }}
                    >
                      <Box>
                        <DraggableItem
                          text={item.component}
                          onDelete={() => removeColumn(rowIndex, itemIndex)}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
              <Button
                variant="outlined"
                sx={{ mt: 1 }}
                onClick={() => addColumn(rowIndex)}
              >
                Tambah komponen
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Swapyswapy;
