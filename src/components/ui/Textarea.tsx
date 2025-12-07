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
    "flex min-h-[100px] w-full rounded-lg border bg-background px-3 py-2.5",
    "text-sm text-foreground placeholder:text-muted-foreground/50",
    "transition-all duration-200 ease-out",
    "focus:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  variants: {
    variant: {
      default: [
        "border-border/60 bg-background",
        "hover:border-border",
        "focus:border-primary focus:ring-2 focus:ring-primary/20",
      ],
      filled: [
        "border-transparent bg-muted/50",
        "hover:bg-muted/70",
        "focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20",
      ],
      ghost: [
        "border-transparent bg-transparent",
        "hover:bg-muted/50",
        "focus:bg-muted/30 focus:ring-2 focus:ring-primary/20",
      ],
      flushed: [
        "rounded-none border-x-0 border-t-0 border-b-2 border-border/60 bg-transparent px-0",
        "hover:border-border",
        "focus:border-primary focus:ring-0",
      ],
    },
    resize: {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    },
    state: {
      default: "",
      error: [
        "border-destructive/60",
        "hover:border-destructive",
        "focus:border-destructive focus:ring-destructive/20",
      ],
      success: [
        "border-success/60",
        "hover:border-success",
        "focus:border-success focus:ring-success/20",
      ],
      warning: [
        "border-warning/60",
        "hover:border-warning",
        "focus:border-warning focus:ring-warning/20",
      ],
    },
  },
  compoundVariants: [
    // Flushed state styles
    {
      variant: "flushed",
      state: "error",
      className: "focus:ring-0",
    },
    {
      variant: "flushed",
      state: "success",
      className: "focus:ring-0",
    },
    {
      variant: "flushed",
      state: "warning",
      className: "focus:ring-0",
    },
  ],
  defaultVariants: {
    variant: "default",
    resize: "vertical",
    state: "default",
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
  /** Wrapper className */
  wrapperClassName?: string;
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
      wrapperClassName,
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
    const wrapperRef = useRef<HTMLDivElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;
    const prevErrorRef = useRef<string | undefined>(error);

    // Determine if controlled or uncontrolled
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const hasValue = currentValue !== "" && currentValue !== undefined;

    // Derive state from error
    const derivedState = error ? "error" : state;

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
        if (!wrapperRef.current || !animateOnError) return;

        if (error && !prevErrorRef.current) {
          gsap.to(wrapperRef.current, {
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

    // Suppress unused variable warnings
    void isFocused;
    void hasValue;

    return (
      <div
        ref={wrapperRef}
        className={cn("flex flex-col gap-1.5", fullWidth && "w-full", wrapperClassName)}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              "font-medium text-foreground text-sm",
              disabled && "cursor-not-allowed opacity-50",
            )}
          >
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </label>
        )}

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
          className={cn(
            textareaVariants({
              variant,
              resize: autoResize ? "none" : resize,
              state: derivedState,
            }),
            className,
          )}
          aria-invalid={derivedState === "error"}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          {...props}
        />

        {/* Footer: Error/Helper text and character count */}
        {(error || helperText || (showCount && maxLength)) && (
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
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
