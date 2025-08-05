import React from "react";
import { Snackbar, Alert } from "@mui/material";
import PropTypes from 'prop-types';

const AlertPopup = ({ open, message, severity = "info", onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={null}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

// --- PropTypes untuk validasi props ---
AlertPopup.propTypes = {
  open: PropTypes.bool.isRequired, // Menunjukkan apakah alert terlihat
  message: PropTypes.string.isRequired, // Konten pesan alert
  severity: PropTypes.oneOf(["success", "error", "warning", "info"]), // Tipe alert
  onClose: PropTypes.func.isRequired, // Fungsi yang dipanggil saat alert ditutup
};

export default AlertPopup;
