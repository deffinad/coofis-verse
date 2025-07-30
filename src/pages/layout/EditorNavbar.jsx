import React from "react";
import { AppBar, Toolbar, Box, Typography, Button } from "@mui/material";
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
        backgroundColor: COLOR.very_light_gray,
        color: "#333",
        height: "fit-content",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        py: SPACING,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1788px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Toolbar sx={{ padding: "0 !important", width: "100%" }}>
          {/* Bagian Kiri */}
          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: SPACING }}>
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
      </Box>
    </AppBar>
  );
};

export default EditorNavbar;
