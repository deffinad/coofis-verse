import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "../shared/components/Navbar";
import { COLOR } from "@/shared/AppConst";

const MainLayout = () => {
  return (
    // LEVEL 1: Main Container
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {/* LEVEL 2A: Navbar Container */}
      <Box
        component="header"
        sx={{
          height: "auto", // Height is determined by the content
          flexShrink: 0, // Prevents the navbar container from shrinking
        }}
      >
        <Navbar />
      </Box>

      {/* LEVEL 2B: Content Container */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: COLOR.very_light_gray,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
