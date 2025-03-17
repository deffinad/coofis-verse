import React from 'react';
import PropTypes from 'prop-types';
import {useDroppable} from '@dnd-kit/core';

export function Droppable({id, children}) {
  const {isOver, setNodeRef} = useDroppable({
    id: id,
  });
  const style = {
    border: isOver ? '3px solid green' : '3px dashed black',
  };
  
  return (
    <div ref={setNodeRef} style={{height: '100%', ...style}}>
      {children}
    </div>
  );
}

Droppable.propTypes = {
    id: PropTypes.any,
    children: PropTypes.node,
}