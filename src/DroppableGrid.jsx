import { useDroppable } from "@dnd-kit/core";
import { Grid } from "@mui/material";

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

export default DroppableGrid;
