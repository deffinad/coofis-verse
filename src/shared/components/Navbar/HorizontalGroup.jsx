// SECTION: Component Imports
import React, { useState, useRef } from "react";
import {
  Grow,
  Icon,
  ListItem,
  ListItemText,
  Paper,
  Popover,
  List,
} from "@mui/material";
import clsx from "clsx";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import * as Icons from "@mui/icons-material";
import Box from "@mui/material/Box";
import HorizontalCollapse from "./HorizontalCollapse";
import HorizontalItem from "./HorizontalItem";
import { BORDER_RADIUS, COLOR, SPACING } from "@/shared/constants/AppConst";

// SECTION: Main HorizontalGroup Component
const HorizontalGroup = ({ item, nestedLevel, onClose }) => {
  // ANCHOR: State Management
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();

  // ANCHOR: Event Handlers
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
    if (onClose) {
      onClose();
    }
  };

  // ANCHOR: URL Matching Logic
  const isUrlInChildren = (parent, url) => {
    if (!parent.children) {
      return false;
    }
    for (const child of parent.children) {
      if (child.children && isUrlInChildren(child, url)) {
        return true;
      }
      if (child.url === url) {
        return true;
      }
    }
    return false;
  };

  // ANCHOR: Component State
  const IconComponent = Icons[item.icon || "Article"];
  const open = Boolean(anchorEl);
  const active = isUrlInChildren(item, location.pathname);

  // ANCHOR: Main Render Method
  return (
    // FIX: Wrapped ListItem in a div to handle mouse events consistently
    <div onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
      {/* Navigation Group Item */}
      <ListItem
        className={clsx("navItem", active && "active")}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 1,
          width: 140,
          p: 1,
          height: 40,
          borderRadius: BORDER_RADIUS,
          textTransform: "none",
          cursor: "pointer",
          color: active ? COLOR.white_smoke : COLOR.medium_dark_gray,
          backgroundColor: active ? COLOR.sky_blue : COLOR.white_smoke,
          mr: 1,
          "&:hover": {
            color: COLOR.medium_dark_gray,
            backgroundColor: active ? COLOR.sky_blue : COLOR.white_smoke,
          },
        }}
      >
        {/* Icon */}
        {item.icon && (
          <Icon
            color={active ? "inherit" : "action"}
            className="navLinkIcon"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <IconComponent sx={{ fontSize: "20px" }} />
          </Icon>
        )}
        {/* Title */}
        <ListItemText
          primary={item.title}
          sx={{
            fontWeight: "medium",
          }}
        />
      </ListItem>
      {/* Sub-menu Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handleClose}
        disableRestoreFocus
        disableEnforceFocus
        disableScrollLock
        PaperProps={{
          onMouseLeave: handlePopoverClose,
          sx: {
            mt: 0,
            backgroundColor: COLOR.white_smoke,
            borderRadius: BORDER_RADIUS,
          },
        }}
      >
        <Grow in={open} style={{ transformOrigin: "0 0 0" }}>
          {item.children && (
            <List sx={{ px: 0 }}>
              {item.children.map((child) => (
                <React.Fragment key={child.id}>
                  {/* Render child group */}
                  {child.type === "group" && (
                    <HorizontalGroup
                      item={child}
                      nestedLevel={nestedLevel + 1}
                      onClose={handleClose}
                    />
                  )}
                  {/* Render child collapse */}
                  {child.type === "collapse" && (
                    <HorizontalCollapse
                      item={child}
                      nestedLevel={nestedLevel + 1}
                      onClose={handleClose}
                    />
                  )}
                  {/* Render child item */}
                  {child.type === "item" && (
                    <HorizontalItem
                      item={child}
                      nestedLevel={nestedLevel + 1}
                      onClick={handleClose}
                    />
                  )}
                </React.Fragment>
              ))}
            </List>
          )}
        </Grow>
      </Popover>
    </div>
  );
};

HorizontalGroup.propTypes = {
  item: PropTypes.object,
  nestedLevel: PropTypes.number,
  onClose: PropTypes.func,
};

HorizontalGroup.defaultProps = {
  nestedLevel: 0,
};

export default React.memo(HorizontalGroup);
