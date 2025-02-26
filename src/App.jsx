import React, { useState } from "react";
import "./App.css";
// import { Components } from "remoteApp/Components";
import { DndContext } from "@dnd-kit/core";

const Draggable = React.lazy(() => import("remoteApp/Draggable"));
const Droppable = React.lazy(() => import("remoteApp/Droppable"));

function App() {
  // const [ratingValue, setRatingValue] = useState(1);

  const [parent, setParent] = useState(null);
  const draggable = (
    // <Draggable id={"draggable"}>Drag me</Draggable>
    <Draggable id={"draggable"}>Drag me</Draggable>
  )

  return (
    <>
      {/* <Components.Input.InputField
        id={"rating"}
        name={"rating"}
        label={"Rating"}
        value={ratingValue}
        type={"number"}
        onChange={(e) => setRatingValue(e.target.value)}
      />
      <Components.Ratings value={ratingValue} /> */}
      <DndContext onDragEnd={handleDragEnd}>
        {!parent ? draggable : null}
        {/* <Droppable id="droppable">
          {parent === "droppable" ? draggable : 'Drop here'}
        </Droppable> */}
        <Droppable id="droppable" >
          {parent === "droppable" ? draggable : 'Drop here'}
        </Droppable>
      </DndContext>
    </>
  );
  function handleDragEnd({over}) {
    setParent(over ? over.id : null);
  }
}

export default App;
