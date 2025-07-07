import { useDraggable } from "@dnd-kit/core";
import PropTypes from 'prop-types'

const Draggable = ({ id, children }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

Draggable.propTypes = {
  id: PropTypes.any,
  children: PropTypes.node
}
export default Draggable;
