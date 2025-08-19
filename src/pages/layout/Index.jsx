import React, { useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { createSwapy } from "swapy";
import { Box, Button } from "@mui/material";
import { generateRandomId } from "../../shared/utils/utility";

import EditorNavbar from "./EditorNavbar";
import LeftMenu from "./LeftMenu";
import MainContent from "./MainContent";
import RightMenu from "./RightMenu";
import AlertPopup from "../../shared/components/AlertPopup";
import { showAlert, hideAlert } from "../../redux/actions/alertActions";
import { componentAttributes } from "@/shared/constants/AppData";

// Redux Layout Actions
import {
  applyLayoutTemplate,
  clearSelections,
  setActiveId,
  addComponentToGrid,
  setFormData,
  setNewSize,
  setNewHeight,
} from "../../redux/actions/layoutActions";
import { fetchNavbarRoutes } from "../../redux/actions/navbarActions";

import { BORDER_RADIUS, COLOR, SPACING } from "@/shared/constants/AppConst";
import { LayoutTemplates } from "../../json/LayoutTemplates";

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { pages, currentPage, activeId, atribut, selectedGrid } = useSelector(
    (state) => state.layout
  );
  const alerts = useSelector((state) => state.alert.alerts);

  const layoutContainerRef = useRef(null);
  const containerRefs = useRef({});

  // Sensor configuration untuk DND
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Effects

  useEffect(() => {
    if (!currentPage) return;
    const activePage = pages.find((p) => p.id === currentPage);
    if (!activePage) return;

    activePage.layouts.forEach((layout) => {
      const containerEl = containerRefs.current[layout.id];
      if (!containerEl) return;
      if (containerEl.swapy?.destroy) {
        containerEl.swapy.destroy();
      }
      containerEl.swapy = createSwapy(containerEl);
    });

    return () => {
      activePage.layouts.forEach((layout) => {
        if (containerRefs.current[layout.id]?.swapy?.destroy) {
          containerRefs.current[layout.id].swapy.destroy();
        }
      });
    };
  }, [pages, currentPage, dispatch]);

  useEffect(() => {
    if (atribut) {
      dispatch(setFormData(atribut.properties || {}));
    } else {
      dispatch(setFormData({}));
    }
    if (selectedGrid?.properties) {
      const currentSize = selectedGrid.properties.size;
      if (typeof currentSize === "object" && currentSize !== null) {
        dispatch(setNewSize(currentSize));
      } else {
        dispatch(
          setNewSize({ desktop: currentSize || 12, tablet: 12, mobile: 12 })
        );
      }
      dispatch(setNewHeight(parseInt(selectedGrid.properties.height) || 0));
    }
  }, [atribut?.id, selectedGrid?.id, dispatch]);

  useEffect(() => {
    dispatch(clearSelections());
  }, [currentPage, dispatch]);

  const handleApplyLayoutTemplate = (templateLayout) => {
    dispatch(applyLayoutTemplate(templateLayout));
  };

  const handleCloseReduxAlert = useCallback(
    (id) => {
      dispatch(hideAlert(id));
    },
    [dispatch]
  );

  // Drag and drop handlers
  const handleDragStart = (event) => {
    dispatch(setActiveId(event.active.id));
  };

  const handleDragEnd = (event) => {
    dispatch(setActiveId(null));
    const { over, active } = event;

    if (!over || active.id === over.id) {
      return;
    }

    if (pages.length === 0 || !currentPage) {
      dispatch(showAlert("Cannot add component: No pages exist.", "warning"));
      return;
    }

    const draggedItemId = active.id;
    const dropTargetId = over.id;

    const isLayoutTemplate = LayoutTemplates.some(
      (template) => template.id === draggedItemId
    );

    if (isLayoutTemplate) {
      const templateToApply = LayoutTemplates.find(
        (template) => template.id === draggedItemId
      );
      if (templateToApply) {
        handleApplyLayoutTemplate(templateToApply.layout);
      }
      return;
    }

    const componentType = draggedItemId;

    let gridHasChild = false;
    const activePage = pages.find((p) => p.id === currentPage);

    if (!activePage) {
      dispatch(showAlert("Active page not found.", "error"));
      return;
    }

    const checkGrid = (layouts) => {
      for (const layout of layouts) {
        if (layout.id === dropTargetId && layout.children.length > 0) {
          gridHasChild = true;
          return;
        }
        if (layout.children) checkGrid(layout.children);
      }
    };

    activePage.layouts.forEach((l) => checkGrid([l]));

    if (gridHasChild) {
      dispatch(
        showAlert(
          "This grid already contains a component. Only one component is allowed per grid.",
          "warning"
        )
      );
      return;
    }

    const newComponent = componentAttributes[componentType] || {
      ...componentAttributes[componentType],
      id: `${componentType}-${generateRandomId()}`,
      name: componentType,
      properties: {
        ...componentAttributes[componentType]?.properties,
      },
    };

    dispatch(addComponentToGrid(dropTargetId, newComponent));
  };

  const handlePreview = () => {
    if (currentPage) {
      navigate(`/layout/preview/${currentPage}`);
    } else {
      dispatch(showAlert("Please select a page to preview.", "warning"));
    }
  };

  const handlePublish = () => {
    if (!currentPage) {
      dispatch(showAlert("Please select a page to publish.", "warning"));
      return;
    }
    dispatch({ type: "PUBLISH_PAGE", payload: { pages, currentPage } });
    dispatch(showAlert("Page published successfully!", "success"));
    dispatch(fetchNavbarRoutes());
  };

  console.log("Struktur JSON Pages:", JSON.stringify(pages, null, 2));


  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box
        ref={layoutContainerRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: COLOR.very_light_gray,
          position: "relative",
        }}
      >
        <EditorNavbar
          onPreview={handlePreview}
          onPublish={handlePublish}
          projectName={
            pages.find((p) => p.id === currentPage)?.name || "Untitled Project"
          }
          sx={{}}
        />
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            pt: 0,
            pr: SPACING,
            pb: SPACING,
            pl: SPACING,
            gap: SPACING + 1,
            justifyContent: "center",
          }}
        >
          <LeftMenu/>
          <MainContent
            containerRefs={containerRefs}
          />
          <RightMenu/>
        </Box>
      </Box>
      <DragOverlay>
        {activeId ? (
          <Button
            variant="outlined"
            sx={{
              backgroundColor: COLOR.white,
              color: "#1E1E1E",
              borderColor: "#2C2C2C",
              justifyContent: "flex-start",
              textTransform: "none",
              width: "100%",
              borderRadius: BORDER_RADIUS,
              p: SPACING,
              mb: SPACING - 0.5,
              cursor: "grabbing",
            }}
          >
            {activeId}
          </Button>
        ) : null}
      </DragOverlay>

      {alerts.map((alert) => (
        <AlertPopup
          key={alert.id}
          open={true}
          message={alert.message}
          severity={alert.type}
          onClose={() => handleCloseReduxAlert(alert.id)}
        />
      ))}
    </DndContext>
  );
};

export default Layout;
