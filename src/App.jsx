/* eslint-disable no-unused-vars */
import { React, useEffect, useState, createElement } from "react";
import { Components } from "remoteApp/Components";
import { Stack } from "@mui/material";
import { Droppable } from "./Droppable";
import { Draggable } from "./Draggable";
import { DndContext } from "@dnd-kit/core";

function App() {
  const [ratingValue, setRatingValue] = useState(1);
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);

  useEffect(() => {
    // console.log("Selected Component:", components);
    // localStorage.setItem("componentsData", JSON.stringify(components));
    console.log(ratingValue);
    
  }, [ratingValue]);

  const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem("componentsData");
    return savedData ? JSON.parse(savedData) : [];
  };

  const handleDragEnd = (e) => {
    console.log(e);

    e.over !== null
      ? setComponents((prevComponents) => {
          // Buat nyari index parent
          const parentIndex = prevComponents.findIndex(
            (comp) => comp.idDroppable === e.over.id
          );

          if (parentIndex !== -1) {
            // Buat nambahin children kalau parent exist
            return prevComponents.map((comp, index) =>
              index === parentIndex
                ? {
                    ...comp,
                    component: {
                      idComponent: e.active.id,
                      name: e.active.id,
                      props: [
                        ...(e.active?.data?.current?.props || []),
                        {
                          id: "rating",
                          name: "rating",
                          type: "number",
                          label: "Rating",
                          value: ratingValue,
                          onChange: (e) => setRatingValue(e.target.value),
                        },
                      ],
                    },
                  }
                : comp
            );
          } else {
            // Kalau parent doesn't exist, buat parent baru
            return [
              ...prevComponents,
              {
                idDroppable: e.over.id,
                name: e.over.id || "Unknown",
                props: [],
                component: {
                  idComponent: e.active.id,
                  name: e.active.id || "Unnamed Component",
                  props: [
                    ...(e.active?.data?.current?.props || []),
                    {
                      id: "rating",
                      name: "rating",
                      type: "number",
                      label: "Rating",
                      value: ratingValue,
                      onChange: (e) => setRatingValue(e.target.value),
                    },
                  ],
                },
              },
            ];
          }
        })
      : null;
  };

  return (
    <DndContext onDragEnd={handleDragEnd} sx={{ bgColor: "black" }}>
      <Stack direction={"row"} spacing={1} height={"100vh"}>
        <Stack flex={1} direction={"column"} sx={{ height: "100%" }}>
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
          <Draggable id="Ratings">
            <Components.Ratings 
              value={ratingValue} 
            />
          </Draggable>
        </Stack>
        <Stack
          flex={4}
          spacing={2}
          direction={"column"}
          sx={{ height: "100%" }}
        >
          <Droppable id={"editor"}>
            {/* {components.length > 0
              ? components.map((compKey, index) =>
                  Components[compKey.component.idComponent] &&
                  compKey.idDroppable === "editor"
                    ? createElement(Components[compKey.component.idComponent], {
                        key: index,
                      })
                    : null
                )
              : "Drop here"} */}
            {components.length > 0 ? (
              components
                .filter(
                  (compKey) =>
                    Components[compKey.component.idComponent] &&
                    compKey.idDroppable === "editor"
                )
                .map((compKey, index) => {
                  const componentProps = compKey.component.props.reduce(
                    (acc, prop) => {
                      acc[prop.name] = prop.value;
                      return acc;
                    }
                  );
                  console.log("Component Props:", componentProps);
                  return createElement(
                    Components[compKey.component.idComponent],
                    {key: index, ...componentProps}
                  )
                })
            ) : (
              <div className="drop-placeholder">Drop here</div>
            )}
          </Droppable>

          <Droppable id={"editor2"}>
            {/* {components.length > 0 ? (components.map((compKey, index) =>
                Components[compKey.component.idComponent] && compKey.idDroppable === 'editor2'
                  ? createElement(Components[compKey.component.idComponent], 
                    { 
                      key: index,
                      ...compKey.component.props.reduce((acc, prop) => {
                        acc[prop.name] = prop.value;
                        return acc;
                      }, {}),
                    }) 
                  : null
              )
            ) : (
              "Drop here"
            )} */}
            {components.length > 0 ? (
              components
                .filter(
                  (compKey) =>
                    Components[compKey.component.idComponent] &&
                    compKey.idDroppable === "editor2"
                )
                .map((compKey, index) => {
                  // const componentProps = compKey.component.props.reduce(
                  //   (acc, prop) => {
                  //     acc[prop.name] = prop.value;
                  //     return acc;
                  //   }
                  // );
                  const baru = compKey.component.props;
                  console.log("Component Props:", compKey.component.props);
                  return createElement(
                    Components[compKey.component.idComponent],
                    {key: index, ...baru}
                  )
                })
            ) : (
              <div className="drop-placeholder">Drop here</div>
            )}
          </Droppable>
        </Stack>
        <Stack
          flex={1}
          direction={"column"}
          sx={{ height: "100%", border: "solid 2px black" }}
        >
          {components.length > 0 ? (components.map((compKey, index) =>
                Components[compKey.component.idComponent] && compKey.idDroppable === 'editor2'
                  ? "Hahah"
                  : null
              )
            ) : (
              "No Components"
            )}
        </Stack>
      </Stack>
    </DndContext>
  );
}

export default App;
