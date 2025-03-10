import * as React from "react"
import * as ReactDOM from "react-dom"
import { cn } from "../../lib/utils"

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "success" | "destructive"
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, title, description, action, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "fixed bottom-4 right-4 z-50 flex w-full max-w-md flex-col items-start gap-1 rounded-md border p-4 shadow-lg",
          variant === "default" && "bg-white text-gray-900 border-gray-200",
          variant === "success" && "bg-green-50 text-green-900 border-green-200",
          variant === "destructive" && "bg-red-50 text-red-900 border-red-200",
          className
        )}
        {...props}
      >
        {title && <div className="text-sm font-semibold">{title}</div>}
        {description && <div className="text-sm text-gray-500">{description}</div>}
        {action && <div className="mt-2">{action}</div>}
      </div>
    )
  }
)
Toast.displayName = "Toast"

export { Toast }

export function toast({ title, description, action, variant }: ToastProps) {
  const toastElement = document.createElement("div")
  document.body.appendChild(toastElement)
  
  const toastComponent = (
    <Toast
      title={title}
      description={description}
      action={action}
      variant={variant}
    />
  )
  
  // Render the toast
  ReactDOM.render(toastComponent, toastElement)
  
  // Remove the toast after 3 seconds
  setTimeout(() => {
    if (document.body.contains(toastElement)) {
      // Fade out animation
      toastElement.style.opacity = "0"
      toastElement.style.transition = "opacity 0.3s ease-out"
      
      // Remove from DOM after animation
      setTimeout(() => {
        if (document.body.contains(toastElement)) {
          ReactDOM.unmountComponentAtNode(toastElement)
          document.body.removeChild(toastElement)
        }
      }, 300)
    }
  }, 3000)
} 