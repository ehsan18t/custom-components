"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  cloneElement,
  forwardRef,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { tv, type VariantProps } from "tailwind-variants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

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
  /** Render tooltip in a portal to prevent clipping */
  usePortal?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      className,
      side = "top",
      content,
      delay = 300,
      animationDuration = 0.15,
      disabled = false,
      showArrow = true,
      usePortal = false,
      children,
      ...props
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isRendered, setIsRendered] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const prefersReducedMotion = useReducedMotion();
    const tooltipId = useId();

    // Mount check for portal
    useEffect(() => {
      setIsMounted(true);
    }, []);

    // Calculate tooltip position when using portal
    const updatePosition = useCallback(() => {
      if (!containerRef.current || !usePortal) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      let top = 0;
      let left = 0;

      switch (side) {
        case "top":
          top = rect.top + scrollY;
          left = rect.left + scrollX + rect.width / 2;
          break;
        case "bottom":
          top = rect.bottom + scrollY;
          left = rect.left + scrollX + rect.width / 2;
          break;
        case "left":
          top = rect.top + scrollY + rect.height / 2;
          left = rect.left + scrollX;
          break;
        case "right":
          top = rect.top + scrollY + rect.height / 2;
          left = rect.right + scrollX;
          break;
      }

      setTooltipPosition({ top, left });
    }, [side, usePortal]);

    // Handle mouse enter
    const handleMouseEnter = () => {
      if (disabled) return;
      timeoutRef.current = setTimeout(() => {
        setIsRendered(true);
        setIsVisible(true);
        updatePosition();
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
          prefersReducedMotion ? 0 : animationDuration * 1000,
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
            },
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
      { dependencies: [isVisible, isRendered, animationDuration] },
    );

    // Get arrow styles based on side
    const getArrowStyles = () => {
      const arrowBase = "absolute w-2 h-2 bg-popover border-border rotate-45";
      switch (side) {
        case "top":
          return cn(
            arrowBase,
            "-translate-x-1/2 bottom-0 left-1/2 translate-y-1/2 border-r border-b",
          );
        case "bottom":
          return cn(
            arrowBase,
            "-translate-x-1/2 -translate-y-1/2 top-0 left-1/2 border-t border-l",
          );
        case "left":
          return cn(
            arrowBase,
            "-translate-y-1/2 top-1/2 right-0 translate-x-1/2 border-t border-r",
          );
        case "right":
          return cn(
            arrowBase,
            "-translate-y-1/2 -translate-x-1/2 top-1/2 left-0 border-b border-l",
          );
        default:
          return cn(
            arrowBase,
            "-translate-x-1/2 bottom-0 left-1/2 translate-y-1/2 border-r border-b",
          );
      }
    };

    // Get portal-specific positioning classes
    const getPortalPositionStyles = () => {
      switch (side) {
        case "top":
          return "-translate-x-1/2 -translate-y-full -mt-2";
        case "bottom":
          return "-translate-x-1/2 mt-2";
        case "left":
          return "-translate-x-full -translate-y-1/2 -ml-2";
        case "right":
          return "-translate-y-1/2 ml-2";
        default:
          return "-translate-x-1/2 -translate-y-full -mt-2";
      }
    };

    // Clone children to add aria-describedby
    const childElement = isValidElement(children)
      ? cloneElement(children as ReactElement<{ "aria-describedby"?: string }>, {
          "aria-describedby": isVisible ? tooltipId : undefined,
        })
      : children;

    // Tooltip content element
    const tooltipContent = (
      <div
        ref={tooltipRef}
        id={tooltipId}
        className={cn(
          usePortal
            ? [
                "fixed z-50 px-2 py-1",
                "rounded-md bg-popover text-popover-foreground",
                "border border-border font-medium text-xs shadow-md",
                "pointer-events-none",
                getPortalPositionStyles(),
              ]
            : tooltipVariants({ side }),
        )}
        style={
          usePortal
            ? {
                top: tooltipPosition.top,
                left: tooltipPosition.left,
              }
            : undefined
        }
        role="tooltip"
      >
        {content}
        {showArrow && <span className={getArrowStyles()} aria-hidden="true" />}
      </div>
    );

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn("relative inline-block", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        {...props}
      >
        {childElement}

        {isRendered &&
          (usePortal && isMounted ? createPortal(tooltipContent, document.body) : tooltipContent)}
      </div>
    );
  },
);

Tooltip.displayName = "Tooltip";

export default Tooltip;
