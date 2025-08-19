import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./pages/MainLayout"; // Layout utama dengan navbar
import DashboardPage from "./pages/dashboard/Dashboard"; // Halaman Dashboard
import LayoutPage from "./pages/layout/Index"; // Halaman Layout
import PublishedPage from "./pages/dashboard/PublishedPage";
import PreviewPage from "./pages/layout/PreviewPage";
import CreatePortal from "./pages/dashboard/CreatePortal";
import ProfilePage from "./pages/profile/Index";
import AlertPopup from "./shared/components/AlertPopup";
import CustomModal from "./shared/components/Modal/Index";

function App() {
  return (
    <React.Fragment>
      <AlertPopup />
      <CustomModal />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="dashboard/:pageId" element={<PublishedPage />} />
          <Route path="dashboard/create-portal" element={<CreatePortal />} />
          <Route path="layout" element={<LayoutPage />} />
          <Route path="layout/preview/:pageId" element={<PreviewPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </React.Fragment>
  );
}

export default App;
