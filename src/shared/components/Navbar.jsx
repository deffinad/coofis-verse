import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Home as HomeIcon,
  ViewQuilt as LayoutIcon,
  HelpOutline as DefaultIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { COLOR, SPACING } from "@/shared/AppConst";
import { routesConfig } from "../../pages/RoutesConfig";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { logoData } from "@/shared/AppData";

// Pemetaan string ikon dari config ke komponen Ikon MUI
const iconComponents = {
  Dashboard: <HomeIcon />,
  Layout: <LayoutIcon />,
};

const Navbar = () => {
  const location = useLocation();

  // State untuk mengontrol menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Fungsi untuk membuka menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Fungsi untuk menutup menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Fungsi spesifik untuk logout
  const handleLogout = () => {
    // Tambahkan logika logout Anda di sini
    console.log("User logged out");
    handleClose();
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: COLOR.very_light_gray }}>
      {/* Top section: Logo dan User Info */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          borderBottom: "1px solid #ddd",
          backgroundColor: COLOR.white_smoke,
          p: 0.5,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={logoData.imageUrl}
              alt={logoData.altText}
              sx={{ width: 40, height: 40, mr: SPACING }}
            />
          </Box>
          <Box>
            {/* Box yang dapat diklik */}
            <Box
              onClick={handleClick}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                ml: SPACING,
                cursor: "pointer",
                p: 0.5,
                borderRadius: SPACING,
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
              }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar
                sx={{ bgcolor: COLOR.honolulu_blue, width: 40, height: 40 }}
              >
                A
              </Avatar>
              <Box sx={{ ml: 1, textAlign: "left" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: COLOR.dark_gray }}
                >
                  AULIA RIZA
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  PUSAT DATA DAN INFORMASI
                </Typography>
              </Box>
              <ExpandMoreIcon sx={{ color: COLOR.dark_gray }} />
            </Box>

            {/* Komponen Menu */}
            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              sx={{ mt: 1 }}
            >
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Bottom section */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          backgroundColor: COLOR.white_smoke,
          borderBottomLeftRadius: SPACING * 10,
          borderBottomRightRadius: SPACING * 10,
        }}
      >
        <Toolbar sx={{ minHeight: "56px" }}>
          {routesConfig.map((route) => {
            const isActive = location.pathname === route.url;
            return (
              <Box
                key={route.id}
                component={Link}
                to={route.url}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  width: 130,
                  height: 35,
                  mr: SPACING,
                  borderRadius: SPACING,
                  textTransform: "none",
                  color: isActive ? COLOR.light_gray : COLOR.medium_dark_gray,
                  backgroundColor: isActive ? COLOR.sky_blue : COLOR.white_ice,
                  textDecoration: "none",
                  cursor: "pointer",
                  "&:hover": {
                    color: isActive ? COLOR.light_gray : COLOR.medium_dark_gray,
                    backgroundColor: isActive
                      ? COLOR.sky_blue
                      : COLOR.white_ice,
                  },
                }}
              >
                {iconComponents[route.icon] || <DefaultIcon />}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "inherit",
                    color: "inherit",
                  }}
                >
                  {route.title}
                </Typography>
              </Box>
            );
          })}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
