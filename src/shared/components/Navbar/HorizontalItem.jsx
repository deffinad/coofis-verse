// SECTION: Component Imports
import React from "react";
import { ListItem, ListItemText, Icon } from "@mui/material";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import * as Icons from "@mui/icons-material";
import { BORDER_RADIUS, COLOR, SPACING } from "@/shared/constants/AppConst";

// SECTION: Main HorizontalItem Component
const HorizontalItem = ({ item, dense, onClick, nestedLevel }) => {
  // ANCHOR: Icon Definition
  const IconComponent = Icons[item.icon || "Article"];
  const isSubItem = nestedLevel > 0;

  // ANCHOR: Main Render Method
  return (
    <ListItem
      button="true"
      onClick={onClick}
      component={NavLink}
      to={item.url}
      end
      sx={{
        minHeight: 40,
        padding: "4px 12px",
        color: COLOR.medium_dark_gray,
        backgroundColor: COLOR.white_smoke,
        textDecoration: "none!important",
        borderRadius: BORDER_RADIUS,
        mr: 1,

        "&.active": {
          color: isSubItem ? COLOR.sky_blue : COLOR.white_smoke,
          backgroundColor: isSubItem ? "transparent" : COLOR.sky_blue,
          "& .list-item-text-primary": {
            color: "inherit",
          },
          "& .list-item-icon": {
            color: "inherit",
          },
        },
        "&:hover": {
          backgroundColor: COLOR.white_smoke,
          color: COLOR.medium_dark_gray,
        },
        "&.active:hover": {
          backgroundColor: isSubItem ? "transparent" : COLOR.sky_blue,
          color: isSubItem ? COLOR.sky_blue : COLOR.white_smoke,
        },
        "& .list-item-text": {
          padding: "0 0 0 16px",
        },
        ...(dense && {
          padding: "4px 12px",
          minHeight: 40,
          "& .list-item-text": {
            padding: "0 0 0 8px",
          },
        }),
      }}
    >
      {/* Icon */}
      {item.icon && (
        <Icon
          sx={{
            mr: 2,
            fontSize: { xs: 16, xl: 18 },
          }}
        >
          <IconComponent sx={{ fontSize: "20px" }} />
        </Icon>
      )}
      {/* Title */}
      <ListItemText primary={item.title} />
    </ListItem>
  );
};

HorizontalItem.propTypes = {
  item: PropTypes.object.isRequired,
  dense: PropTypes.bool,
  onClick: PropTypes.func,
  nestedLevel: PropTypes.number,
};

HorizontalItem.defaultProps = {
  nestedLevel: 0,
};

export default React.memo(HorizontalItem);