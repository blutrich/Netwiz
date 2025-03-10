import { useState, useEffect } from "react";

type ToastProps = {
  title: string;
  description?: string;
  variant?: "default" | "success" | "destructive";
};

// Global toast state
let toastQueue: ToastProps[] = [];
let listeners: ((toasts: ToastProps[]) => void)[] = [];

// Function to notify all listeners of toast changes
const notifyListeners = () => {
  listeners.forEach(listener => listener([...toastQueue]));
};

// Add a toast to the queue
export const toast = (props: ToastProps) => {
  toastQueue.push(props);
  notifyListeners();
  
  // Auto-remove toast after 3 seconds
  setTimeout(() => {
    toastQueue = toastQueue.filter(t => t !== props);
    notifyListeners();
  }, 3000);
};

// Hook to subscribe to toast updates
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  
  useEffect(() => {
    const handleToastsChange = (newToasts: ToastProps[]) => {
      setToasts(newToasts);
    };
    
    listeners.push(handleToastsChange);
    handleToastsChange([...toastQueue]); // Initial state
    
    return () => {
      listeners = listeners.filter(l => l !== handleToastsChange);
    };
  }, []);
  
  return { toasts };
};

// Toast component
export const ToastContainer = () => {
  const { toasts } = useToast();
  
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast, index) => (
        <div 
          key={index}
          className={`
            p-4 rounded-md shadow-lg border max-w-md animate-in fade-in slide-in-from-bottom-5
            ${toast.variant === 'success' ? 'bg-green-50 border-green-200 text-green-900' : 
              toast.variant === 'destructive' ? 'bg-red-50 border-red-200 text-red-900' : 
              'bg-white border-gray-200 text-gray-900'}
          `}
        >
          {toast.title && <div className="font-medium">{toast.title}</div>}
          {toast.description && <div className="text-sm mt-1">{toast.description}</div>}
        </div>
      ))}
    </div>
  );
}; 