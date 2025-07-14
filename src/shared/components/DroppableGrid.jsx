import { Grid } from "@mui/material";
import PropTypes from "prop-types";
import { useDroppable } from "@dnd-kit/core";
import React from "react";

const DroppableGrid = ({ id, children, onClick, selectedGrid }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const childrenArray = React.Children.toArray(children);
  const hasComponent =
    childrenArray.length > 0 &&
    !(
      childrenArray.length === 1 &&
      childrenArray[0].type === "p" &&
      childrenArray[0].props.children === "Empty Grid"
    );

  return (
    <Grid
      ref={setNodeRef}
      sx={{
        border: isOver
          ? hasComponent
            ? "2px solid red" 
            : "2px solid blue" 
          : selectedGrid?.id === id
          ? "1px solid green"
          : hasComponent
          ? "1px solid orange" 
          : "1px dashed grey", 
        padding: 1,
        width:"inherit",
        minHeight: "50px",
        borderRadius: "10px",
        backgroundColor:
          hasComponent && isOver ? "rgba(255, 0, 0, 0.1)" : "transparent",
        opacity: hasComponent && isOver ? 0.7 : 1,
      }}
      data-swapy-item={id}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick(id);
      }}
    >
      {children}
    </Grid>
  );
};

DroppableGrid.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func,
  selectedGrid: PropTypes.any,
};

export default DroppableGrid;
