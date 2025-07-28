// File: DroppableGrid.jsx

import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import { COLOR, SPACING } from "../AppConst";

const DroppableGrid = ({
  id,
  children,
  onClick,
  selectedGrid,
  style,
  disabled = false,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id, disabled });

  const hasComponent = React.Children.toArray(children).some(
    (child) => !(child.type === "p" && child.props.children.includes("Empty"))
  );

  return (
    <Box
      ref={setNodeRef}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick(id);
      }}
      data-swapy-item={id}
      sx={{
        border: isOver
          ? `2px dashed ${COLOR.honolulu_blue}`
          : selectedGrid?.id === id
          ? `2px solid ${COLOR.green_malachite}`
          : "1px dashed grey",
        borderRadius: SPACING,
        minHeight: "50px",
        height: "100%",
        backgroundColor: isOver ? "rgba(29, 161, 242, 0.1)" : "transparent",
        transition: "border 0.2s ease, background-color 0.2s ease",
        ...style,
      }}
    >
      {children}
    </Box>
  );
};

DroppableGrid.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func,
  selectedGrid: PropTypes.object,
  style: PropTypes.object,
  disabled: PropTypes.bool,
};

export default DroppableGrid;
