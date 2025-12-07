"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// ============================================================================
// Variants
// ============================================================================

export const modalVariants = tv({
  slots: {
    overlay: [
      "fixed inset-0 z-50 bg-black/50",
      "flex items-center justify-center p-4",
    ],
    content: [
      "relative w-full max-h-[90vh] overflow-auto",
      "rounded-lg border bg-background shadow-lg",
      "focus:outline-none",
    ],
    header: "flex flex-col space-y-1.5 p-6 pb-0",
    title: "text-lg font-semibold leading-none tracking-tight",
    description: "text-sm text-muted-foreground",
    body: "p-6",
    footer: "flex items-center justify-end gap-2 p-6 pt-0",
    closeButton: [
      "absolute right-4 top-4 rounded-sm opacity-70",
      "ring-offset-background transition-opacity",
      "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      "disabled:pointer-events-none",
    ],
  },
  variants: {
    size: {
      sm: {
        content: "max-w-sm",
      },
      md: {
        content: "max-w-md",
      },
      lg: {
        content: "max-w-lg",
      },
      xl: {
        content: "max-w-xl",
      },
      "2xl": {
        content: "max-w-2xl",
      },
      full: {
        content: "max-w-[95vw] max-h-[95vh]",
      },
    },
    centered: {
      true: {
        overlay: "items-center",
      },
      false: {
        overlay: "items-start pt-16",
      },
    },
  },
  defaultVariants: {
    size: "md",
    centered: true,
  },
});

// ============================================================================
// Types
// ============================================================================

export interface ModalProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof modalVariants> {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Whether clicking the overlay closes the modal */
  closeOnOverlayClick?: boolean;
  /** Whether pressing Escape closes the modal */
  closeOnEscape?: boolean;
  /** Whether to show the close button */
  showCloseButton?: boolean;
  /** Animation duration in seconds */
  animationDuration?: number;
  /** Custom overlay className */
  overlayClassName?: string;
  /** Modal title */
  title?: React.ReactNode;
  /** Modal description */
  description?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
}

// ============================================================================
// Component
// ============================================================================

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      className,
      overlayClassName,
      size,
      centered,
      open,
      onClose,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      animationDuration = 0.3,
      title,
      description,
      footer,
      children,
      ...props
    },
    ref
  ) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    // Merge refs
    const mergedRef = (node: HTMLDivElement) => {
      contentRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const styles = modalVariants({ size, centered });

    // Handle mount/unmount for portal
    useEffect(() => {
      setIsMounted(true);
    }, []);

    // Handle open/close state
    useEffect(() => {
      if (open) {
        setIsVisible(true);
        // Prevent body scroll
        document.body.style.overflow = "hidden";
      } else {
        // Delay unmount for exit animation
        const timer = setTimeout(
          () => setIsVisible(false),
          prefersReducedMotion ? 0 : animationDuration * 1000
        );
        document.body.style.overflow = "";
        return () => clearTimeout(timer);
      }

      return () => {
        document.body.style.overflow = "";
      };
    }, [open, animationDuration, prefersReducedMotion]);

    // GSAP animations
    useGSAP(
      () => {
        if (!overlayRef.current || !contentRef.current) return;
        if (prefersReducedMotion) return;

        const overlay = overlayRef.current;
        const content = contentRef.current;

        if (open) {
          // Enter animation
          gsap.fromTo(
            overlay,
            { opacity: 0 },
            { opacity: 1, duration: animationDuration, ease: "power2.out" }
          );
          gsap.fromTo(
            content,
            { opacity: 0, scale: 0.95, y: 20 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: animationDuration,
              ease: "power2.out",
            }
          );
        } else if (isVisible) {
          // Exit animation
          gsap.to(overlay, {
            opacity: 0,
            duration: animationDuration,
            ease: "power2.in",
          });
          gsap.to(content, {
            opacity: 0,
            scale: 0.95,
            y: 20,
            duration: animationDuration,
            ease: "power2.in",
          });
        }
      },
      { dependencies: [open, isVisible, animationDuration] }
    );

    // Handle overlay click
    const handleOverlayClick = useCallback(
      (e: MouseEvent) => {
        if (closeOnOverlayClick && e.target === overlayRef.current) {
          onClose();
        }
      },
      [closeOnOverlayClick, onClose]
    );

    // Handle escape key
    useEffect(() => {
      if (!closeOnEscape || !open) return;

      const handleKeyDown = (e: globalThis.KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [closeOnEscape, open, onClose]);

    // Focus trap - focus content on open
    useEffect(() => {
      if (open && contentRef.current) {
        contentRef.current.focus();
      }
    }, [open]);

    if (!isMounted || !isVisible) return null;

    return createPortal(
      <div
        ref={overlayRef}
        className={cn(styles.overlay(), overlayClassName)}
        onClick={handleOverlayClick}
        aria-modal="true"
        role="dialog"
      >
        <div
          ref={mergedRef}
          className={cn(styles.content(), className)}
          tabIndex={-1}
          {...props}
        >
          {/* Close button */}
          {showCloseButton && (
            <button
              type="button"
              className={styles.closeButton()}
              onClick={onClose}
              aria-label="Close modal"
            >
              <CloseIcon className="size-4" />
            </button>
          )}

          {/* Header */}
          {(title || description) && (
            <div className={styles.header()}>
              {title && <h2 className={styles.title()}>{title}</h2>}
              {description && (
                <p className={styles.description()}>{description}</p>
              )}
            </div>
          )}

          {/* Body */}
          <div className={styles.body()}>{children}</div>

          {/* Footer */}
          {footer && <div className={styles.footer()}>{footer}</div>}
        </div>
      </div>,
      document.body
    );
  }
);

Modal.displayName = "Modal";

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

export default Modal;
