import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Drawer,
  TextField,
  Slider,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { createSwapy } from "swapy";
import { Components } from "remoteApp/Components";

const SwapyWithSideBar = () => {
  const [rows, setRows] = useState([]);
  const [selectedComponentId, setSelectedComponentId] = useState(null);

  const [ratingValue, setRatingValue] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedGrid, setSelectedGrid] = useState(null);
  const [selectedNestedGrid, setSelectedNestedGrid] = useState(null);
  const [gridSettings, setGridSettings] = useState({
    column: 12,
    backgroundColor: "#ffffff",
  });
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
      components: null,
    };
    setRows([...rows, newRow]);
    setSelectedComponentId(newRow.idDroppable);

    setSelectedRow(newRow.idDroppable);
    setSelectedGrid(null);
  };

  const addComponent = (rowId) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.idDroppable === rowId
          ? {
              ...row,
              components: [
                ...(row.components || []),
                <Components.Layout.LayoutGrid key={Date.now()} />,
              ],
            }
          : row
      )
    );
  };

  // const addComponent = (type) => {
  //   console.log(type)

  // if (type === "grid" && selectedRow !== null) {
  //   if (selectedGrid !== null) {
  // setRows((prevRows) =>
  //   prevRows.map((row) => ({
  //     ...row,
  //     components: row.components.map((comp) =>
  //       comp.idDroppable === selectedGrid
  //         ? {
  //             ...comp,
  //             components: [
  //               ...comp.components,
  //               {
  //                 idDroppable: Date.now(),
  //                 name: "Grid",
  //                 column: gridSettings.column,
  //                 backgroundColor: gridSettings.backgroundColor,
  //                 components: [],
  //               },
  //             ],
  //           }
  //         : comp
  //     ),
  //   }))
  // );
  //   } else if (selectedRow !== null) {
  //     // Tambah Grid ke dalam Layout
  //     setRows((prevRows) =>
  //       prevRows.map((row) =>
  //         row.idDroppable === selectedRow
  //           ? {
  //               ...row,
  //               components: [
  //                 ...row.components,
  //                 {
  //                   idDroppable: Date.now(),
  //                   name: "Grid",
  //                   column: gridSettings.column,
  //                   backgroundColor: gridSettings.backgroundColor,
  //                   components: [],
  //                 },
  //               ],
  //             }
  //           : row
  //       )
  //     );
  //   }
  // } else if (type === "rating") {
  //   if (selectedGrid !== null) {
  //     setRows((prevRows) =>
  //       prevRows.map((row) => ({
  //         ...row,
  //         components: row.components.map((comp) =>
  //           comp.idDroppable === selectedGrid
  //             ? {
  //                 ...comp,
  //                 components: [
  //                   ...comp.components,
  //                   {
  //                     idDroppable: Date.now(),
  //                     name: "Ratings",
  //                     column: 12,
  //                     props: { value: 0 },
  //                   },
  //                 ],
  //               }
  //             : comp
  //         ),
  //       }))
  //     );
  //   } else if (selectedRow !== null) {
  //     setRows((prevRows) =>
  //       prevRows.map((row) =>
  //         row.idDroppable === selectedRow
  //           ? {
  //               ...row,
  //               components: [
  //                 ...row.components,
  //                 {
  //                   idDroppable: Date.now(),
  //                   name: "Ratings",
  //                   column: 12,
  //                   props: { value: 0 },
  //                 },
  //               ],
  //             }
  //           : row
  //       )
  //     );
  //     setSelectedGrid(null);
  //   }
  // }
  // };

  console.log(rows);
  console.log(selectedRow)
  return (
    <Box sx={{ display: "flex" }}>
      {/* Left Sidebar */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{ width: 240, flexShrink: 0 }}
      >
        <Box sx={{ width: 240, p: 2 }}>
          <Button variant="contained" fullWidth onClick={addRow}>
            Tambah Layout
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            disabled={selectedRow === null}
            onClick={() => addComponent(selectedRow)}
          >
            Tambah Grid
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            disabled={selectedRow === null && selectedGrid === null}
            onClick={() => addComponent("rating")}
          >
            Tambah Rating
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box ref={container} sx={{ flexGrow: 1, p: 5, mt: 2 }}>
        {rows.map((row) => (
          <Box
            key={row.idDroppable}
            sx={{
              border: `2px solid ${
                selectedRow === row.idDroppable ? "green" : "red"
              }`,
              padding: 2,
              marginTop: 2,
            }}
            onClick={() => {
              setSelectedRow(row.idDroppable);
              setSelectedGrid(null);
              setSelectedNestedGrid(null);
            }}
          >
            {/* Render Components in Each Row */}
            {row.components &&
              row.components.map((Component, index) => (
                <React.Fragment key={index}>{Component}</React.Fragment>
              ))}
          </Box>
        ))}
      </Box>

      {/* <Box ref={container} sx={{ flexGrow: 1, p: 5, mt: 2 }}> */}
      {/* {rows.map((row) => (
          <Box
            key={row.idDroppable}
            sx={{
              border: `2px solid ${
                selectedRow === row.idDroppable ? "green" : "red"
              }`,
              padding: 2,
              marginTop: 2,
            }}
            onClick={() => {
              setSelectedRow(row.idDroppable);
              setSelectedGrid(null);
              setSelectedNestedGrid(null);
            }}
          >
          </Box>
        ))} */}
      {/* {row.components.map((comp) => (
          <Box
            key={comp.idDroppable}
            sx={{
              border: `2px solid ${
                selectedGrid === comp.idDroppable ? "blue" : "gray"
              }`,
              padding: 2,
              marginTop: 2,
              backgroundColor: comp.backgroundColor || "#f0f0f0",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (comp.name === "Grid") {
                setSelectedGrid(comp.idDroppable);
              }
              }}
          >
            {comp.name === "Ratings" ? (
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
              <></>
            )}

            {comp.name === "Grid" &&
              comp.components.map((subComp) => (
                <>
                  <Box
                    key={comp.idDroppable}
                    sx={{
                      border: `2px solid ${
                        selectedNestedGrid === subComp.idDroppable ? "red" : "gray"
                      }`,
                      padding: 2,
                      marginTop: 2,
                      backgroundColor: subComp.backgroundColor || "#f0f0f0",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (subComp.name === "Grid") {
                        setSelectedNestedGrid(subComp.idDroppable);
                      }
                    }}
                  >
                    {subComp.name === "Ratings" ? (
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
                      <></>
                    )}
                  </Box>
                </>
              ))}
          </Box>
        ))} */}
      {/* <Components.Layout.LayoutGrid>
          
        </Components.Layout.LayoutGrid> */}
      {/* </Box> */}

      {/* Right Sidebar */}
      <Drawer
        variant="permanent"
        anchor="right"
        sx={{ width: 240, flexShrink: 0 }}
      >
        <Box sx={{ width: 240, p: 2 }}>
          <Typography variant="h6">Pengaturan Grid {selectedRow}</Typography>
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

export default SwapyWithSideBar;
