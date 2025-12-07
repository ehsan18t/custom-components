"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

// ============================================================================
// Variants
// ============================================================================

export const badgeVariants = tv({
  base: [
    "inline-flex items-center justify-center gap-1",
    "font-medium whitespace-nowrap",
    "rounded-full transition-colors",
    "border",
  ],
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground border-transparent",
      secondary: "bg-secondary text-secondary-foreground border-transparent",
      destructive: "bg-destructive text-destructive-foreground border-transparent",
      success: "bg-success text-success-foreground border-transparent",
      warning: "bg-warning text-warning-foreground border-transparent",
      info: "bg-info text-info-foreground border-transparent",
      outline: "bg-transparent text-foreground border-border",
      ghost: "bg-muted text-muted-foreground border-transparent",
    },
    size: {
      sm: "h-5 px-2 text-[10px]",
      md: "h-6 px-2.5 text-xs",
      lg: "h-7 px-3 text-sm",
    },
    rounded: {
      full: "rounded-full",
      md: "rounded-md",
      sm: "rounded-sm",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
    rounded: "full",
  },
});

// ============================================================================
// Types
// ============================================================================

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Icon to show before text */
  leftIcon?: React.ReactNode;
  /** Icon to show after text */
  rightIcon?: React.ReactNode;
  /** Show dot indicator */
  dot?: boolean;
  /** Dot color (CSS color or Tailwind class) */
  dotColor?: string;
  /** Whether the badge can be removed */
  removable?: boolean;
  /** Callback when remove button is clicked */
  onRemove?: () => void;
}

// ============================================================================
// Component
// ============================================================================

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      leftIcon,
      rightIcon,
      dot,
      dotColor,
      removable,
      onRemove,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, rounded }), className)}
        {...props}
      >
        {/* Dot indicator */}
        {dot && (
          <span
            className={cn(
              "size-1.5 rounded-full",
              dotColor ? dotColor : "bg-current opacity-75"
            )}
          />
        )}

        {/* Left icon */}
        {leftIcon && <span className="[&_svg]:size-3">{leftIcon}</span>}

        {/* Content */}
        {children}

        {/* Right icon */}
        {rightIcon && <span className="[&_svg]:size-3">{rightIcon}</span>}

        {/* Remove button */}
        {removable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="ml-0.5 -mr-1 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Remove"
          >
            <CloseIcon className="size-3" />
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = "Badge";

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

export default Badge;
