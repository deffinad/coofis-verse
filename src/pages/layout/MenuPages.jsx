import React from "react";
import { Menu, MenuItem } from "@mui/material";

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
      <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
        Hapus Halaman
      </MenuItem>
    </Menu>
  );
};

export default MenuPages;
