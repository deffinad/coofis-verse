import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./pages/MainLayout"; // Layout utama dengan navbar
import DashboardPage from "./pages/dashboard/Dashboard"; // Halaman Dashboard
import LayoutPage from "./pages/layout/Index"; // Halaman Layout

function App() {
  return (
    <Routes>
      {/* Gunakan MainLayout sebagai pembungkus */}
      <Route path="/" element={<MainLayout />}>
        {/* Arahkan URL root ke /dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Definisikan halaman yang akan dirender di dalam MainLayout */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="layout" element={<LayoutPage />} />
      </Route>
    </Routes>
  );
}

export default App;