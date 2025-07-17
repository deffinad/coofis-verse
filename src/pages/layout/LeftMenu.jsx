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

import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableLayer({ layer }) {
  const isStructural = layer.hasOwnProperty("children");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: layer.id,
    disabled: !isStructural,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    if (isDragging) {
      setExpanded(false); 
    }
  }, [isDragging]);

  // Handler untuk toggle expanded state secara manual (klik expand icon)
  const handleAccordionChange = (event, isExpanded) => {
    if (isStructural) {
      // Hanya izinkan expand/collapse jika item struktural
      setExpanded(isExpanded);
    }
  };

  return (
    <Accordion
      ref={setNodeRef}
      style={style}
      disableGutters
      elevation={0}
      expanded={expanded} // Kontrol expanded state dengan state lokal
      onChange={handleAccordionChange} // Tambahkan handler perubahan
      sx={{
        "&:before": { display: "none" },
        backgroundColor: "transparent",
        ml: 1,
        boxShadow: isDragging ? "0px 4px 12px rgba(0,0,0,0.15)" : "none",
        position: "relative",
        zIndex: isDragging ? 1 : "auto",
      }}
    >
      <AccordionSummary
        expandIcon={
          isStructural ? <ExpandMoreIcon /> : <Box sx={{ width: 24 }} />
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
          {/* Tampilkan handle drag yang sesuai: aktif atau non-aktif */}
          {isStructural ? (
            <span
              {...attributes}
              {...listeners}
              style={{ display: "flex", alignItems: "center", cursor: "grab" }}
              // Hentikan propagasi event klik agar tidak toggle accordion saat drag handle diklik
              onClick={(e) => e.stopPropagation()}
            >
              <DragIndicatorIcon sx={{ mr: 1 }} />
            </span>
          ) : (
            <DragIndicatorIcon
              sx={{ mr: 1, cursor: "not-allowed", color: "grey.400" }}
            />
          )}
          {layer.name}
        </Typography>
      </AccordionSummary>
      {/* Lakukan rekursi HANYA jika item ini struktural dan punya anak */}
      {isStructural && layer.children.length > 0 && (
        <AccordionDetails sx={{ padding: "8px", ml: 1 }}>
          <SortableLayerList layers={layer.children} />
        </AccordionDetails>
      )}
    </Accordion>
  );
}

function SortableLayerList({ layers }) {
  const itemIds = React.useMemo(() => layers.map((l) => l.id), [layers]);

  return (
    <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
      {layers.map((layer) => (
        <SortableLayer key={layer.id} layer={layer} />
      ))}
    </SortableContext>
  );
}

function StaticLayer({ layer }) {
  const isExpandable = layer.children && layer.children.length > 0;

  return (
    <Accordion
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
          {/* Icon drag dibuat non-fungsional dan abu-abu untuk menandakan tidak aktif */}
          <DragIndicatorIcon
            sx={{ mr: 1, cursor: "not-allowed", color: "grey.400" }}
          />
          {layer.name}
        </Typography>
      </AccordionSummary>
      {/* Jika child ini punya child lagi (untuk masa depan), render secara statis juga */}
      {isExpandable && (
        <AccordionDetails sx={{ padding: "8px", ml: 1 }}>
          {layer.children.map((child) => (
            <StaticLayer key={child.id} layer={child} />
          ))}
        </AccordionDetails>
      )}
    </Accordion>
  );
}

const LeftMenu = ({
  pages,
  currentPage,
  onPageChange,
  onAddPage,
  menuAnchorEl,
  onMenuClose,
  selectedPageForMenu,
  onDeletePage,
  onMenuOpen,
  selectedGrid,
  sectionComponents,
  onLayerReorder,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      <Box sx={{ p: SPACING - 1 }}>
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
            p: SPACING,
            mb: SPACING - 0.5,
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
              sx={{ mb: SPACING - 1.5, borderRadius: 1 }}
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
            p: SPACING,
            mb: SPACING - 0.5,
            display: "flex",
          }}
        >
          <Typography variant="h6">Layers</Typography>
        </Box>

        {/* [MODIFIED] Layers Tree is now wrapped in a DndContext */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onLayerReorder}
        >
          {currentPage &&
          pages.find((p) => p.id === currentPage)?.layouts.length > 0 ? (
            // Panggilan awal ke SortableLayerList untuk memulai proses rekursif
            <SortableLayerList
              layers={pages.find((p) => p.id === currentPage).layouts}
            />
          ) : (
            <Typography variant="body2" sx={{ color: "gray", ml: SPACING }}>
              (No layouts on this page)
            </Typography>
          )}
        </DndContext>
      </Box>

      {/* Components Section */}
      <Box sx={{ p: 1 }}>
        {/* ... (rest of the component remains unchanged) ... */}
        {/* Components Header */}
        <Box
          sx={{
            backgroundColor: "#2C2C2C",
            color: "#FFFFFF",
            borderRadius: SPACING,
            p: SPACING,
            mb: SPACING - 0.5,
            display: "flex",
          }}
        >
          <Typography variant="h6">Components</Typography>
        </Box>

        {/* Search Bar - Didesain ulang agar lebih bersih */}
        <Box sx={{ px: 1, mb: SPACING }}>
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
