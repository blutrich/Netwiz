import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Logo } from "../ui/logo";
import { FullLogo } from "../ui/full-logo";
import { UserRoleBadge } from "../ui/user-role-badge";
import { getCurrentUser, hasPermission, logoutUser } from "../../lib/services/user-management";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";

interface MainLayoutProps {
  className?: string;
}

export function MainLayout({ className }: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Get the current page title based on the route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/dashboard/') return 'Dashboard';
    if (path.includes('/dashboard/community')) return 'Community Members';
    if (path.includes('/dashboard/requests')) return 'Requests';
    if (path.includes('/dashboard/analytics')) return 'Analytics';
    if (path.includes('/dashboard/settings')) return 'Settings';
    if (path.includes('/dashboard/users')) return 'User Management';
    return 'Admin Dashboard';
  };

  // Refresh current user when location changes
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      // Redirect to login if no user is logged in
      navigate('/login');
      return;
    }
    setCurrentUser(user);
  }, [location, navigate]);

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="bg-card w-64 border-r shadow-sm hidden md:block">
        <div className="p-4 h-16 border-b flex items-center">
          <FullLogo size={28} />
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            <NavItem 
              to="/dashboard" 
              label="Dashboard" 
              active={location.pathname === '/dashboard' || location.pathname === '/dashboard/'} 
            />
            <NavItem 
              to="/dashboard/community" 
              label="Community Members" 
              active={location.pathname.includes('/dashboard/community')} 
            />
            <NavItem 
              to="/dashboard/requests" 
              label="Requests" 
              active={location.pathname.includes('/dashboard/requests')} 
            />
            
            {/* Manager+ only */}
            {hasPermission('manager') && (
              <NavItem 
                to="/dashboard/analytics" 
                label="Analytics" 
                active={location.pathname.includes('/dashboard/analytics')} 
              />
            )}
            
            {/* Admin only */}
            {hasPermission('admin') && (
              <>
                <NavItem 
                  to="/dashboard/settings" 
                  label="Settings" 
                  active={location.pathname.includes('/dashboard/settings')} 
                />
                <NavItem 
                  to="/dashboard/users" 
                  label="User Management" 
                  active={location.pathname.includes('/dashboard/users')} 
                />
              </>
            )}
          </ul>
          
          {/* Logout button at bottom of sidebar */}
          <div className="mt-auto pt-4 border-t mt-8">
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </Button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className={cn("flex-1 flex flex-col", className)}>
        <header className="h-16 border-b flex items-center justify-between px-6 bg-card">
          <div className="flex items-center">
            <div className="md:hidden mr-2">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md hover:bg-muted"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="md:hidden flex items-center">
              <FullLogo size={24} />
            </div>
            <h2 className="text-lg font-medium hidden md:block">{getPageTitle()}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </button>
            
            {currentUser && (
              <div className="relative">
                <div 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="hidden md:block text-right">
                    <div className="text-sm font-medium">{currentUser.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <UserRoleBadge role={currentUser.role} />
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                
                {/* User dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                    <div className="px-4 py-2 border-b">
                      <div className="text-sm font-medium">{currentUser.name}</div>
                      <div className="text-xs text-muted-foreground">{currentUser.email}</div>
                    </div>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      onClick={handleLogout}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b bg-card">
            <nav className="p-2">
              <ul className="space-y-1">
                <NavItem 
                  to="/dashboard" 
                  label="Dashboard" 
                  active={location.pathname === '/dashboard' || location.pathname === '/dashboard/'} 
                />
                <NavItem 
                  to="/dashboard/community" 
                  label="Community Members" 
                  active={location.pathname.includes('/dashboard/community')} 
                />
                <NavItem 
                  to="/dashboard/requests" 
                  label="Requests" 
                  active={location.pathname.includes('/dashboard/requests')} 
                />
                
                {/* Manager+ only */}
                {hasPermission('manager') && (
                  <NavItem 
                    to="/dashboard/analytics" 
                    label="Analytics" 
                    active={location.pathname.includes('/dashboard/analytics')} 
                  />
                )}
                
                {/* Admin only */}
                {hasPermission('admin') && (
                  <>
                    <NavItem 
                      to="/dashboard/settings" 
                      label="Settings" 
                      active={location.pathname.includes('/dashboard/settings')} 
                    />
                    <NavItem 
                      to="/dashboard/users" 
                      label="User Management" 
                      active={location.pathname.includes('/dashboard/users')} 
                    />
                  </>
                )}
                
                {/* Mobile logout button */}
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium w-full text-red-600 hover:bg-red-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}

        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

interface NavItemProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
}

function NavItem({ to, label, icon, active }: NavItemProps) {
  return (
    <li>
      <Link
        to={to}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium",
          active 
            ? "bg-blue-50 text-blue-600" 
            : "hover:bg-muted"
        )}
      >
        {icon}
        {label}
      </Link>
    </li>
  );
} 