// HorizontalCollapse.jsx

// SECTION: Component Imports
import React, { useState, useRef } from "react";
import {
  Grow,
  Icon,
  IconButton,
  ListItem,
  ListItemText,
  Paper,
  Popover,
  List,
} from "@mui/material";
import clsx from "clsx";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import * as Icons from "@mui/icons-material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Box from "@mui/material/Box";
import HorizontalItem from "./HorizontalItem";
import HorizontalGroup from "./HorizontalGroup";
import { BORDER_RADIUS, COLOR, SPACING } from "@/shared/constants/AppConst";

// SECTION: Main HorizontalCollapse Component
const HorizontalCollapse = ({ item, nestedLevel, dense, onClose }) => {
  // ANCHOR: State Management
  const [opened, setOpened] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const anchorRef = useRef(null);
  const popoverRef = useRef(null);
  const timeoutRef = useRef(null);

  // ANCHOR: Event Handlers
  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    setOpened(true);
  };

  const handleLeave = (event) => {
    // Check if the mouse is moving to the popover or the trigger element
    if (
      popoverRef.current?.contains(event.relatedTarget) ||
      anchorRef.current?.contains(event.relatedTarget)
    ) {
      return;
    }
    // If not, set a timeout to close the menu
    timeoutRef.current = setTimeout(() => {
      setOpened(false);
    }, 200);
  };

  const handleClose = () => {
    setOpened(false);
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
  const open = opened;
  const active = isUrlInChildren(item, location.pathname);

  // ANCHOR: Main Render Method
  return (
    <div ref={anchorRef} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {/* Collapsible Menu Item */}
      <ListItem
        component="div"
        sx={{
          color: active ? COLOR.sky_blue : COLOR.medium_dark_gray,
          backgroundColor: COLOR.white_smoke,
          padding: "8px 12px",
          cursor: "pointer",
          "&:focus": {
            outline: "none",
          },
          "&:focus-visible": {
            outline: "none",
          },

          "&:hover": {
            backgroundColor: COLOR.white_smoke,
            color: active ? COLOR.sky_blue : COLOR.medium_dark_gray,
          },

          "&.open": {
            backgroundColor: "rgba(0,0,0,.08)",
          },

          "&.active, &.active:hover, &.active:focus": {
            color: COLOR.sky_blue,
            backgroundColor: COLOR.white_smoke,
          },

          ...(dense && {
            padding: "4px 12px",
          }),
        }}
        className={clsx("navItemSubmenu", open && "open", active && "active")}
      >
        {/* Icon */}
        {item.icon && (
          <Icon
            sx={{
              color: active ? COLOR.white_smoke : "action",
              mr: 3.5,
              fontSize: { xs: 16, xl: 16 },
            }}
          >
            <IconComponent sx={{ fontSize: "20px" }} />
          </Icon>
        )}
        {/* Title */}
        <ListItemText className="navLinkTextSubmenu" primary={item.title} />
        {/* Arrow Icon */}
        <Box p={0}>
          <IconButton disableRipple>
            <KeyboardArrowRightIcon sx={{ fontSize: "18px !important" }} />
          </IconButton>
        </Box>
      </ListItem>
      {/* Sub-menu Popover */}
      <Popover
        open={opened}
        anchorEl={anchorRef.current}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        onClose={handleClose}
        disableRestoreFocus
        disableEnforceFocus
        disableScrollLock
        PaperProps={{
          // <-- UBAH DARI slotProps KE PaperProps
          ref: popoverRef,
          onMouseEnter: handleEnter,
          onMouseLeave: handleLeave,
          sx: {
            ml: 0,
            borderRadius: BORDER_RADIUS,
            backgroundColor: COLOR.white_smoke,
            pointerEvents: "auto",
            boxShadow: "none",
          },
        }}
        sx={{
          // <-- TAMBAHKAN BLOK INI
          pointerEvents: "none",
        }}
      >
        <Grow in={open} timeout={0} style={{ transformOrigin: "0 0 0" }}>
          {item.children && (
            <List sx={{ px: 0, borderRadius: BORDER_RADIUS }}>
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

HorizontalCollapse.propTypes = {
  item: PropTypes.object.isRequired,
  nestedLevel: PropTypes.number,
  dense: PropTypes.bool,
  onClose: PropTypes.func,
};

HorizontalCollapse.defaultProps = {
  nestedLevel: 0,
};

export default React.memo(HorizontalCollapse);
