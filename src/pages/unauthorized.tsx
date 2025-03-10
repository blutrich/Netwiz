import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../lib/services/user-management";
import { UserRoleBadge } from "../components/ui/user-role-badge";

export function UnauthorizedPage() {
  const currentUser = getCurrentUser();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
        
        {currentUser && (
          <div className="p-4 border rounded-lg bg-muted/50">
            <p className="font-medium">Current User</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span>{currentUser.name}</span>
              <UserRoleBadge role={currentUser.role} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Your current role doesn't have sufficient permissions.
            </p>
          </div>
        )}
        
        <div className="flex flex-col gap-2">
          <Button asChild>
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 