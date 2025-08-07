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
import { COLOR, SPACING } from "@/shared/constants/AppConst";

const HorizontalGroup = ({ item, nestedLevel }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isUrlInChildren = (parent, url) => {
    if (!parent.children) {
      return false;
    }
    for (const child of parent.children) {
      if (child.children && isUrlInChildren(child, url)) {
        return true;
      }
      if (child.url === url || url.startsWith(child.url)) {
        return true;
      }
    }
    return false;
  };

  const IconComponent = Icons[item.icon || "Article"];
  const open = Boolean(anchorEl);
  const active = isUrlInChildren(item, location.pathname);

  return (
    <div onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
      <ListItem
        button="true"
        className={clsx("navItem", active && "active")}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 1,
          width: 140,
          p: 1,
          height: 40,
          borderRadius: SPACING,
          textTransform: "none",
          cursor: "pointer",
          color: active ? COLOR.white_smoke : COLOR.medium_dark_gray,
          backgroundColor: active ? COLOR.sky_blue : COLOR.white_smoke,
          mr: 1,
          "&:hover": {
            color: active ? COLOR.white_smoke : COLOR.medium_dark_gray,
            backgroundColor: "transparent",
          },
        }}
      >
        {item.icon && (
          <Icon
            color="action"
            className="navLinkIcon"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <IconComponent sx={{ fontSize: "20px" }} />
          </Icon>
        )}
        <ListItemText
          primary={item.title}
          sx={{
            fontWeight: "medium",
          }}
        />
      </ListItem>
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
        onClose={handlePopoverClose}
        disableRestoreFocus
        PaperProps={{
          onMouseLeave: handlePopoverClose,
        }}
      >
        <Grow in={open} style={{ transformOrigin: "0 0 0" }}>
          <Paper>
            {item.children && (
              <List sx={{ px: 0 }}>
                {item.children.map((child) => (
                  <React.Fragment key={child.id}>
                    {child.type === "group" && (
                      <HorizontalGroup
                        item={child}
                        nestedLevel={nestedLevel + 1}
                      />
                    )}
                    {child.type === "collapse" && (
                      <HorizontalCollapse
                        item={child}
                        nestedLevel={nestedLevel + 1}
                      />
                    )}
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
          </Paper>
        </Grow>
      </Popover>
    </div>
  );
};

HorizontalGroup.propTypes = {
  item: PropTypes.object,
  nestedLevel: PropTypes.number,
};

HorizontalGroup.defaultProps = {
  nestedLevel: 0,
};

export default React.memo(HorizontalGroup);
