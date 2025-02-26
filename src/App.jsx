import { Routes, Route } from "react-router-dom";
import Rating from "./pages/Rating";

import Swapydynamic from "./pages/Swapydynamic";
import Swapylagi from "./pages/Swapylagi";
function App() {
  return (
    <>
      <Routes>
        <Route path="/swapydynamic" element={<Swapydynamic />} />
        <Route path="/swapylagi" element={<Swapylagi />} />
        <Route path="/rating" element={<Rating />} />
      </Routes>
    </>
  );
}

export default App;
