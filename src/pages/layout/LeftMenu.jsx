import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
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
import { restrictToParentElement } from "@dnd-kit/modifiers";

import { LayoutTemplates } from "../../json/LayoutTemplates";

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
        width: 280,
        backgroundColor: "#F9FDFE",
        borderRadius: SPACING,
        border: "1px solid #D9D9D9",
        flexShrink: 0,
        position: "sticky",
        top: "110px",
        height: "calc(100vh - 134px)",
        overflowY: "auto",
        overflowX: "hidden",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#f5f5f5",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#bdbdbd",
          borderRadius: "10px",
          "&:hover": {
            backgroundColor: "#8d8d8d",
          },
        },
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

        {/* Layers Tree is now wrapped in a DndContext */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onLayerReorder}
          modifiers={[restrictToParentElement]}
        >
          {currentPage &&
          pages.find((p) => p.id === currentPage)?.layouts.length > 0 ? (
            <SortableLayerList
              layers={pages.find((p) => p.id === currentPage).layouts}
            />
          ) : (
            <Typography variant="body2" sx={{ color: "gray", ml: SPACING }}>
              No layouts on this page.
            </Typography>
          )}
        </DndContext>
      </Box>

      {/* Components Section */}
      <Box sx={{ p: 1 }}>
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

        {/* Search Bar */}
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
                borderRadius: "30px",
                backgroundColor: "#F5F5F5",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              },
            }}
          />
        </Box>

        {/* Components Tree */}
        <Box>
          {sectionComponents.map((section, index) => (
            <Accordion
              key={index}
              disableGutters
              elevation={0}
              square
              sx={{
                "&:before": { display: "none" },
                backgroundColor: "transparent",
                border: "none",
                boxShadow: "none",
                "&.Mui-expanded": {
                  margin: 0,
                },
                p: 0,
              }}
            >
              <AccordionSummary
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
              <AccordionDetails sx={{ p: 0, mb: SPACING - 0.5, ml: SPACING }}>
                {section.title === "Widget" ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {[
                      "Ratings",
                      "CustomCard",
                      "Navbar",
                      "ArsipCuti",
                      "KuotaCutiSaatIni",
                      "ListDate",
                      "MonitoringKuota",
                      "StatusDokumenCutiDashboard",
                    ].map((id) => (
                      <DraggableComponent key={id} id={id}>
                        <ListItemButton
                          sx={{
                            borderRadius: SPACING,
                            p: SPACING,
                            mb: SPACING - 0.5,
                            cursor: "grab",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                            "&:active": {
                              backgroundColor: "rgba(0, 0, 0, 0.08)",
                            },
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#1E1E1E",
                                  fontWeight: 500,
                                }}
                              >
                                {id}
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      </DraggableComponent>
                    ))}
                  </Box>
                ) : section.title === "Layout" ? (
                  <Box sx={{ p: SPACING }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "grey.700", mb: 1 }}
                    >
                      Drag and drop these layout templates onto your page.
                    </Typography>
                    {LayoutTemplates.map(
                      (
                        template // ✅ Render Layout Templates
                      ) => (
                        <DraggableComponent key={template.id} id={template.id}>
                          <ListItemButton
                            sx={{
                              borderRadius: SPACING,
                              p: SPACING,
                              mb: SPACING - 0.5,
                              cursor: "grab",
                              "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                              },
                              "&:active": {
                                backgroundColor: "rgba(0, 0, 0, 0.08)",
                              },
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#1E1E1E", fontWeight: 500 }}
                                >
                                  {template.name}
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        </DraggableComponent>
                      )
                    )}
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: "grey.600", px: 1 }}>
                    No components available.
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
