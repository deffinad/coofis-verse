/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import {useDroppable} from '@dnd-kit/core';

export function Droppable({id, children}) {
  const {isOver, setNodeRef} = useDroppable({
    id: id,
  });
  const style = {
    border: isOver ? '1px solid green' : '1px dashed black',
  };
  
  return (
    <div ref={setNodeRef} style={{height: '100%',width: '100% !important', ...style}}>
      {children}
    </div>
  );
}

Droppable.propTypes = {
    id: PropTypes.any,
    children: PropTypes.node,
}