import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DividingLine from "../components/DividingLine";
import MenuPages from "./MenuPages";
import DraggableComponent from "@/shared/components/DraggableComponent";

const LeftMenu = ({
  // Props untuk Pages
  pages,
  currentPage,
  onPageChange,
  onAddPage,
  menuAnchorEl,
  onMenuClose,
  selectedPageForMenu,
  onDeletePage,
  onMenuOpen,

  // Props untuk Components
  selectedGrid,
  sectionComponents,
}) => {
  // Fungsi untuk render layer tree
  const RenderLayerTree = ({ layers }) => {
    return layers.map((layer) => {
      const isExpandable = layer.children && layer.children.length > 0;

      return (
        <Accordion
          key={layer.id}
          disableGutters
          elevation={0}
          sx={{
            "&:before": { display: "none" },
            backgroundColor: "transparent",
            ml: 1,
          }}
        >
          <AccordionSummary
            expandIcon={
              isExpandable ? <ExpandMoreIcon /> : <Box sx={{ width: 24 }} />
            }
            sx={{ p: "6px 8px", minHeight: "48px" }}
          >
            <Typography
              variant="button"
              sx={{
                color: "#1E1E1E",
                textTransform: "none",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
              }}
            >
              <DragIndicatorIcon sx={{ mr: 1, cursor: "grab" }} />
              {layer.name}
            </Typography>
          </AccordionSummary>
          {isExpandable && (
            <AccordionDetails sx={{ padding: "8px", ml: 1 }}>
              <RenderLayerTree layers={layer.children} />
            </AccordionDetails>
          )}
        </Accordion>
      );
    });
  };

  return (
    <Box
      sx={{
        maxHeight: "85vh",
        overflow:"auto",
        flexShrink: 0,
        width: 300,
        border: "1px solid #D9D9D9",
        backgroundColor: "#FFFFFF",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Pages Section */}
      <Box sx={{ p: 1 }}>
        <MenuPages
          anchorEl={menuAnchorEl}
          onClose={onMenuClose}
          selectedPage={selectedPageForMenu}
          onDeletePage={onDeletePage}
        />

        {/* Pages Header */}
        <Box
          sx={{
            backgroundColor: "#2C2C2C",
            color: "#FFFFFF",
            borderRadius: 2,
            p: 1.5,
            mb: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6">Pages</Typography>
            <Typography variant="body2" sx={{ color: "#ccc" }}>
              Description
            </Typography>
          </Box>
          <IconButton size="small" sx={{ color: "white" }} onClick={onAddPage}>
            <AddIcon />
          </IconButton>
        </Box>

        {/* Pages List */}
        <List sx={{ width: "100%", p: 0, overflow: "auto" }}>
          {pages.map((page) => (
            <ListItemButton
              key={page.id}
              selected={currentPage === page.id}
              onClick={() => onPageChange(page.id)}
              sx={{ mb: 1, borderRadius: 1 }}
            >
              <ListItemText
                primary={
                  <Typography
                    variant="button"
                    sx={{
                      color: "#1E1E1E",
                      textTransform: "none",
                      fontWeight: 500,
                    }}
                  >
                    {page.name}
                  </Typography>
                }
              />
              <IconButton
                edge="end"
                size="small"
                onClick={(e) => onMenuOpen(e, page)}
                sx={{ color: "#1E1E1E" }}
              >
                <MoreVertIcon />
              </IconButton>
            </ListItemButton>
          ))}
        </List>
      </Box>

      <DividingLine />

      {/* Layers Section */}
      <Box sx={{ p: 1 }}>
        {/* Layers Header */}
        <Box
          sx={{
            backgroundColor: "#2C2C2C",
            color: "#FFFFFF",
            borderRadius: 2,
            p: 1.5,
            mb: 2,
            display: "flex",
          }}
        >
          <Typography variant="h6">Layers</Typography>
        </Box>

        {/* Layers Tree */}
        {currentPage &&
        pages.find((p) => p.id === currentPage)?.layouts.length > 0 ? (
          <RenderLayerTree
            layers={pages.find((p) => p.id === currentPage).layouts}
          />
        ) : (
          <Typography variant="body2" sx={{ color: "gray", ml: 2 }}>
            (No layouts on this page)
          </Typography>
        )}
      </Box>

      <DividingLine />

      {/* Components Section */}
      <Box sx={{ p: 1, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Components Header */}

        <Box
          sx={{
            backgroundColor: "#2C2C2C",
            color: "#FFFFFF",
            borderRadius: 2,
            p: 1.5,
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Components</Typography>
          <IconButton size="small" sx={{ color: "white" }}>
            <AddIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            flex: 0,
            display: "flex",
            justifyContent: "center",
            minWidth: 200,
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
                width: 270,
                height: 40,
              },
            }}
          />
        </Box>

        {/* Components Tree */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {sectionComponents.map((section, index) => (
            <Accordion
              key={index}
              disableGutters
              elevation={0}
              sx={{
                "&:before": { display: "none" },
                backgroundColor: "transparent",
              }}
            >
              <AccordionSummary
                expandIcon={<KeyboardArrowRightIcon />}
                sx={{
                  p: "6px 8px",
                  minHeight: "48px",
                  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                    transform: "rotate(90deg)",
                  },
                }}
              >
                <Typography
                  variant="button"
                  sx={{
                    color: "#1E1E1E",
                    textTransform: "none",
                    fontWeight: 500,
                  }}
                >
                  {section.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: "8px", ml: 1 }}>
                {section.title === "Widget" ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      width: "100%",
                    }}
                  >
                    {[
                      "Ratings",
                      "Navbar",
                      "ArsipCuti",
                      "KuotaCutiSaatIni",
                      "ListDate",
                      "MonitoringKuota",
                      "StatusDokumenCutiDashboard",
                    ].map((id) => (
                      <DraggableComponent key={id} id={id}>
                        <Button
                          variant="outlined"
                          fullWidth
                          disabled={!selectedGrid}
                          sx={{
                            color: "#1E1E1E",
                            borderColor: "#1E1E1E",
                            justifyContent: "flex-start",
                            textTransform: "none",
                          }}
                        >
                          {id}
                        </Button>
                      </DraggableComponent>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: "#1E1E1E" }}>
                    (Belum ada komponen)
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default LeftMenu;
