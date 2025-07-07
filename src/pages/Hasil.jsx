import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { Components } from "remoteApp/Components"; // Ambil dari Module Federation

const Hasil = () => {
  const [pages, setPages] = useState([]);
  const [curentPage, setCurentPage] = useState("");

  useEffect(() => {
    const fetchData = () => {
      const savedPages = localStorage.getItem("savedPages");
      const currentPage = JSON.parse(localStorage.getItem("curentPages") || '""');
      if (savedPages) {
        setPages(JSON.parse(savedPages));
      }
      if (currentPage) {
        setCurentPage(currentPage);
      }
    };

    fetchData();
    window.addEventListener("storage", fetchData);

    return () => {
      window.removeEventListener("storage", fetchData);
    };
  }, []);

  const renderComponents = (components) =>
    components.map((comp) => {
      console.log(components);
      return (
        <Grid
          item
          xs={comp.size}
          key={comp.id}
        >
          <Grid
            key={comp.id}
            id={comp.id}
            size={comp.size}
          >
            {comp.children && comp.children.length > 0 ? (
              comp.children.map((child) =>
                React.createElement(Components?.[child.type], {
                  key: child.id,
                  ...child
                })
              )
            ) : (
              <p style={{ color: "gray" }}>Empty Grid</p>
            )}
          </Grid>
        </Grid>
      );
    });
  console.log(pages[0]?.id);
  console.log(curentPage);
  return (
    <Box sx={{ flexGrow: 1 }}>
      {curentPage && (
        <>
          {/* show layout */}
          {pages
            .find((page, pageidx) => page.id === curentPage)
            ?.layouts.map((layout, layoutidx) => (
              <Box
                key={layout.id}
                sx={{
                  minHeight: "100px",
                }}
              >
                <Grid container spacing={2}>
                  {renderComponents(layout.children, layout.id, layoutidx)}
                </Grid>
              </Box>
            ))}
        </>
      )}
    </Box>
  );
};

export default Hasil;
