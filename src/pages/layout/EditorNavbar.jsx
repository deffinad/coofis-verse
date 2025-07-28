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
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { COLOR, SPACING } from "@/shared/AppConst";

const EditorNavbar = ({
  projectName = "Project A",
  lastEdited = "Edited 1 hour ago",
  onSave,
  onPreview,
  onPublish,
}) => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: COLOR.white_winter,
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
                sx={{ color: COLOR.medium_dark_gray, fontSize: "0.75rem" }}
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
                  <SearchRoundedIcon sx={{ color: COLOR.medium_dark_gray }} />
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
              variant="contained"
              disableElevation
              onClick={onPreview}
              sx={{
                borderRadius: SPACING,
                width: 79,
                height: 40,
                color: COLOR.dark_gray,
                backgroundColor: COLOR.light_gray,
                borderColor: COLOR.light_gray,
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
                backgroundColor: COLOR.dark_gray,
                color: COLOR.white_ice,
                width: 79,
                height: 40,
                textTransform: "none",
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
