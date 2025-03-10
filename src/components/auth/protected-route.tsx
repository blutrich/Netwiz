import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { hasPermission } from "../../lib/services/user-management";
import { UserRole } from "../ui/user-role-badge";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: UserRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const hasAccess = hasPermission(requiredRole);
  
  if (!hasAccess) {
    // Redirect to unauthorized page or dashboard with limited access
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
} 