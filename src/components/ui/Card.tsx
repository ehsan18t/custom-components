"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { forwardRef, useRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

// ============================================================================
// Variants
// ============================================================================

export const cardVariants = tv({
  slots: {
    root: [
      "rounded-lg border bg-card text-card-foreground",
      "transition-all duration-200",
    ],
    header: "flex flex-col space-y-1.5 p-6",
    title: "text-xl font-semibold leading-none tracking-tight",
    description: "text-sm text-muted-foreground",
    content: "p-6 pt-0",
    footer: "flex items-center p-6 pt-0",
  },
  variants: {
    variant: {
      default: {
        root: "border-border shadow-sm",
      },
      elevated: {
        root: "border-transparent shadow-md",
      },
      outline: {
        root: "border-border shadow-none",
      },
      filled: {
        root: "border-transparent bg-muted",
      },
      ghost: {
        root: "border-transparent bg-transparent shadow-none",
      },
    },
    interactive: {
      true: {
        root: "cursor-pointer hover:shadow-lg hover:border-primary/50",
      },
    },
    padding: {
      none: {
        header: "p-0",
        content: "p-0",
        footer: "p-0",
      },
      sm: {
        header: "p-4",
        content: "p-4 pt-0",
        footer: "p-4 pt-0",
      },
      md: {
        header: "p-6",
        content: "p-6 pt-0",
        footer: "p-6 pt-0",
      },
      lg: {
        header: "p-8",
        content: "p-8 pt-0",
        footer: "p-8 pt-0",
      },
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
  },
});

// ============================================================================
// Types
// ============================================================================

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** Enable GSAP hover animation */
  animated?: boolean;
  /** Hover scale (default: 1.02) */
  hoverScale?: number;
  /** Hover lift in pixels (default: 4) */
  hoverLift?: number;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
}

// ============================================================================
// Components
// ============================================================================

const { root, header, title, description, content, footer } = cardVariants();

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      interactive,
      padding,
      animated = false,
      hoverScale = 1.02,
      hoverLift = 4,
      children,
      ...props
    },
    ref
  ) => {
    const cardRef = useRef<HTMLDivElement>(null);

    // Merge refs
    const mergedRef = (node: HTMLDivElement) => {
      cardRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    // GSAP hover animation
    useGSAP(
      () => {
        if (!cardRef.current || !animated) return;

        const card = cardRef.current;

        const handleMouseEnter = () => {
          gsap.to(card, {
            scale: hoverScale,
            y: -hoverLift,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        card.addEventListener("mouseenter", handleMouseEnter);
        card.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          card.removeEventListener("mouseenter", handleMouseEnter);
          card.removeEventListener("mouseleave", handleMouseLeave);
        };
      },
      { dependencies: [animated, hoverScale, hoverLift] }
    );

    const styles = cardVariants({ variant, interactive, padding });

    return (
      <div ref={mergedRef} className={cn(styles.root(), className)} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, padding = "md", ...props }, ref) => {
    const styles = cardVariants({ padding });
    return (
      <div ref={ref} className={cn(styles.header(), className)} {...props} />
    );
  }
);

CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = "h3", ...props }, ref) => {
    return (
      <Component ref={ref} className={cn(title(), className)} {...props} />
    );
  }
);

CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p ref={ref} className={cn(description(), className)} {...props} />
    );
  }
);

CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, padding = "md", ...props }, ref) => {
    const styles = cardVariants({ padding });
    return (
      <div ref={ref} className={cn(styles.content(), className)} {...props} />
    );
  }
);

CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, padding = "md", ...props }, ref) => {
    const styles = cardVariants({ padding });
    return (
      <div ref={ref} className={cn(styles.footer(), className)} {...props} />
    );
  }
);

CardFooter.displayName = "CardFooter";

export default Card;
