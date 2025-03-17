import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Drawer, Typography } from "@mui/material";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

const LayoutCard = ({ layout, onClick }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: layout.id });
  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{
        border: "1px solid gray",
        borderRadius: "10px",
        padding: 1,
        marginBottom: 1,
        cursor: "grab",
        backgroundColor: "white",
      }}
      onClick={onClick}
    >
      {layout.name}
    </Box>
  );
};

const DroppablePage = ({ layouts, setLayouts }) => {
  const { setNodeRef } = useDroppable({ id: "droppable-page" });

  return (
    <Box
      ref={setNodeRef}
      sx={{ padding: 2, minHeight: "300px", border: "1px dashed gray" }}
    >
      {layouts.map((layout) => (
        <LayoutCard key={layout.id} layout={layout} />
      ))}
    </Box>
  );
};

const LayoutManager = () => {
  const [pages, setPages] = useState([]);
  const [layouts, setLayouts] = useState([]);

  const handleDragEnd = (event) => {
    if (event.over?.id === "droppable-page") {
      setLayouts((prev) => [
        ...prev,
        { id: `layout-${prev.length + 1}`, name: "New Layout" },
      ]);
    }
  };

  // Struktur default jika localStorage kosong
  const defaultPages = [
    {
      id: "pages1",
      name: "Page 1",
      layouts: [
        {
          id: "layouts11",
          name: "Layout",
          children: [],
        },
      ],
    },
  ];

  // Ambil data dari localStorage saat pertama kali render
  useEffect(() => {
    const savedPages = localStorage.getItem("savedPages");
    const savedCurrentPage = localStorage.getItem("currentPage");

    if (savedPages) {
      try {
        setPages(JSON.parse(savedPages));
      } catch (error) {
        console.error("Error parsing savedPages from localStorage:", error);
        setPages(defaultPages); // Jika parsing gagal, pakai defaultPages
      }
    } else {
      setPages(defaultPages); // Jika localStorage kosong, pakai defaultPages
    }

    if (savedCurrentPage) {
      try {
        setCurrentPage(JSON.parse(savedCurrentPage));
      } catch (error) {
        console.error("Error parsing currentPage from localStorage:", error);
        setCurrentPage(null);
      }
    }
  }, []);

  console.log(layouts)

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Box sx={{ display: "flex" }}>
        {/* Drawer Kiri */}
        <Drawer variant="permanent" anchor="left" sx={{ width: 240 }}>
          <Box sx={{ width: 240, p: 2 }}>
            <Typography variant="h6">Layouts</Typography>
            <LayoutCard layout={{ id: "draggable-layout", name: "Drag Me" }} />
          </Box>
        </Drawer>
        {/* Halaman Utama */}
        <Box sx={{ flexGrow: 1, p: 5 }}>
          <DroppablePage layouts={layouts} setLayouts={setLayouts} />
        </Box>
      </Box>
    </DndContext>
  );
};

export default LayoutManager;
