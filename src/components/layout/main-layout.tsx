import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Logo } from "../ui/logo";
import { FullLogo } from "../ui/full-logo";

interface MainLayoutProps {
  className?: string;
}

export function MainLayout({ className }: MainLayoutProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get the current page title based on the route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/dashboard/') return 'Dashboard';
    if (path.includes('/dashboard/community')) return 'Community Members';
    if (path.includes('/dashboard/requests')) return 'Requests';
    if (path.includes('/dashboard/analytics')) return 'Analytics';
    if (path.includes('/dashboard/settings')) return 'Settings';
    return 'Admin Dashboard';
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
            <NavItem 
              to="/dashboard/analytics" 
              label="Analytics" 
              active={location.pathname.includes('/dashboard/analytics')} 
            />
            <NavItem 
              to="/dashboard/settings" 
              label="Settings" 
              active={location.pathname.includes('/dashboard/settings')} 
            />
          </ul>
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
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              A
            </div>
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
                <NavItem 
                  to="/dashboard/analytics" 
                  label="Analytics" 
                  active={location.pathname.includes('/dashboard/analytics')} 
                />
                <NavItem 
                  to="/dashboard/settings" 
                  label="Settings" 
                  active={location.pathname.includes('/dashboard/settings')} 
                />
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