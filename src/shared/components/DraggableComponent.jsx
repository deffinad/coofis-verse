import { useDraggable } from "@dnd-kit/core";
import PropTypes from 'prop-types'

const DraggableComponent = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      {children}
    </div>
  );
};

DraggableComponent.propTypes = {
  id: PropTypes.any,
  children: PropTypes.node
}
export default DraggableComponent;
