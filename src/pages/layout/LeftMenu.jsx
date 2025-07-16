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
import { SPACING } from "@/shared/AppConst";

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
        width: 300,
        backgroundColor: "#FFFFFF",
        borderRadius: SPACING,
        border: "1px solid #D9D9D9",
        flexShrink: 0,
        position: "sticky",
        top: "24px",
        flexDirection: "column",
        height: "80vh",
        overflow: "auto",
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
            borderRadius: SPACING,
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
        <List sx={{ width: "100%", p: 0 }}>
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
            borderRadius: SPACING,
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
      <Box sx={{ p: 1 }}>
        {/* Components Header */}
        <Box
          sx={{
            backgroundColor: "#2C2C2C",
            color: "#FFFFFF",
            borderRadius: SPACING, // Pastikan variabel SPACING sudah didefinisikan
            p: 1.5,
            mb: 2, // Memberi jarak ke elemen di bawahnya
            display: "flex",
          }}
        >
          <Typography variant="h6">Components</Typography>
        </Box>

        {/* Search Bar - Didesain ulang agar lebih bersih */}
        <Box sx={{ px: 1, mb: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search components..."
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: "grey.500" }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: "30px", // Membuat search bar lebih modern
                backgroundColor: "#F5F5F5",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none", // Menghilangkan border
                },
              },
            }}
          />
        </Box>

        {/* Components Tree - Menggunakan gaya dari Layers */}
        <Box>
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
                // Menggunakan icon yang sama dengan Layers untuk konsistensi
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  p: "6px 8px",
                  minHeight: "48px",
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
              <AccordionDetails sx={{ padding: "0px 8px 8px 8px" }}>
                {section.title === "Widget" ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
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
                        {/* Desain item komponen yang baru, tanpa icon */}
                        <Box
                          sx={{
                            p: 1.5,
                            width: "fit-content",
                            backgroundColor: "rgba(0, 0, 0, 0.03)",
                            borderRadius: "8px",
                            border: "1px solid rgba(0, 0, 0, 0.05)",
                            textAlign: "left",
                            cursor: "grab", // Mengindikasikan bisa di-drag
                            "&:active": {
                              cursor: "grabbing",
                            },
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.06)",
                              borderColor: "rgba(0, 0, 0, 0.1)",
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, color: "#333" }}
                          >
                            {id}
                          </Typography>
                        </Box>
                      </DraggableComponent>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: "grey.600", px: 1 }}>
                    (Belum ada komponen)
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
        <DividingLine />
      </Box>
    </Box>
  );
};

export default LeftMenu;
