import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/main-layout";
import { DashboardPage } from "./pages/dashboard";
import { CommunityPage } from "./pages/community";
import { RequestsPage } from "./pages/requests";
import { AnalyticsPage } from "./pages/analytics";
import { SettingsPage } from "./pages/settings";
import { LandingPage } from "./pages/landing";
import { ToastContainer } from "./components/ui/use-toast";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Dashboard and other app pages */}
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        {/* Redirect legacy routes */}
        <Route path="/community" element={<Navigate to="/dashboard/community" replace />} />
        <Route path="/requests" element={<Navigate to="/dashboard/requests" replace />} />
        <Route path="/analytics" element={<Navigate to="/dashboard/analytics" replace />} />
        <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
      </Routes>
      
      {/* Toast notifications */}
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App; 