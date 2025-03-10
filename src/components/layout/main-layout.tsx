import React from "react";
import { Link, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  className?: string;
}

export function MainLayout({ className }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="bg-card w-64 border-r shadow-sm">
        <div className="p-4 h-14 border-b flex items-center">
          <h1 className="text-xl font-bold">NetWizBot</h1>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            <NavItem to="/" label="Dashboard" />
            <NavItem to="/community" label="Community Members" />
            <NavItem to="/requests" label="Requests" />
            <NavItem to="/analytics" label="Analytics" />
            <NavItem to="/settings" label="Settings" />
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className={cn("flex-1 flex flex-col", className)}>
        <header className="h-14 border-b flex items-center px-6 bg-card">
          <h2 className="text-lg font-medium">Admin Dashboard</h2>
        </header>
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
}

function NavItem({ to, label, icon }: NavItemProps) {
  return (
    <li>
      <Link
        to={to}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium"
      >
        {icon}
        {label}
      </Link>
    </li>
  );
} 