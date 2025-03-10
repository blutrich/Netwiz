import { cn } from "../../lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
    >
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <ellipse cx="16" cy="16" rx="14" ry="8" stroke="currentColor" strokeWidth="1.5" fill="none" transform="rotate(30 16 16)"/>
      <ellipse cx="16" cy="16" rx="14" ry="8" stroke="currentColor" strokeWidth="1.5" fill="none" transform="rotate(-30 16 16)"/>
      <circle cx="16" cy="6" r="1.5" fill="currentColor"/>
      <circle cx="22" cy="8" r="1.5" fill="currentColor"/>
      <circle cx="26" cy="16" r="1.5" fill="currentColor"/>
      <circle cx="22" cy="24" r="1.5" fill="currentColor"/>
      <circle cx="16" cy="26" r="1.5" fill="currentColor"/>
      <circle cx="10" cy="24" r="1.5" fill="currentColor"/>
      <circle cx="6" cy="16" r="1.5" fill="currentColor"/>
      <circle cx="10" cy="8" r="1.5" fill="currentColor"/>
      <circle cx="19" cy="12" r="1.5" fill="currentColor"/>
      <circle cx="13" cy="20" r="1.5" fill="currentColor"/>
    </svg>
  );
} 