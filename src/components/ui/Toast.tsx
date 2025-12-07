"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// ============================================================================
// Variants
// ============================================================================

export const toastVariants = tv({
  base: [
    "pointer-events-auto relative flex w-full items-center gap-3",
    "overflow-hidden rounded-lg border p-4 shadow-lg",
    "transition-all",
  ],
  variants: {
    variant: {
      default: "bg-background border-border text-foreground",
      success: "bg-success/10 border-success/50 text-success",
      destructive: "bg-destructive/10 border-destructive/50 text-destructive",
      warning: "bg-warning/10 border-warning/50 text-warning",
      info: "bg-info/10 border-info/50 text-info",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

// ============================================================================
// Types
// ============================================================================

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "success" | "destructive" | "warning" | "info";
  duration?: number;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
  removeAll: () => void;
}

export interface ToastProviderProps {
  children: ReactNode;
  /** Default duration in ms */
  defaultDuration?: number;
  /** Maximum number of toasts to show */
  maxToasts?: number;
  /** Position of toast container */
  position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
}

export interface ToastProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  toast: Toast;
  onRemove: () => void;
  animationDuration?: number;
}

// ============================================================================
// Context
// ============================================================================

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// ============================================================================
// Provider
// ============================================================================

export function ToastProvider({
  children,
  defaultDuration = 5000,
  maxToasts = 5,
  position = "bottom-right",
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = {
        ...toast,
        id,
        duration: toast.duration ?? defaultDuration,
      };

      setToasts((prev) => {
        const updated = [newToast, ...prev];
        return updated.slice(0, maxToasts);
      });

      return id;
    },
    [defaultDuration, maxToasts]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const removeAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Position classes
  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, removeAll }}>
      {children}

      {/* Toast container */}
      {isMounted &&
        createPortal(
          <div
            className={cn(
              "fixed z-100 flex flex-col gap-2 w-full max-w-sm pointer-events-none",
              positionClasses[position]
            )}
            aria-live="polite"
            aria-label="Notifications"
          >
            {toasts.map((toast) => (
              <ToastItem
                key={toast.id}
                toast={toast}
                variant={toast.variant}
                onRemove={() => removeToast(toast.id)}
              />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

// ============================================================================
// Toast Item
// ============================================================================

const ToastItem = forwardRef<HTMLDivElement, ToastProps>(
  ({ toast, variant, onRemove, animationDuration = 0.3, className, ...props }, ref) => {
    const toastRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const [isExiting, setIsExiting] = useState(false);

    // Merge refs
    const mergedRef = (node: HTMLDivElement) => {
      toastRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    // Auto-dismiss
    useEffect(() => {
      if (!toast.duration || toast.duration === Infinity) return;

      const timer = setTimeout(() => {
        setIsExiting(true);
      }, toast.duration);

      return () => clearTimeout(timer);
    }, [toast.duration]);

    // Handle exit animation complete
    useEffect(() => {
      if (!isExiting) return;

      const timer = setTimeout(
        () => onRemove(),
        prefersReducedMotion ? 0 : animationDuration * 1000
      );

      return () => clearTimeout(timer);
    }, [isExiting, onRemove, animationDuration, prefersReducedMotion]);

    // GSAP animations
    useGSAP(
      () => {
        if (!toastRef.current || prefersReducedMotion) return;

        if (!isExiting) {
          // Enter animation
          gsap.fromTo(
            toastRef.current,
            { opacity: 0, x: 50, scale: 0.9 },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: animationDuration,
              ease: "power2.out",
            }
          );
        } else {
          // Exit animation
          gsap.to(toastRef.current, {
            opacity: 0,
            x: 50,
            scale: 0.9,
            duration: animationDuration,
            ease: "power2.in",
          });
        }
      },
      { dependencies: [isExiting, animationDuration] }
    );

    // Get icon based on variant
    const getIcon = () => {
      if (toast.icon) return toast.icon;

      switch (toast.variant) {
        case "success":
          return <CheckIcon className="size-5" />;
        case "destructive":
          return <XCircleIcon className="size-5" />;
        case "warning":
          return <AlertIcon className="size-5" />;
        case "info":
          return <InfoIcon className="size-5" />;
        default:
          return null;
      }
    };

    return (
      <div
        ref={mergedRef}
        className={cn(toastVariants({ variant }), className)}
        role="alert"
        {...props}
      >
        {/* Icon */}
        {getIcon() && <span className="shrink-0">{getIcon()}</span>}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="text-sm font-semibold">{toast.title}</p>
          )}
          {toast.description && (
            <p className="text-sm opacity-90">{toast.description}</p>
          )}
        </div>

        {/* Action */}
        {toast.action && (
          <button
            type="button"
            onClick={toast.action.onClick}
            className="shrink-0 text-sm font-medium underline-offset-4 hover:underline"
          >
            {toast.action.label}
          </button>
        )}

        {/* Close button */}
        <button
          type="button"
          onClick={() => setIsExiting(true)}
          className="shrink-0 rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <CloseIcon className="size-4" />
        </button>
      </div>
    );
  }
);

ToastItem.displayName = "ToastItem";

// ============================================================================
// Icons
// ============================================================================

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

export default ToastProvider;
