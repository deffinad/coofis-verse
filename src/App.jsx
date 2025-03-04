import { Routes, Route } from "react-router-dom";
import Rating from "./pages/Rating";

import Swapydynamic from "./pages/Swapydynamic";
import Swapylagi from "./pages/Swapylagi";
import KocakLayout from "./pages/kocak";
import SwapyWithSideBar from "./pages/SwapyWithSideBar";
import SwapyWithSideBarV2 from "./pages/SwapyWithSideBarV2";
import SwapyWithSideBarv3 from "./pages/SwapyWithSideBarv3";
function App() {
  return (
    <>
      <Routes>
        <Route path="/swapydynamic" element={<Swapydynamic />} />
        <Route path="/swapysidebar" element={<SwapyWithSideBar />} />
        <Route path="/swapysidebarv2" element={<SwapyWithSideBarV2 />} />
        <Route path="/swapysidebarv3" element={<SwapyWithSideBarv3 />} />
        <Route path="/kocak" element={<KocakLayout />} />
        <Route path="/swapylagi" element={<Swapylagi />} />
        <Route path="/rating" element={<Rating />} />
      </Routes>
    </>
  );
}

export default App;
