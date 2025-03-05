/* eslint-disable no-unused-vars */
import { React, useEffect, useState, createElement } from "react";
import { Components } from "remoteApp/Components";
import { Stack } from "@mui/material";
import { Droppable } from "./Droppable";
import { Draggable } from "./Draggable";
import { DndContext } from "@dnd-kit/core";

function App() {
  const [ratingValue, setRatingValue] = useState(1);
  // const [components, setComponents] = useState(() => loadFromLocalStorage("componentsData"));
  const [components, setComponents] = useState([]);

  useEffect(() => {
    console.log("Selected Component:", components);
    localStorage.setItem("componentsData", JSON.stringify(components));
  }, [components]);

  // const loadFromLocalStorage = () => {
  //   const savedData = localStorage.getItem("componentsData");
  //   return savedData ? JSON.parse(savedData) : [];
  // }

  const handleDragEnd = (e) => {
    console.log(e);
    
    e.over !== null
    ? setComponents((prevComponents) => {
      // Buat nyari index parent
      const parentIndex = prevComponents.findIndex(comp => comp.idDroppable === e.over.id);
    
      if (parentIndex !== -1) {
        // Buat nambahin children kalau parent exist
        return prevComponents.map((comp, index) =>
          index === parentIndex
            ? {
                ...comp,
                children: [
                  ...comp.children,
                  {
                    idDroppable: e.active.id,
                    name: e.active.id,
                    props: [{}],
                  },
                ],
              }
            : comp
        );
      } else {
        // Kalau parent doesn't exist, buat parent baru
        return [
          ...prevComponents,
          {
            idDroppable: e.over.id,
            name: e.over.id,
            props: [],
            children: [
              {
                idDroppable: e.active.id,
                name: e.active.id,
                props: [{}],
              },
            ],
          },
        ];
      }
      }) : null;
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Stack direction={'row'} spacing={1} height={'100vh'}>
        <Stack flex={1} direction={'column'} sx={{ height: '100%', border: '1px solid black' }}>
          <Draggable id="InputField">
            <Components.InputField
              id={"rating"}
              name={"rating"}
              type={"number"}
              label={"Rating"}
              value={ratingValue}
              onChange={(e) => setRatingValue(e.target.value)}
            />
          </Draggable>
          <Draggable id='Ratings'>
            <Components.Ratings value={ratingValue} />
          </Draggable>
        </Stack>
        <Stack flex={4} direction={'column'} sx={{ height: '100%', border: '1px solid black' }}>
          <Droppable id={'editor'} >
            {components.length > 0 ? (components.map((compKey, index) =>
                Components[compKey] 
                  ? createElement(Components[compKey], { key: index }) 
                  : null
              )
            ) : (
              "Drop here"
            )}
          </Droppable>
          
          <Droppable id={'editor2'} >
            {components.length > 0 ? (components.map((compKey, index) =>
                Components[compKey] 
                  ? createElement(Components[compKey], { key: index }) 
                  : null
              )
            ) : (
              "Drop here"
            )}
          </Droppable>
        </Stack>
      </Stack>
    </DndContext>
  );
}

export default App;