import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/main-layout";
import { DashboardPage } from "./pages/dashboard";
import { CommunityPage } from "./pages/community";
import { RequestsPage } from "./pages/requests";
import { AnalyticsPage } from "./pages/analytics";
import { SettingsPage } from "./pages/settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App; 