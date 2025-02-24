import { useState } from "react";
import "./App.css";
import { Components } from "remoteApp/Components";

function App() {
  const [ratingValue, setRatingValue] = useState(1);
  
  return (
    <>
      <Components.Input.InputField
        id={"rating"}
        name={"rating"}
        label={"Rating"}
        value={ratingValue}
        type={"number"}
        onChange={(e) => setRatingValue(e.target.value)}
      />
      <Components.Ratings value={ratingValue} />
    </>
  );
}

export default App;
