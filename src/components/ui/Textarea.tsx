"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  type ChangeEvent,
  type FocusEvent,
  forwardRef,
  type TextareaHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

// ============================================================================
// Variants
// ============================================================================

export const textareaVariants = tv({
  base: [
    "peer w-full bg-transparent px-3 py-2.5",
    "text-sm text-foreground placeholder:text-muted-foreground/60",
    "transition-all duration-200 ease-out",
    "focus:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "resize-y min-h-[100px]",
  ],
  variants: {
    variant: {
      default: "",
      filled: "",
      flushed: "px-0",
      unstyled: "p-0",
    },
    resize: {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    },
  },
  defaultVariants: {
    variant: "default",
    resize: "vertical",
  },
});

// Container styles with Aceternity-inspired shadows (matching Input)
const containerVariants = tv({
  base: [
    "group relative flex",
    "rounded-lg border bg-background",
    "transition-all duration-200 ease-out",
    "shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]",
    "dark:shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.3),0px_1px_0px_0px_rgba(0,0,0,0.1),0px_0px_0px_1px_rgba(255,255,255,0.06)]",
    "has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed",
  ],
  variants: {
    variant: {
      default: [
        "border-transparent",
        "hover:shadow-[0px_3px_6px_-2px_rgba(0,0,0,0.12),0px_2px_4px_0px_rgba(25,28,33,0.04),0px_0px_0px_1px_rgba(25,28,33,0.12)]",
        "focus-within:shadow-[0px_0px_0px_2px_rgba(var(--primary-rgb),0.2),0px_2px_4px_0px_rgba(var(--primary-rgb),0.1)]",
        "focus-within:border-primary",
      ],
      filled: [
        "border-transparent bg-muted/50",
        "hover:bg-muted/70",
        "focus-within:bg-background focus-within:border-primary",
        "focus-within:shadow-[0px_0px_0px_2px_rgba(var(--primary-rgb),0.2)]",
      ],
      flushed: [
        "rounded-none border-x-0 border-t-0 border-b-2 border-border bg-transparent shadow-none",
        "hover:border-muted-foreground/50 hover:shadow-none",
        "focus-within:border-primary focus-within:shadow-none",
      ],
      unstyled: "border-none bg-transparent shadow-none hover:shadow-none focus-within:shadow-none",
    },
    state: {
      default: "",
      error: [
        "border-destructive",
        "shadow-[0px_0px_0px_1px_rgba(var(--destructive-rgb),0.3)]",
        "focus-within:shadow-[0px_0px_0px_2px_rgba(var(--destructive-rgb),0.2)]",
      ],
      success: [
        "border-success",
        "shadow-[0px_0px_0px_1px_rgba(var(--success-rgb),0.3)]",
        "focus-within:shadow-[0px_0px_0px_2px_rgba(var(--success-rgb),0.2)]",
      ],
      warning: [
        "border-warning",
        "shadow-[0px_0px_0px_1px_rgba(var(--warning-rgb),0.3)]",
        "focus-within:shadow-[0px_0px_0px_2px_rgba(var(--warning-rgb),0.2)]",
      ],
    },
  },
  defaultVariants: {
    variant: "default",
    state: "default",
  },
});

// Floating label styles (matching Input)
const labelVariants = tv({
  base: [
    "absolute pointer-events-none select-none",
    "text-muted-foreground",
    "transition-all duration-200 ease-out",
    "origin-left",
  ],
  variants: {
    isFloating: {
      true: "-top-2.5 left-2 scale-75 bg-background px-1 text-xs",
      false: "top-3 left-3 scale-100",
    },
  },
  defaultVariants: {
    isFloating: false,
  },
});

// ============================================================================
// Types
// ============================================================================

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  /** Error message to display */
  error?: string;
  /** Helper text to display below textarea */
  helperText?: string;
  /** Label for the textarea */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Container className */
  containerClassName?: string;
  /** Show character count */
  showCount?: boolean;
  /** Maximum character count */
  maxLength?: number;
  /** Auto-resize textarea based on content */
  autoResize?: boolean;
  /** Minimum rows when auto-resizing */
  minRows?: number;
  /** Maximum rows when auto-resizing */
  maxRows?: number;
  /** Use floating label style */
  floatingLabel?: boolean;
  /** Validation state */
  state?: "default" | "error" | "success" | "warning";
  /** Full width */
  fullWidth?: boolean;
  /** Animate shake on error */
  animateOnError?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      containerClassName,
      variant = "default",
      resize,
      error,
      helperText,
      label,
      required,
      showCount,
      maxLength,
      disabled,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      id,
      autoResize = false,
      minRows = 3,
      maxRows = 10,
      floatingLabel = false,
      state,
      fullWidth = true,
      animateOnError = true,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const [isFocused, setIsFocused] = useState(false);
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;
    const prevErrorRef = useRef<string | undefined>(error);

    // Determine if controlled or uncontrolled
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const hasValue = currentValue !== "" && currentValue !== undefined;

    // Derive state from error
    const derivedState = error ? "error" : state;

    // Label should float when focused or has value
    const isLabelFloated = isFocused || hasValue;

    // Auto-resize function
    const resizeTextarea = () => {
      if (!autoResize || !textareaRef.current) return;

      const textarea = textareaRef.current;
      const computedStyle = window.getComputedStyle(textarea);
      const lineHeight = Number.parseInt(computedStyle.lineHeight, 10) || 20;
      const paddingTop = Number.parseInt(computedStyle.paddingTop, 10) || 0;
      const paddingBottom = Number.parseInt(computedStyle.paddingBottom, 10) || 0;
      const borderTop = Number.parseInt(computedStyle.borderTopWidth, 10) || 0;
      const borderBottom = Number.parseInt(computedStyle.borderBottomWidth, 10) || 0;

      const minHeight =
        lineHeight * minRows + paddingTop + paddingBottom + borderTop + borderBottom;
      const maxHeight =
        lineHeight * maxRows + paddingTop + paddingBottom + borderTop + borderBottom;

      // Reset height to measure scrollHeight
      textarea.style.height = "auto";

      // Calculate new height
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;

      // Show scrollbar if content exceeds maxHeight
      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    };

    // Initial resize on mount
    useEffect(() => {
      resizeTextarea();
    });

    // Handle onChange with resize
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
      resizeTextarea();
    };

    // Handle focus
    const handleFocus = (e: FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    // Handle blur
    const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    // Shake animation on error
    useGSAP(
      () => {
        if (!containerRef.current || !animateOnError) return;

        if (error && !prevErrorRef.current) {
          gsap.to(containerRef.current, {
            keyframes: [
              { x: -6, duration: 0.05 },
              { x: 6, duration: 0.05 },
              { x: -4, duration: 0.05 },
              { x: 4, duration: 0.05 },
              { x: -2, duration: 0.05 },
              { x: 2, duration: 0.05 },
              { x: 0, duration: 0.05 },
            ],
            ease: "power2.out",
          });
        }
        prevErrorRef.current = error;
      },
      { dependencies: [error, animateOnError] },
    );

    const textareaId = id || props.name;
    const charCount = typeof currentValue === "string" ? currentValue.length : 0;

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {/* Non-floating label */}
        {label && !floatingLabel && (
          <label
            htmlFor={textareaId}
            className={cn("font-medium text-foreground text-sm", disabled && "opacity-50")}
          >
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </label>
        )}

        {/* Main textarea container */}
        <div
          ref={containerRef}
          className={cn(containerVariants({ variant, state: derivedState }), containerClassName)}
        >
          {/* Textarea element */}
          <textarea
            ref={textareaRef}
            id={textareaId}
            disabled={disabled}
            value={isControlled ? value : undefined}
            defaultValue={!isControlled ? defaultValue : undefined}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            maxLength={maxLength}
            placeholder={floatingLabel && label ? " " : props.placeholder}
            className={cn(
              textareaVariants({
                variant,
                resize: autoResize ? "none" : resize,
              }),
              className,
            )}
            aria-invalid={derivedState === "error"}
            aria-describedby={
              error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
            }
            {...props}
          />

          {/* Floating label */}
          {floatingLabel && label && (
            <label
              htmlFor={textareaId}
              className={cn(
                labelVariants({ isFloating: isLabelFloated }),
                isLabelFloated &&
                  (derivedState === "error"
                    ? "text-destructive"
                    : derivedState === "success"
                      ? "text-success"
                      : derivedState === "warning"
                        ? "text-warning"
                        : "text-primary"),
                disabled && "opacity-50",
              )}
            >
              {label}
              {required && <span className="ml-0.5 text-destructive">*</span>}
            </label>
          )}

          {/* Animated underline for flushed variant */}
          {variant === "flushed" && (
            <span
              className={cn(
                "-translate-x-1/2 absolute bottom-0 left-1/2 h-0.5 w-0",
                "bg-primary transition-all duration-300 ease-out",
                isFocused && "w-full",
                derivedState === "error" && "bg-destructive",
                derivedState === "success" && "bg-success",
              )}
            />
          )}
        </div>

        {/* Footer: Error/Helper text and character count */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {error && (
              <p
                id={`${textareaId}-error`}
                className="fade-in slide-in-from-top-1 animate-in text-destructive text-xs duration-200"
              >
                {error}
              </p>
            )}
            {!error && helperText && (
              <p id={`${textareaId}-helper`} className="text-muted-foreground text-xs">
                {helperText}
              </p>
            )}
          </div>

          {/* Character count with color gradient */}
          {showCount && maxLength && (
            <span
              className={cn(
                "text-xs tabular-nums transition-colors duration-200",
                charCount > maxLength * 0.9
                  ? "text-destructive"
                  : charCount > maxLength * 0.7
                    ? "text-warning"
                    : "text-muted-foreground",
              )}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
