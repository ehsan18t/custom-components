"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { forwardRef, useRef, type ButtonHTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

// ============================================================================
// Variants
// ============================================================================

export const buttonVariants = tv({
  base: [
    "inline-flex items-center justify-center gap-2",
    "font-medium whitespace-nowrap",
    "rounded-md transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      success: "bg-success text-success-foreground hover:bg-success/90",
      warning: "bg-warning text-warning-foreground hover:bg-warning/90",
      outline: "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    },
    size: {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
      xl: "h-14 px-8 text-lg",
      icon: "h-10 w-10",
      "icon-sm": "h-8 w-8",
      "icon-lg": "h-12 w-12",
    },
    fullWidth: {
      true: "w-full",
    },
    rounded: {
      default: "rounded-md",
      sm: "rounded-sm",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
    rounded: "default",
  },
});

// ============================================================================
// Types
// ============================================================================

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Show loading spinner */
  isLoading?: boolean;
  /** Loading text (replaces children when loading) */
  loadingText?: string;
  /** Icon to show before children */
  leftIcon?: React.ReactNode;
  /** Icon to show after children */
  rightIcon?: React.ReactNode;
  /** Enable GSAP hover animation */
  animated?: boolean;
  /** Animation scale on hover (0-1) */
  hoverScale?: number;
}

// ============================================================================
// Loading Spinner
// ============================================================================

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// ============================================================================
// Component
// ============================================================================

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      rounded,
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      animated = true,
      hoverScale = 1.02,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Merge refs
    const mergedRef = (node: HTMLButtonElement) => {
      buttonRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    // GSAP hover animation
    useGSAP(
      () => {
        if (!buttonRef.current || !animated || disabled || isLoading) return;

        const button = buttonRef.current;

        const handleMouseEnter = () => {
          gsap.to(button, {
            scale: hoverScale,
            duration: 0.2,
            ease: "power2.out",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out",
          });
        };

        const handleMouseDown = () => {
          gsap.to(button, {
            scale: 0.98,
            duration: 0.1,
            ease: "power2.out",
          });
        };

        const handleMouseUp = () => {
          gsap.to(button, {
            scale: hoverScale,
            duration: 0.1,
            ease: "power2.out",
          });
        };

        button.addEventListener("mouseenter", handleMouseEnter);
        button.addEventListener("mouseleave", handleMouseLeave);
        button.addEventListener("mousedown", handleMouseDown);
        button.addEventListener("mouseup", handleMouseUp);

        return () => {
          button.removeEventListener("mouseenter", handleMouseEnter);
          button.removeEventListener("mouseleave", handleMouseLeave);
          button.removeEventListener("mousedown", handleMouseDown);
          button.removeEventListener("mouseup", handleMouseUp);
        };
      },
      { dependencies: [animated, disabled, isLoading, hoverScale] }
    );

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={mergedRef}
        className={cn(
          buttonVariants({ variant, size, fullWidth, rounded }),
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner className="size-4" />
            {loadingText && <span>{loadingText}</span>}
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
