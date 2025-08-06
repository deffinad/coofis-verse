import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Popover,
} from "@mui/material";
import {
  Home as HomeIcon,
  ViewQuilt as LayoutIcon,
  HelpOutline as DefaultIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { COLOR, SPACING } from "@/shared/constants/AppConst";
import { fetchNavbarRoutes } from "../../redux/actions/navbarActions";
import { logoData } from "@/shared/constants/AppData";

const iconComponents = {
  Dashboard: <HomeIcon />,
  Layout: <LayoutIcon />,
};

// ==================================================================
// ======== Komponen RenderMenuItem yang Telah Diperbaiki ===========
// ==================================================================
const RenderMenuItem = ({ child, onLinkClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const timerRef = useRef(null);

  const handlePopoverOpen = (event) => {
    clearTimeout(timerRef.current);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    timerRef.current = setTimeout(() => {
      setAnchorEl(null);
    }, 200); // Delay to allow moving mouse to popover
  };

  const handleChildClick = (url) => {
    setAnchorEl(null);
    if (onLinkClick) {
      onLinkClick();
    }
    navigate(url);
  };

  const open = Boolean(anchorEl);
  const isParentActive = location.pathname.startsWith(child.url);

  if (child.type === "collapse") {
    return (
      <div onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
        <MenuItem
          component={Link}
          to={child.url}
          onClick={onLinkClick} // Close main menu on click
          sx={{
            justifyContent: "space-between",
            color: isParentActive ? COLOR.white_smoke : COLOR.medium_dark_gray,
            backgroundColor: isParentActive ? COLOR.sky_blue : "transparent",
            "&:hover": {
              backgroundColor: isParentActive
                ? COLOR.sky_blue
                : COLOR.white_smoke,
              color: isParentActive
                ? COLOR.white_smoke
                : COLOR.medium_dark_gray,
            },
          }}
        >
          {child.title}
          <ExpandMoreIcon />
        </MenuItem>
        <Popover
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          onClose={() => setAnchorEl(null)}
          disableRestoreFocus
          PaperProps={{
            onMouseEnter: () => clearTimeout(timerRef.current),
            onMouseLeave: handlePopoverClose,
          }}
        >
          {child.children.map((subChild) => (
            <RenderMenuItem
              key={subChild.id}
              child={subChild}
              onLinkClick={() => handleChildClick(subChild.url)}
            />
          ))}
        </Popover>
      </div>
    );
  }

  // For regular menu items
  return (
    <MenuItem
      onClick={() => handleChildClick(child.url)}
      selected={location.pathname === child.url}
      sx={{
        "&.Mui-selected": {
          backgroundColor: COLOR.sky_blue,
          color: COLOR.white_smoke,
          "&:hover": {
            backgroundColor: COLOR.sky_blue,
          },
        },
        "&:hover": {
          backgroundColor: COLOR.white_smoke,
        },
      }}
    >
      {child.title}
    </MenuItem>
  );
};

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { routes: dynamicRoutes } = useSelector((state) => state.navbar);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const isUserMenuOpen = Boolean(userMenuAnchorEl);

  // State untuk manajemen menu hover
  const [hoverMenu, setHoverMenu] = useState({
    anchorEl: null,
    openId: null,
  });
  const hideMenuTimer = useRef(null);

  const handleUserMenuClick = (event) =>
    setUserMenuAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchorEl(null);

  // Handlers untuk menu hover
  const handleMenuMouseEnter = (event, menuId) => {
    clearTimeout(hideMenuTimer.current);
    setHoverMenu({
      anchorEl: event.currentTarget,
      openId: menuId,
    });
  };

  const handleMenuMouseLeave = () => {
    hideMenuTimer.current = setTimeout(() => {
      setHoverMenu({ anchorEl: null, openId: null });
    }, 200); // jeda 200ms
  };

  // Fungsi ini dipanggil dari RenderMenuItem untuk menutup menu utama setelah klik
  const handleMenuItemClick = () => {
    clearTimeout(hideMenuTimer.current);
    setHoverMenu({ anchorEl: null, openId: null });
  };

  const handleLogout = () => {
    console.log("User logged out");
    handleUserMenuClose();
  };

  useEffect(() => {
    dispatch(fetchNavbarRoutes());
  }, [dispatch]);

  const renderNavs = () => {
    return dynamicRoutes.map((route) => {
      const isActive =
        ((location.pathname.startsWith(route.url) ||
          (route.alsoActiveOn &&
            route.alsoActiveOn.some((path) =>
              location.pathname.startsWith(path)
            ))) &&
          route.url !== "/") ||
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
                color: isActive ? COLOR.white_smoke : COLOR.medium_dark_gray,
                backgroundColor: isActive ? COLOR.sky_blue : COLOR.white_smoke,
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
                onMouseEnter: () => clearTimeout(hideMenuTimer.current),
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
                <RenderMenuItem
                  key={child.id}
                  child={child}
                  onLinkClick={handleMenuItemClick}
                />
              ))}
            </Menu>
          </Box>
        );
      }

      // Render untuk item non-group
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
            color: isActive ? COLOR.white_smoke : COLOR.medium_dark_gray,
            backgroundColor: isActive ? COLOR.sky_blue : COLOR.white_smoke,
            textDecoration: "none",
            cursor: "pointer",
            "&:hover": {
              color: isActive ? COLOR.white_smoke : COLOR.medium_dark_gray,
              backgroundColor: isActive ? COLOR.sky_blue : COLOR.white_smoke,
            },
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
              <MenuItem
                onClick={handleLogout}
                sx={{
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
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
