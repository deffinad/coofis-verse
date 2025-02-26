/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Components } from "remoteApp/Components";
import { Stack } from "@mui/material";
import { Droppable } from "./Droppable";
import { Draggable } from "./Draggable";
import { DndContext } from "@dnd-kit/core";

function App() {
  const [ratingValue, setRatingValue] = useState(1);

  const handleDragEnd = (e) => {
  let {active} = e
  // console.log(active)
  console.log(e)
}

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Stack direction={'row'} spacing={1} height={'100vh'}>
        <Stack flex={1} direction={'column'} sx={{ height: '100%', border: '1px solid black' }}>
          <Draggable id="InputField">
            <Components.Input.InputField
              id={"rating"}
              name={"rating"}
              type={"number"}
              label={"Rating"}
              value={ratingValue}
              onChange={(e) => setRatingValue(e.target.value)}
            />
          </Draggable>
          <Draggable id='Rating'>
            <Components.Ratings value={ratingValue} />
          </Draggable>
        </Stack>
        <Stack flex={4} direction={'column'} sx={{ height: '100%', border: '1px solid black' }}>
          <Droppable id={'editor'}>
          </Droppable>
        </Stack>
      </Stack>
    </DndContext>
  );
}

export default App;

// import React, {useState} from 'react';
// import {DndContext} from '@dnd-kit/core';

// import {Droppable} from './Droppable';
// import {Draggable} from './Draggable';

// function App() {
//   const containers = ['A', 'B', 'C'];
//   const [parent, setParent] = useState(null);
//   const draggableMarkup = (
//     <Draggable id="draggable">Drag me</Draggable>
//   );

//   return (
//     <DndContext onDragEnd={handleDragEnd}>
//       {parent === null ? draggableMarkup : null}

//       {containers.map((id) => (
//         // We updated the Droppable component so it would accept an `id`
//         // prop and pass it to `useDroppable`
//         <Droppable key={id} id={id}>
//           {parent === id ? draggableMarkup : 'Drop here'}
//         </Droppable>
//       ))}
//     </DndContext>
//   );

//   function handleDragEnd(event) {
//     const {over} = event;

//     // If the item is dropped over a container, set it as the parent
//     // otherwise reset the parent to `null`
//     setParent(over ? over.id : null);
//   }
// };

// export default App
