import React, { useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
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
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToParentElement } from "@dnd-kit/modifiers";

// --- MUI Imports ---
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

// --- Local/Shared Imports ---
import DividingLine from "../../shared/components/DividingLine";
import MenuPages from "./MenuPages";
import DraggableComponent from "@/shared/components/DraggableComponent";
import { BORDER_RADIUS, COLOR, SPACING } from "@/shared/constants/AppConst";
import { LayoutTemplates } from "../../json/LayoutTemplates";
import { useDynamicMenuHeight } from "@/shared/utils/utility";
import {
  WIDGET_COMPONENTS,
  SECTION_COMPONENTS,
} from "../../shared/constants/AppData";

// --- Redux Actions ---
import {
  setCurrentPage,
  addPage,
  deletePage,
  setMenuAnchorEl,
  setSelectedPageForMenu,
  setSelectedLayout,
  setSelectedGrid,
  setAtribut,
  clearSelections,
} from "../../redux/actions/layoutActions";
import { showModal } from "../../redux/actions/modalActions";

import { showAlert } from "../../redux/actions/alertActions";

function SortableLayer({
  layer,
  selectedLayout,
  selectedGrid,
  onLayerSelect,
  currentLayoutId,
  currentLayoutIndex,
}) {
  const isStructural = layer.hasOwnProperty("children");
  const hasChildren =
    isStructural && layer.children && layer.children.length > 0;
  const isSelected =
    selectedLayout === layer.id ||
    (selectedGrid && selectedGrid.id === layer.id);

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
    if (isDragging) setExpanded(false);
  }, [isDragging]);

  const handleAccordionChange = (event, isExpanded) => {
    if (isExpanded && !hasChildren) return;
    setExpanded(isExpanded);
  };

  const handleLayerClick = (event) => {
    event.stopPropagation();
    if (onLayerSelect)
      onLayerSelect(layer, currentLayoutId, currentLayoutIndex);
  };

  return (
    <Accordion
      ref={setNodeRef}
      style={style}
      disableGutters
      elevation={0}
      expanded={expanded}
      onChange={handleAccordionChange}
      sx={{
        "&:before": { display: "none" },
        ml: 1,
        boxShadow: isDragging ? "0px 4px 12px rgba(0,0,0,0.15)" : "none",
        position: "relative",
        zIndex: isDragging ? 1 : "auto",
        border: isSelected ? `1px solid ${COLOR.dark_gray}` : "none",
        backgroundColor: isSelected ? COLOR.light_green_tint : "transparent",
        borderRadius: BORDER_RADIUS,
        transition: "background-color 0.2s ease, border 0.2s ease",
      }}
    >
      <AccordionSummary
        expandIcon={
          hasChildren ? <ExpandMoreIcon /> : <Box sx={{ width: 24 }} />
        }
        sx={{
          p: "2px 5px",
          minHeight: "48px",
          mb: 0.5,
          borderRadius: BORDER_RADIUS,
          "&:hover": {
            backgroundColor: isSelected
              ? COLOR.light_green_tint
              : "rgba(0, 0, 0, 0.04)",
          },
        }}
        onClick={handleLayerClick}
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
          {isStructural ? (
            <span
              {...attributes}
              {...listeners}
              style={{ display: "flex", alignItems: "center", cursor: "grab" }}
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
      {hasChildren && (
        <AccordionDetails sx={{ padding: "8px", ml: 1 }}>
          <SortableLayerList
            layers={layer.children}
            selectedLayout={selectedLayout}
            selectedGrid={selectedGrid}
            onLayerSelect={onLayerSelect}
            currentLayoutId={currentLayoutId}
            currentLayoutIndex={currentLayoutIndex}
          />
        </AccordionDetails>
      )}
    </Accordion>
  );
}

function SortableLayerList({
  layers,
  selectedLayout,
  selectedGrid,
  onLayerSelect,
  parentLayoutId,
  parentLayoutIndex,
}) {
  const itemIds = React.useMemo(() => layers.map((l) => l.id), [layers]);
  return (
    <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
      {layers.map((layer) => (
        <SortableLayer
          key={layer.id}
          layer={layer}
          selectedLayout={selectedLayout}
          selectedGrid={selectedGrid}
          onLayerSelect={onLayerSelect}
          currentLayoutId={
            layer.name === "Container" ? layer.id : parentLayoutId
          }
          currentLayoutIndex={
            layer.name === "Container"
              ? layers.findIndex((l) => l.id === layer.id)
              : parentLayoutIndex
          }
        />
      ))}
    </SortableContext>
  );
}

const LeftMenu = () => {
  const dispatch = useDispatch();

  const {
    pages,
    currentPage,
    menuAnchorEl,
    selectedPageForMenu,
    selectedLayout,
    selectedGrid,
  } = useSelector((state) => state.layout);

  const menuRef = useRef(null);
  const menuHeight = useDynamicMenuHeight(menuRef);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleMenuOpen = (event, page) => {
    event.stopPropagation();
    dispatch(setMenuAnchorEl(event.currentTarget));
    dispatch(setSelectedPageForMenu(page));
  };

  const handleMenuClose = () => {
    dispatch(setMenuAnchorEl(null));
  };

  const handleDeletePageLocal = (pageIdToDelete) => {
    const page = pages.find((p) => p.id === pageIdToDelete);
    dispatch(
      showModal({
        title: `Delete ${page ? `"${page.name}"` : "Page"}`,
        content: "Apakah Anda yakin ingin menghapus halaman ini? Tindakan ini tidak dapat dibatalkan.",
        confirmAction: () => deletePage(pageIdToDelete),
        modalType: "delete",
      })
    );
    handleMenuClose();
  };

  const handleLayerSelect = useCallback(
    (layer, parentLayoutId = null, parentLayoutIndex = null) => {
      if (layer.name === "Container") {
        if (selectedLayout === layer.id) {
          dispatch(clearSelections());
        } else {
          dispatch(setSelectedLayout(layer.id));
          dispatch(setSelectedGrid(null));
          dispatch(setAtribut(null));
        }
      } else if (layer.name === "Layout") {
        dispatch(setSelectedLayout(parentLayoutId));
        dispatch(setSelectedGrid(layer));
        dispatch(setAtribut(layer.children?.[0] || null));
      } else {
        // Logic untuk memilih komponen di dalam grid jika diperlukan
      }
    },
    [dispatch, pages, currentPage, selectedLayout]
  );

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const activePage = pages.find((p) => p.id === currentPage);
      if (!activePage) return;

      const findLayerAndParent = (layouts, targetId, parent = null) => {
        for (let i = 0; i < layouts.length; i++) {
          const layout = layouts[i];
          if (layout.id === targetId)
            return { layer: layout, parent, index: i, siblings: layouts };
          if (layout.children?.length > 0) {
            const found = findLayerAndParent(layout.children, targetId, layout);
            if (found) return found;
          }
        }
        return null;
      };

      const activeInfo = findLayerAndParent(activePage.layouts, active.id);
      const overInfo = findLayerAndParent(activePage.layouts, over.id);

      if (
        !activeInfo ||
        !overInfo ||
        activeInfo.parent?.id !== overInfo.parent?.id
      ) {
        dispatch(
          showAlert("Can only reorder items at the same level", "warning")
        );
        return;
      }

      const reorderedSiblings = arrayMove(
        activeInfo.siblings,
        activeInfo.index,
        overInfo.index
      );

      dispatch({
        type: "UPDATE_LAYER_ORDER",
        payload: {
          pageId: currentPage,
          parentId: activeInfo.parent?.id || null,
          newOrder: reorderedSiblings,
        },
      });

      dispatch(showAlert("Layer order updated!", "success"));
    },
    [dispatch, currentPage, pages]
  );

  return (
    <Box
      ref={menuRef}
      sx={{
        width: 300,
        backgroundColor: COLOR.white_winter,
        borderRadius: BORDER_RADIUS,
        border: "1px solid #D9D9D9",
        flexShrink: 0,
        position: "sticky",
        top: "105px",
        height: menuHeight,
        overflowY: "auto",
        overflowX: "hidden",
        transition: "height 0.1s ease-out",
        "&::-webkit-scrollbar": { width: "8px" },
        "&::-webkit-scrollbar-track": { backgroundColor: "#f5f5f5" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#bdbdbd",
          borderRadius: BORDER_RADIUS,
          "&:hover": { backgroundColor: "#8d8d8d" },
        },
      }}
    >
      {/* Pages Section */}
      <Box sx={{ p: SPACING - 1 }}>
        <MenuPages
          anchorEl={menuAnchorEl}
          onClose={handleMenuClose}
          selectedPage={selectedPageForMenu}
          onDeletePage={handleDeletePageLocal}
        />
        <Box
          sx={{
            backgroundColor: COLOR.dark_gray,
            color: COLOR.white_ice,
            borderRadius: BORDER_RADIUS,
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
          <IconButton
            size="small"
            sx={{ color: COLOR.white }}
            onClick={() => dispatch(addPage())}
          >
            <AddIcon />
          </IconButton>
        </Box>
        <List sx={{ width: "100%", p: 0 }}>
          {pages.map((page) => (
            <ListItemButton
              key={page.id}
              selected={currentPage === page.id}
              onClick={() => dispatch(setCurrentPage(page.id))}
              sx={{ mb: 0.5, borderRadius: BORDER_RADIUS }}
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
                onClick={(e) => handleMenuOpen(e, page)}
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
        <Box
          sx={{
            backgroundColor: COLOR.dark_gray,
            color: COLOR.white_ice,
            borderRadius: BORDER_RADIUS,
            p: SPACING,
            mb: SPACING - 0.5,
            display: "flex",
          }}
        >
          <Typography variant="h6">Layers</Typography>
        </Box>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToParentElement]}
        >
          {currentPage &&
          pages.find((p) => p.id === currentPage)?.layouts.length > 0 ? (
            <SortableLayerList
              layers={pages.find((p) => p.id === currentPage).layouts}
              selectedLayout={selectedLayout}
              selectedGrid={selectedGrid}
              onLayerSelect={handleLayerSelect}
              parentLayoutId={null}
              parentLayoutIndex={null}
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
        <Box
          sx={{
            backgroundColor: COLOR.dark_gray,
            color: COLOR.white_ice,
            borderRadius: BORDER_RADIUS,
            p: SPACING,
            mb: SPACING - 0.5,
            display: "flex",
          }}
        >
          <Typography variant="h6">Components</Typography>
        </Box>
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
                borderRadius: BORDER_RADIUS,
                backgroundColor: COLOR.light_gray,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              },
            }}
          />
        </Box>
        <Box sx={{ px: 1, py: 0 }}>
          {SECTION_COMPONENTS.map((section, index) => (
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
                "&.Mui-expanded": { margin: 0 },
                p: 0,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  p: "2px 5px",
                  minHeight: "48px",
                  mb: 0.5,
                  borderRadius: BORDER_RADIUS,
                }}
              >
                <Typography
                  variant="button"
                  sx={{
                    color: COLOR.dark_gray,
                    textTransform: "none",
                    fontWeight: 500,
                  }}
                >
                  {section.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: "2px 2px", ml: SPACING }}>
                {section.title === "Widget" ? (
                  <Box>
                    {WIDGET_COMPONENTS.map((id) => (
                      <DraggableComponent key={id} id={id}>
                        <ListItemButton
                          sx={{
                            borderRadius: BORDER_RADIUS,
                            p: "15px 5px",
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
                  <Box sx={{ p: "15px 5px" }}>
                    <Typography
                      variant="body2"
                      sx={{ color: COLOR.medium_dark_gray, mb: 1 }}
                    >
                      Drag and drop these layout templates onto your page.
                    </Typography>
                    {LayoutTemplates.map((template) => (
                      <DraggableComponent key={template.id} id={template.id}>
                        <ListItemButton
                          sx={{
                            borderRadius: BORDER_RADIUS,
                            p: "15px 5px",
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
                                sx={{ color: COLOR.dark_gray, fontWeight: 500 }}
                              >
                                {template.name}
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      </DraggableComponent>
                    ))}
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      color: COLOR.medium_dark_gray,
                      p: SPACING,
                    }}
                  >
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
