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

const Swapylagi = () => {
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
          <Box key={rowIndex} sx={{ width: "100%", border: "1px dashed black" }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Layout {rowIndex + 1}
              </Typography>
              {row.length === 0 ? (
                <Typography
                  variant="body2"
                  sx={{ fontStyle: "italic", color: "gray" }}
                >
                  (Kosong - Tambahkan Komponen)
                </Typography>
              ) : (
                <Box display="flex" gap={2}>
                  {row.map((item, itemIndex) => (
                    <Box
                      key={item.id}
                      data-swapy-slot={`${rowIndex}-${itemIndex}`}
                      sx={{
                        flex: item.width / 12,
                        minWidth: "100px",
                        border: "1px dashed black",
                        p: 1,
                      }}
                    >
                      <Box data-swapy-item={`${rowIndex}-${itemIndex}`}>
                        <DraggableItem
                          text={item.component}
                          onDelete={() => removeColumn(rowIndex, itemIndex)}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Swapylagi;
