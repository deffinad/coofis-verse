import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./pages/MainLayout"; // Layout utama dengan navbar
import DashboardPage from "./pages/dashboard/Dashboard"; // Halaman Dashboard
import LayoutPage from "./pages/layout/Index"; // Halaman Layout
import PublishedPage from "./pages/dashboard/PublishedPage"; 
import PreviewPage from "./pages/layout/PreviewPage"; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="dashboard/:pageId" element={<PublishedPage />} />
        <Route path="layout" element={<LayoutPage />} />
        <Route path="preview/:pageId" element={<PreviewPage />} />
      </Route>
    </Routes>
  );
}

export default App;
