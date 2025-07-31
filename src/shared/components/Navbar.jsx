import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import {
  Home as HomeIcon,
  ViewQuilt as LayoutIcon,
  HelpOutline as DefaultIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { COLOR, SPACING } from "@/shared/AppConst";
import { routesConfig as baseRoutes } from "../../pages/RoutesConfig"; // Rename import
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { logoData } from "@/shared/AppData";

const iconComponents = {
  Dashboard: <HomeIcon />,
  Layout: <LayoutIcon />,
};

const Navbar = () => {
  const location = useLocation();
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [dynamicRoutes, setDynamicRoutes] = useState(baseRoutes);

  // State for hover menu management
  const [hoverMenu, setHoverMenu] = useState({
    anchorEl: null,
    openId: null,
  });
  const hideMenuTimer = useRef(null);

  const isUserMenuOpen = Boolean(userMenuAnchorEl);

  const handleUserMenuClick = (event) =>
    setUserMenuAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchorEl(null);

  // Handlers for hover menu
  const handleMenuMouseEnter = (event, menuId) => {
    clearTimeout(hideMenuTimer.current);
    setHoverMenu({
      anchorEl: event.currentTarget,
      openId: menuId,
    });
  };

  const handleMenuMouseLeave = () => {
    setHoverMenu({ anchorEl: null, openId: null });
  };

  const handleMenuItemClick = () => {
    setHoverMenu({ anchorEl: null, openId: null });
  };

  const handleLogout = () => {
    console.log("User logged out");
    handleUserMenuClose();
  };

  const loadPublishedRoutes = () => {
    const publishedPages = JSON.parse(
      localStorage.getItem("publishedPages") || "[]"
    );
    const publishedRoutes = publishedPages.map((page) => ({
      id: `published-${page.id}`,
      title: page.name,
      messageId: page.name,
      type: "item",
      url: `/dashboard/${page.id}`,
    }));

    const newRoutes = baseRoutes.map((route) => {
      if (route.id === "dashboard" && route.type === "group") {
        const staticChildren = route.children || [];
        return { ...route, children: [...staticChildren, ...publishedRoutes] };
      }
      return route;
    });

    setDynamicRoutes(newRoutes);
  };

  useEffect(() => {
    loadPublishedRoutes();
    window.addEventListener("storage", loadPublishedRoutes);
    return () => {
      window.removeEventListener("storage", loadPublishedRoutes);
    };
  }, []);

  const renderNavs = () => {
    return dynamicRoutes.map((route) => {
      const isActive =
        (location.pathname.startsWith(route.url) && route.url !== "/") ||
        (route.type === "group" && hoverMenu.openId === route.id);

      if (route.type === "group") {
        const isMenuOpen = hoverMenu.openId === route.id;
        return (
          <Box
            key={route.id}
            onMouseEnter={(e) => handleMenuMouseEnter(e, route.id)}
            onMouseLeave={handleMenuMouseLeave}
            sx={{ mr: SPACING }}
          >
            <Box
              aria-owns={isMenuOpen ? `menu-${route.id}` : undefined}
              aria-haspopup="true"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                width: 130,
                p: 1,
                height: 20,
                borderRadius: SPACING,
                textTransform: "none",
                cursor: "pointer",
                color: COLOR.medium_dark_gray
              }}
            >
              {iconComponents[route.icon] || <DefaultIcon />}
              <Typography
                variant="body2"
                sx={{ fontWeight: "inherit", color: "inherit" }}
              >
                {route.title}
              </Typography>
            </Box>
            <Menu
              id={`menu-${route.id}`}
              anchorEl={hoverMenu.anchorEl}
              open={isMenuOpen}
              onClose={handleMenuMouseLeave}
              MenuListProps={{
                "aria-labelledby": `button-${route.id}`,
                onMouseLeave: handleMenuMouseLeave,
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              {route.children.map((child) => (
                <MenuItem
                  key={child.id}
                  component={Link}
                  to={child.url}
                  onClick={handleMenuItemClick}
                  selected={location.pathname === child.url}
                >
                  {child.title}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        );
      }

      // Default rendering for non-group items
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
            backgroundColor: isActive ? COLOR.sky_blue : COLOR.white_smoke,
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          {iconComponents[route.icon] || <DefaultIcon />}
          <Typography
            variant="body2"
            sx={{ fontWeight: "inherit", color: "inherit" }}
          >
            {route.title}
          </Typography>
        </Box>
      );
    });
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: COLOR.very_light_gray }}>
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
            <Box
              onClick={handleUserMenuClick}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                ml: SPACING,
                cursor: "pointer",
                p: 0.5,
                borderRadius: SPACING,
              }}
              aria-controls={isUserMenuOpen ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={isUserMenuOpen ? "true" : undefined}
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
            <Menu
              id="account-menu"
              anchorEl={userMenuAnchorEl}
              open={isUserMenuOpen}
              onClose={handleUserMenuClose}
              MenuListProps={{ "aria-labelledby": "basic-button" }}
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
        <Toolbar sx={{ minHeight: "56px" }}>{renderNavs()}</Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
