import React from "react";
import { Box, Grid } from "@mui/material";
import { Components } from "remoteApp/Components"; // Ambil dari Module Federation

const Hasil = () => {
  const jsonData = JSON.parse(localStorage.getItem("savedPages")) || [];
  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      {jsonData.map((page) =>
        page.layouts.map((layout) => (
          <Grid key={layout.id} container spacing={2}>
            {layout.children.map((child) => (
              <Grid key={child.id} item xs={child.size || 12}>
                {child.children.map((item) =>
                  React.createElement(Components?.[item.type], {
                    key: item.id,
                  })
                )}
              </Grid>
            ))}
          </Grid>
        ))
      )}
    </Box>
  );
};

export default Hasil;
