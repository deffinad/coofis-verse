// SECTION: Component Imports
import React, { useState, useEffect } from "react";
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
  List,
  Divider,
} from "@mui/material";
import {
  Home as HomeIcon,
  ViewQuilt as LayoutIcon,
  HelpOutline as DefaultIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { BORDER_RADIUS, COLOR, SPACING } from "@/shared/constants/AppConst";
import { fetchNavbarRoutes } from "../../../redux/actions/navbarActions";
import { logoData } from "@/shared/constants/AppData";
import HorizontalGroup from "./HorizontalGroup";
import HorizontalCollapse from "./HorizontalCollapse";
import HorizontalItem from "./HorizontalItem";

// SECTION: Icon Definitions
const iconComponents = {
  Dashboard: <HomeIcon />,
  Layout: <LayoutIcon />,
};

// SECTION: Main Navbar Component
const Navbar = () => {
  // ANCHOR: State Management
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { routes: dynamicRoutes } = useSelector((state) => state.navbar);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const isUserMenuOpen = Boolean(userMenuAnchorEl);

  // ANCHOR: Event Handlers
  const handleUserMenuClick = (event) =>
    setUserMenuAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchorEl(null);

  const handleLogout = () => {
    console.log("User logged out");
    handleUserMenuClose();
  };

  const handleProfile = () => {
    console.log("Opening user profile");
    navigate("/profile");
    handleUserMenuClose();
  };

  // ANCHOR: Data Fetching
  useEffect(() => {
    dispatch(fetchNavbarRoutes());
  }, [dispatch]);

  // ANCHOR: Navigation Rendering
  const renderNavs = () => {
    return (
      <List sx={{ display: "flex", flexDirection: "row", p: 0 }}>
        {dynamicRoutes.map((item) => (
          <React.Fragment key={item.id}>
            {/* Render a group of navigation links */}
            {item.type === "group" && (
              <HorizontalGroup item={item} nestedLevel={0} />
            )}
            {/* Render a collapsible menu item */}
            {item.type === "collapse" && (
              <HorizontalCollapse item={item} nestedLevel={0} />
            )}
            {/* Render a single navigation item */}
            {item.type === "item" && (
              <HorizontalItem item={item} nestedLevel={0} />
            )}
          </React.Fragment>
        ))}
      </List>
    );
  };

  // ANCHOR: Main Render Method
  return (
    <Box sx={{ flexGrow: 1, backgroundColor: COLOR.very_light_gray }}>
      {/* Top App Bar */}
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
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={logoData.imageUrl}
              alt={logoData.altText}
              sx={{ width: 40, height: 40, mr: SPACING }}
            />
          </Box>
          {/* User Menu */}
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
                borderRadius: BORDER_RADIUS,
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
            {/* User Menu Popover */}
            <Menu
              id="account-menu"
              anchorEl={userMenuAnchorEl}
              open={isUserMenuOpen}
              onClose={handleUserMenuClose}
              MenuListProps={{ "aria-labelledby": "basic-button" }}
              sx={{ mt: 1 }}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                  width: "200px",
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleProfile}>
                <PersonIcon sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Main Navigation Bar */}
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
