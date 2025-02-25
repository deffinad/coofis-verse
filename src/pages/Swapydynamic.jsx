import { createSwapy } from "swapy";
import { useEffect, useRef, useState } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import Header from "./header";

const DraggableItem = ({ text, onDelete }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h6">{text}</Typography>
      <Button variant="contained" color="error" size="small" onClick={onDelete}>
        Hapus
      </Button>
    </Paper>
  );
};

const Swapyswapy = () => {
  const swapy = useRef(null);
  const container = useRef(null);
  const [rows, setRows] = useState([[{ id: "1", component: <Header /> }]]);
  var rowindex = 0;

  const initializeSwapy = () => {
    if (swapy.current) {
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

  const addRow = () => {
    rowindex += 1;
    setRows((prevRows) => {
      const newId = Date.now().toString();
      const newChar = String.fromCharCode(65 + prevRows.length)
      const newRow = [
        {
          id: newId,
          component: (
            <DraggableItem
              text={newChar}
              onDelete={() => removeColumn(rowindex,0)}
            />
          ),
        },
      ];

      return [...prevRows, newRow];
    });
  };

  const addColumn = (rowIndex) => {
    setRows((prevRows) => {
      return prevRows.map((row, index) => {
        if (index === rowIndex) {
          const newId = Date.now().toString();
          const newChar = String.fromCharCode(65 + row.length);
          return [
            ...row,
            {
              id: newId,
              component: (
                <DraggableItem
                  text={newChar}
                  onDelete={() => removeColumn(index, row.length)}
                />
              ),
            },
          ];
        }
        return row;
      });
    });
  };

  const removeColumn = (rowIndex, colIndex) => {
    console.log("pukiis",rowIndex, colIndex)
    setRows((prevRows) => {
      return prevRows
        .map((row, index) => {
          if (index === rowIndex) {
            return row.filter((_, i) => i !== colIndex);
          }
          return row;
        })
        .filter((row) => row.length > 0);
    });
  };

  console.log(rows)

  return (
    <Box>
      <Button variant="contained" sx={{ mb: 2 }} onClick={addRow}>
        Tambah Row
      </Button>

      <Box ref={container} p={2} sx={{ border: "1px solid black" }}>
        {rows.map((row, rowIndex) => (
          <Box key={rowIndex} display="flex" gap={2} mb={2}>
            {row.map((item, itemIndex) => (
              <Box
                key={item.id}
                data-swapy-slot={`${rowIndex}-${itemIndex}`}
                sx={{ flex: 1, minWidth: "100px" }}
              >
                <Box data-swapy-item={`${rowIndex}-${itemIndex}`}>
                  {item.component}
                </Box>
              </Box>
            ))}
            <Button variant="outlined" onClick={() => addColumn(rowIndex)}>
              Tambah Col
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Swapyswapy;
