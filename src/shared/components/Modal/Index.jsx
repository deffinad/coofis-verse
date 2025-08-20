import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { hideModal } from "../../../redux/actions/modalActions";
import { BORDER_RADIUS, COLOR, SPACING } from "../../constants/AppConst";

// Modern minimalist style dengan shadow dan spacing yang lebih baik
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 420 }, // Sedikit lebih kecil untuk tampilan minimalist
  bgcolor: "background.paper",
  boxShadow: "0px 20px 60px rgba(0, 0, 0, 0.08)", // Shadow lebih halus dan modern
  p: 4, // Padding lebih besar untuk breathing room
  borderRadius: BORDER_RADIUS, // Corner radius lebih besar untuk tampilan modern
  display: "flex",
  flexDirection: "column",
  gap: 3, // Gap lebih besar antar elemen
  border: "1px solid rgba(0, 0, 0, 0.02)", // Subtle border untuk definisi
};

const CustomModal = () => {
  const dispatch = useDispatch();
  const { show, title, content, confirmAction, modalType } = useSelector(
    (state) => state.modal
  );

  const handleClose = () => {
    dispatch(hideModal());
  };

  const handleConfirm = async () => {
    if (confirmAction) {
      await dispatch(confirmAction());
      dispatch(hideModal());
    }
  };

  return (
    <Modal
      open={show}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      // Backdrop dengan blur effect untuk tampilan modern
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
        },
      }}
    >
      <Box sx={style}>
        {/* Header Section dengan close button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography
            id="modal-title"
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 600, // Sedikit lebih light dari bold untuk tampilan modern
              flexGrow: 1,
              textAlign: "center",
              color: "text.primary",
              fontSize: "1.25rem",
              letterSpacing: "-0.01em", // Tight letter spacing untuk tampilan sleek
            }}
          >
            {title}
          </Typography>

          {/* Close button untuk UX yang lebih baik */}
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: "text.secondary",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                transform: "scale(1.1)",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Content Section dengan typography yang lebih readable */}
        <Typography
          id="modal-description"
          sx={{
            textAlign: "center",
            color: "text.secondary",
            fontSize: "0.95rem",
            lineHeight: 1.6, // Line height yang lebih baik untuk readability
            mb: 1,
            px: 1, // Sedikit padding horizontal untuk text yang lebih centered
          }}
        >
          {content}
        </Typography>

        {/* Action Buttons Section dengan layout modern */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" }, // Responsive: stack di mobile, horizontal di desktop
            gap: 2,
            justifyContent: "center",
          }}
        >
          {/* Cancel Button - lebih subtle */}
          <Button
            variant="text"
            onClick={handleClose}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              borderRadius: 2,
              fontSize: "0.95rem",
              fontWeight: 500,
              px: 3,
              py: 1.25,
              minWidth: { sm: 100 },
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                transform: "translateY(-1px)",
              },
              "&:focus": {
                outline: "none",
              },
            }}
          >
            Cancel
          </Button>

          {/* Confirm/Delete Button - lebih prominent */}
          <Button
            variant="contained"
            onClick={handleConfirm}
            sx={{
              backgroundColor: modalType === "delete" ? "#ef4444" : "#3b82f6", // Modern color palette
              color: "#fff",
              borderRadius: 2,
              px: 3,
              py: 1.25,
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 600,
              minWidth: { sm: 100 },
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: modalType === "delete" ? "#dc2626" : "#2563eb",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                transform: "translateY(-1px)",
              },
              "&:focus": {
                outline: "none",
              },
              "&:active": {
                transform: "translateY(0px)",
              },
            }}
          >
            {modalType === "delete" ? "Delete" : "Confirm"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomModal;
