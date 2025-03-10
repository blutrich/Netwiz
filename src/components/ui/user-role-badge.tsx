import { cn } from "../../lib/utils";

export type UserRole = "admin" | "manager" | "viewer";

interface UserRoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        role === "admin" 
          ? "bg-purple-100 text-purple-800" 
          : role === "manager" 
            ? "bg-blue-100 text-blue-800" 
            : "bg-gray-100 text-gray-800",
        className
      )}
    >
      {role === "admin" 
        ? "Admin" 
        : role === "manager" 
          ? "Manager" 
          : "Viewer"}
    </span>
  );
} 