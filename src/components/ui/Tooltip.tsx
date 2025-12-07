"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// ============================================================================
// Variants
// ============================================================================

export const tooltipVariants = tv({
  base: [
    "absolute z-50 px-2 py-1",
    "rounded-md bg-popover text-popover-foreground",
    "text-xs font-medium shadow-md border border-border",
    "pointer-events-none",
  ],
  variants: {
    side: {
      top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
      left: "right-full top-1/2 -translate-y-1/2 mr-2",
      right: "left-full top-1/2 -translate-y-1/2 ml-2",
    },
  },
  defaultVariants: {
    side: "top",
  },
});

// ============================================================================
// Types
// ============================================================================

export interface TooltipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "content">,
    VariantProps<typeof tooltipVariants> {
  /** Tooltip content */
  content: ReactNode;
  /** Delay before showing tooltip (ms) */
  delay?: number;
  /** Animation duration in seconds */
  animationDuration?: number;
  /** Whether the tooltip is disabled */
  disabled?: boolean;
  /** Whether to show arrow */
  showArrow?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      className,
      side,
      content,
      delay = 300,
      animationDuration = 0.15,
      disabled = false,
      showArrow = true,
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isRendered, setIsRendered] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const prefersReducedMotion = useReducedMotion();

    // Handle mouse enter
    const handleMouseEnter = () => {
      if (disabled) return;
      timeoutRef.current = setTimeout(() => {
        setIsRendered(true);
        setIsVisible(true);
      }, delay);
    };

    // Handle mouse leave
    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(false);
    };

    // Clean up timeout on unmount
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    // Handle unmount after animation
    useEffect(() => {
      if (!isVisible && isRendered) {
        const timer = setTimeout(
          () => setIsRendered(false),
          prefersReducedMotion ? 0 : animationDuration * 1000
        );
        return () => clearTimeout(timer);
      }
    }, [isVisible, isRendered, animationDuration, prefersReducedMotion]);

    // GSAP animation
    useGSAP(
      () => {
        if (!tooltipRef.current || prefersReducedMotion) return;

        if (isVisible) {
          gsap.fromTo(
            tooltipRef.current,
            { opacity: 0, scale: 0.9 },
            {
              opacity: 1,
              scale: 1,
              duration: animationDuration,
              ease: "power2.out",
            }
          );
        } else if (isRendered) {
          gsap.to(tooltipRef.current, {
            opacity: 0,
            scale: 0.9,
            duration: animationDuration,
            ease: "power2.in",
          });
        }
      },
      { dependencies: [isVisible, isRendered, animationDuration] }
    );

    // Get arrow styles based on side
    const getArrowStyles = () => {
      const arrowBase = "absolute w-2 h-2 bg-popover border-border rotate-45";
      switch (side) {
        case "top":
          return cn(arrowBase, "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-b border-r");
        case "bottom":
          return cn(arrowBase, "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-t border-l");
        case "left":
          return cn(arrowBase, "right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-t border-r");
        case "right":
          return cn(arrowBase, "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 border-b border-l");
        default:
          return cn(arrowBase, "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-b border-r");
      }
    };

    return (
      <div
        ref={ref}
        className={cn("relative inline-block", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        {...props}
      >
        {children}

        {isRendered && (
          <div
            ref={tooltipRef}
            className={cn(tooltipVariants({ side }))}
            role="tooltip"
          >
            {content}
            {showArrow && <span className={getArrowStyles()} />}
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";

export default Tooltip;
