import { Routes, Route } from "react-router-dom";
import Rating from "./pages/Rating";

import Swapydynamic from "./pages/Swapydynamic";
function App() {
  return (
    <>
      <Routes>
        <Route path="/swapydynamic" element={<Swapydynamic />} />
        <Route path="/" element={<Rating />} />
      </Routes>
    </>
  );
}

export default App;
