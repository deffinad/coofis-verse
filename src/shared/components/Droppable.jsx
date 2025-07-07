import PropTypes from "prop-types";
import { useDroppable } from "@dnd-kit/core";
import { Box } from "@mui/material";

const Droppable = ({ id, children, onClick, selectedLayout }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <Box
      ref={setNodeRef}
      sx={{
        border: isOver
          ? "2px solid blue"
          : selectedLayout?.id === id
            ? "1px solid green"
            : "1px dashed grey",
        borderRadius: "10px",
        height: '100%',
        boxShadow:
          selectedLayout?.id === id
            ? "0px 4px 10px rgba(0, 128, 0, 0.5)"
            : "",
      }}
      data-swapy-item={id}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
    >
      {children}
    </Box>
  );
};

Droppable.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func,
  selectedLayout: PropTypes.any,
};

export default Droppable;
