// FileName: src/pages/Hasil.jsx
import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { Components } from "remoteApp/Components"; // Ambil dari Module Federation

const Hasil = () => {
  const [pages, setPages] = useState([]);
  const [curentPage, setCurentPage] = useState("");

  useEffect(() => {
    const fetchData = () => {
      const savedPages = localStorage.getItem("savedPages");
      const currentPage = localStorage.getItem("curentPages"); // Ini adalah ID halaman, bukan objek halaman
      if (savedPages) {
        setPages(JSON.parse(savedPages));
      }
      if (currentPage) {
        setCurentPage(JSON.parse(currentPage)); // Pastikan di-parse jika disimpan sebagai string JSON
      }
    };

    fetchData();
    // Tidak perlu window.addEventListener("storage", fetchData) di sini
    // karena Preview.jsx akan memuat ulang iframe saat dibuka,
    // dan Hasil.jsx akan dimuat ulang di dalam iframe.
  }, []);

  const renderComponents = (components) =>
    components.map((comp) => {
      // console.log(components); // Hapus console.log di produksi
      return (
        <Grid
          item
          xs={comp.properties?.size || 12} // Gunakan comp.properties?.size
          key={comp.id}
        >
          <Box
            key={comp.id}
            id={comp.id}
            sx={{
              minHeight: comp.properties?.height || "auto", // Gunakan comp.properties?.height
              display: "flex", // Untuk centering komponen di dalam grid
              justifyContent: "center",
              alignItems: "center",
              border: "1px dashed transparent", // Pastikan tidak ada border editing
            }}
          >
            {comp.children && comp.children.length > 0
              ? comp.children.map((child) => {
                  // Pastikan child.name digunakan untuk mencari komponen
                  const ComponentToRender = Components?.[child.name];
                  if (ComponentToRender) {
                    return React.createElement(ComponentToRender, {
                      key: child.id,
                      ...child.properties, // Spread properties sebagai props
                    });
                  }
                  return (
                    <Typography color="error">
                      Component not found: {child.name}
                    </Typography>
                  );
                })
              : // <p style={{ color: "gray" }}>Empty Grid</p> // Hapus ini untuk tampilan clean
                null}
          </Box>
        </Grid>
      );
    });

  const activePage = pages.find((page) => page.id === curentPage);

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      {" "}
      {/* Tambahkan padding agar tidak terlalu mepet */}
      {activePage ? (
        activePage.layouts.map((layout) => (
          <Box
            key={layout.id}
            sx={{
              minHeight: layout.properties?.height || "auto", // Gunakan layout.properties?.height
              mb: 2, // Margin bottom antar layout
            }}
          >
            <Grid container spacing={2}>
              {/* Pastikan renderComponents dipanggil dengan children dari layout */}
              {renderComponents(layout.children)}
            </Grid>
          </Box>
        ))
      ) : (
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ textAlign: "center", mt: 5 }}
        >
          No content to preview. Please select or create a page in the editor.
        </Typography>
      )}
    </Box>
  );
};

export default Hasil;
