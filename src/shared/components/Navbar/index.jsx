import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "@mui/material";
import {
  Home as HomeIcon,
  ViewQuilt as LayoutIcon,
  HelpOutline as DefaultIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { COLOR, SPACING } from "@/shared/constants/AppConst";
import { fetchNavbarRoutes } from "../../../redux/actions/navbarActions";
import { logoData } from "@/shared/constants/AppData";
import HorizontalGroup from "./HorizontalGroup";
import HorizontalCollapse from "./HorizontalCollapse";
import HorizontalItem from "./HorizontalItem";

const iconComponents = {
  Dashboard: <HomeIcon />,
  Layout: <LayoutIcon />,
};

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { routes: dynamicRoutes } = useSelector((state) => state.navbar);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const isUserMenuOpen = Boolean(userMenuAnchorEl);

  const handleUserMenuClick = (event) =>
    setUserMenuAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchorEl(null);

  const handleLogout = () => {
    console.log("User logged out");
    handleUserMenuClose();
  };

  useEffect(() => {
    dispatch(fetchNavbarRoutes());
  }, [dispatch]);

  const renderNavs = () => {
    return (
      <List sx={{ display: 'flex', flexDirection: 'row', p: 0 }}>
        {dynamicRoutes.map((item) => (
          <React.Fragment key={item.id}>
            {item.type === 'group' && (
              <HorizontalGroup item={item} nestedLevel={0} />
            )}
            {item.type === 'collapse' && (
              <HorizontalCollapse item={item} nestedLevel={0} />
            )}
            {item.type === 'item' && (
              <HorizontalItem item={item} nestedLevel={0} />
            )}
          </React.Fragment>
        ))}
      </List>
    );
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