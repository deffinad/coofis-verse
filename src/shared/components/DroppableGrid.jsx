import { Grid } from "@mui/material";
import PropTypes from "prop-types";
import { useDroppable } from "@dnd-kit/core";

const DroppableGrid = ({ id, children, onClick, selectedGrid }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <Grid
      ref={setNodeRef}
      sx={{
        border: isOver
          ? "2px solid blue"
          : selectedGrid?.id === id
            ? "1px solid green"
            : "1px dashed grey",
        padding: 1,
        minHeight: "50px",
        borderRadius: "10px",
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
