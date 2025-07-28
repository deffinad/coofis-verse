/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Routes, Route } from "react-router-dom";
import Layout from "./pages/layout/Index";
import Preview from "./pages/layout/Preview";

function App() {
  return (
    <Routes>
      <Route path="/layout" element={<Layout />} />
      <Route path="/preview" element={<Preview />} />
    </Routes>
  );
}

export default App;
