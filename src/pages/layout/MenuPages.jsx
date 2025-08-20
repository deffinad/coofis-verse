import React from "react";
import { Menu, MenuItem } from "@mui/material";
import { BORDER_RADIUS } from "@/shared/constants/AppConst";

const MenuPages = ({ anchorEl, onClose, selectedPage, onDeletePage }) => {
  const isOpen = Boolean(anchorEl);

  if (!selectedPage) {
    return null;
  }

  const handleDeleteClick = () => {
    onDeletePage(selectedPage.id);
    onClose();
  };

  return (
    <Menu anchorEl={anchorEl} open={isOpen} onClose={onClose}>
      <MenuItem
        onClick={handleDeleteClick}
        sx={{
          color: "error.main",
          borderRadius: BORDER_RADIUS,
          "&:focus": {
            outline: "none",
            border: "none",
          },
          "&:active": {
            outline: "none",
            border: "none",
          },
        }}
      >
        Hapus Halaman
      </MenuItem>
    </Menu>
  );
};

export default MenuPages;
