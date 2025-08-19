import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { hideModal } from "../../../redux/actions/modalActions";
import { COLOR } from "../../constants/AppConst";

// Updated style object to match the design reference
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 450 }, // Responsive width
  bgcolor: "background.paper",
  boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)", // Softer shadow
  p: 3, // Consistent padding
  borderRadius: "16px", // More rounded corners
  display: "flex",
  flexDirection: "column",
  gap: 2,
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
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            sx={{
              fontWeight: "bold",
              flexGrow: 1,
              textAlign: "center",
              ml: "40px",
              color: "black",
            }}
          >
            {title}
          </Typography>
          <IconButton
            onClick={handleClose}
            aria-label="close"
            sx={{ width: "40px", height: "40px" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content Section */}
        <Typography
          id="modal-description"
          sx={{ textAlign: "center", color: "text.secondary" }}
        >
          {content}
        </Typography>

        {/* Action Buttons Section */}
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleConfirm}
            sx={{
              backgroundColor:
                modalType === "delete" ? COLOR.red_rojo : COLOR.honolulu_blue, // Dynamic color based on type
              color: "#fff",
              borderRadius: "12px",
              py: 1.5,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: "bold",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: modalType === "delete" ? "#d32f2f" : "#005f9e", // Darker shade on hover
                boxShadow: "none",
              },
            }}
          >
            {modalType === "delete" ? "Delete" : "Confirm"}
          </Button>
          <Button
            variant="text"
            fullWidth
            onClick={handleClose}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              borderRadius: "12px",
              fontSize: "1rem",
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomModal;
