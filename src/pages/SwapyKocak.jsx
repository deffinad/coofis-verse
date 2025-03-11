import { useEffect, useRef, useState } from "react";
import { createSwapy } from "swapy";
import { Box, Typography, Button } from "@mui/material";

export default function DynamicSwapy() {
  const [rows, setRows] = useState(() => {
    const savedRows = localStorage.getItem("savedRows");
    console.log(JSON.parse(savedRows));
    return savedRows
      ? JSON.parse(savedRows)
      : [
          {
            idDroppable: "layout-1",
            components: [
              { idDroppable: "comp-1", column: 6, text: "kocak1" },
              { idDroppable: "comp-2", column: 6, text: "kocak2" },
              { idDroppable: "comp-3", column: 6, text: "kocak3" },
              { idDroppable: "comp-4", column: 6, text: "kocak4" },
              { idDroppable: "comp-5", column: 6, text: "kocak5" },
            ],
          },
          {
            idDroppable: "layout-2",
            components: [
              { idDroppable: "comp-6", column: 6, text: "kocak6" },
              { idDroppable: "comp-7", column: 6, text: "kocak7" },
            ],
          },
        ];
  });

  const [temp, setTemp] = useState();

  const [selectedRow, setSelectedRow] = useState(null);
  const containerRefs = useRef({});

  const [selectedRowIndex, SetSelectedRowIndex] = useState();

  // Load order dari localStorage saat pertama kali
  useEffect(() => {
    const savedOrder = localStorage.getItem("swapyOrder");
    if (savedOrder) {
      const parsedOrder = JSON.parse(savedOrder);
      setRows(parsedOrder);
    }
  }, []);

  useEffect(() => {
    rows.forEach((row) => {
      console.log(row)
      if (!containerRefs.current[row.idDroppable]) return;
      if (containerRefs.current[row.idDroppable].swapy?.destroy) {
        containerRefs.current[row.idDroppable].swapy.destroy();
      }

      // Inisialisasi Swapy
      containerRefs.current[row.idDroppable].swapy = createSwapy(
        containerRefs.current[row.idDroppable]
      );

      containerRefs.current[row.idDroppable].swapy.onSwap((event) => {
        console.log(`Swapped in ${row.idDroppable}:`, event);
        setTemp(event);
      });
    });

    return () => {
      rows.forEach((row) => {
        if (containerRefs.current[row.idDroppable]?.swapy?.destroy) {
          containerRefs.current[row.idDroppable].swapy.destroy();
        }
      });
    };
  }, [rows]);

  const saveOrder = (rowIndex) => {
    console.log("awikawok",rows)
    if (!rows[rowIndex]) return;

    const textMap = Object.fromEntries(
      rows[rowIndex].components.map((component) => [
        component.idDroppable,
        component.text,
      ])
    );

    console.log(textMap);

    rows[rowIndex].components = temp?.newSlotItemMap?.asArray.map(
      (slotItem) => {
        const matchedComponent = rows[rowIndex].components.find(
          (component) => component.idDroppable === slotItem.slot
        );

        return {
          ...matchedComponent,
          idDroppable: slotItem.item,
          text: textMap[slotItem.item],
        };
      }
    );

    localStorage.setItem("savedRows", JSON.stringify(rows));
    window.location.reload()
    alert(`Order saved for row ${rowIndex}!`);
  };

  // rows[0].components = rows[0].components.map((component) => {
  //   // Cari item yang sesuai berdasarkan slot
  //   const matchedItem = temp?.newSlotItemMap?.asArray.find(
  //     (slotItem) => slotItem.slot === component.idDroppable
  //   );

  //   return {
  //     ...component,
  //     idDroppable: matchedItem ? matchedItem.item : component.idDroppable, // Ganti jika ditemukan, jika tidak tetap
  //   };
  // });


  console.log(rows);

  return (
    <>
      <Box sx={{ p: 2 }}>
        {rows.map((row, rowIndex) => (
          <Box
            ref={(el) => (containerRefs.current[row.idDroppable] = el)}
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
              SetSelectedRowIndex(rowIndex);
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Layout {row.idDroppable}
              </Typography>
              <Box
                sx={{
                  border: "10px solid black",
                  padding: "10px",
                  minHeight: "100px",
                }}
              >
                <Box display="flex" gap={2}>
                  {(row.components || []).map((item, itemIndex) => (
                    <Box
                      key={item.idDroppable}
                      data-swapy-slot={`${item.idDroppable}`}
                      sx={{ flex: item.column / 12, minWidth: "100px" }}
                    >
                      <Box
                        data-swapy-item={`${item.idDroppable}`}
                        sx={{ border: "1px dashed black", p: 2 }}
                      >
                        Komponen {item.text}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => saveOrder(selectedRowIndex)}
        sx={{ mt: 2 }}
      >
        Save Order
      </Button>
    </>
  );
}
