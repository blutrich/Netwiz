import { cn } from "../../lib/utils";
import { Logo } from "./logo";

interface FullLogoProps {
  className?: string;
  size?: number;
  darkMode?: boolean;
}

export function FullLogo({ className, size = 40, darkMode = false }: FullLogoProps) {
  const textColor = darkMode ? "text-white" : "text-[#0A2647]";
  
  return (
    <div className={cn("flex items-center", className)}>
      <Logo size={size} className="text-[#4DA3F5]" />
      <span 
        className={cn(
          "ml-3 font-bold text-3xl tracking-tight", 
          textColor
        )}
        style={{ fontSize: `${size * 0.8}px` }}
      >
        NetWiz
      </span>
    </div>
  );
} 