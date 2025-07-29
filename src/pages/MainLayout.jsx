import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "../shared/components/Navbar"; // Sesuaikan path ke Navbar.jsx
import { COLOR, SPACING } from "@/shared/AppConst";

const MainLayout = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: COLOR.very_light_gray,
      }}
    >
      {/* Navbar akan selalu tampil */}
      <Navbar />

      {/* Area konten dinamis (Dashboard atau Layout akan muncul di sini) */}
      <Box component="main" sx={{  }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
