import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/main-layout";
import { DashboardPage } from "./pages/dashboard";
import { CommunityPage } from "./pages/community";
import { RequestsPage } from "./pages/requests";
import { AnalyticsPage } from "./pages/analytics";
import { SettingsPage } from "./pages/settings";
import { LandingPage } from "./pages/landing";
import { LoginPage } from "./pages/login";
import { UsersPage } from "./pages/users";
import { UnauthorizedPage } from "./pages/unauthorized";
import { ProtectedRoute } from "./components/auth/protected-route";
import { ShareExpertFormPage } from "./pages/share-expert-form";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* Dashboard and other app pages */}
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          
          {/* Viewer access */}
          <Route path="community" element={
            <ProtectedRoute requiredRole="viewer">
              <CommunityPage />
            </ProtectedRoute>
          } />
          
          <Route path="requests" element={
            <ProtectedRoute requiredRole="viewer">
              <RequestsPage />
            </ProtectedRoute>
          } />
          
          {/* Manager access */}
          <Route path="analytics" element={
            <ProtectedRoute requiredRole="manager">
              <AnalyticsPage />
            </ProtectedRoute>
          } />
          
          {/* Admin access */}
          <Route path="settings" element={
            <ProtectedRoute requiredRole="admin">
              <SettingsPage />
            </ProtectedRoute>
          } />
          
          <Route path="users" element={
            <ProtectedRoute requiredRole="admin">
              <UsersPage />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Redirect legacy routes */}
        <Route path="/community" element={<Navigate to="/dashboard/community" replace />} />
        <Route path="/requests" element={<Navigate to="/dashboard/requests" replace />} />
        <Route path="/analytics" element={<Navigate to="/dashboard/analytics" replace />} />
        <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
        <Route path="/users" element={<Navigate to="/dashboard/users" replace />} />

        <Route path="/join-as-expert" element={<ShareExpertFormPage />} />
      </Routes>
      
      {/* Toast notifications */}
      <Toaster />
    </BrowserRouter>
  );
}

export default App; 