import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { SPACING } from "@/shared/AppConst";

const EditorNavbar = ({
  projectName = "Project A",
  lastEdited = "Edited 1 hour ago",
  onSave,
  onPreview,
  onPublish,
}) => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#F9FDFE",
        borderBottom: "1px solid #e0e0e0",
        color: "#333",
        height: "84px",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        py: 1,
        px: 3,
        mb: 2,
      }}
    >
      <Toolbar sx={{ padding: "0 !important" }}>
        {/* Bagian Kiri */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              sx={{
                backgroundColor: "#2c2c2c",
                color: "#ffffff",
                width: 40,
                height: 40,
                borderRadius: SPACING,
                "&:hover": {
                  backgroundColor: "#1f1f1f",
                },
              }}
            >
              <ArrowBackIosNewRoundedIcon sx={{ fontSize: "1rem" }} />
            </IconButton>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: "1rem",
                  mb: 0,
                  lineHeight: 1.2,
                }}
              >
                {projectName}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#666", fontSize: "0.75rem" }}
              >
                {lastEdited}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Bagian Tengah - Search Bar */}
        <Box
          sx={{
            flex: 0,
            display: "flex",
            justifyContent: "center",
            minWidth: 300,
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchRoundedIcon sx={{ color: "#666" }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 5,
                width: 300,
                height: 40,
              },
            }}
          />
        </Box>

        {/* Bagian Kanan */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Button
              variant="text"
              color="inherit"
              onClick={onSave}
              sx={{
                width: 79,
                height: 40,
                borderRadius: SPACING,
                textTransform: "none",
              }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={onPreview}
              sx={{
                borderRadius: SPACING,
                width: 79,
                height: 40,
                backgroundColor: "#E3E3E3",
                borderColor: "#E3E3E3",
                textTransform: "none",
              }}
            >
              Preview
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={onPublish}
              sx={{
                borderRadius: SPACING,
                backgroundColor: "#2c2c2c",
                color: "#ffffff",
                width: 79,
                height: 40,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#1f1f1f",
                },
              }}
            >
              Publish
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default EditorNavbar;
