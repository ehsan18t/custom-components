"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

// ============================================================================
// Variants
// ============================================================================

export const textareaVariants = tv({
  base: [
    "flex w-full rounded-md border bg-input px-3 py-2",
    "text-sm text-foreground placeholder:text-muted-foreground",
    "transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "resize-y min-h-[80px]",
  ],
  variants: {
    variant: {
      default: "border-border focus-visible:border-primary",
      filled: "border-transparent bg-muted focus-visible:bg-input focus-visible:border-primary",
      flushed: "rounded-none border-x-0 border-t-0 border-b-2 px-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary",
      unstyled: "border-transparent bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0",
    },
    state: {
      default: "",
      error: "border-destructive focus-visible:ring-destructive",
      success: "border-success focus-visible:ring-success",
      warning: "border-warning focus-visible:ring-warning",
    },
    resize: {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    },
    fullWidth: {
      true: "w-full",
      false: "w-auto",
    },
  },
  defaultVariants: {
    variant: "default",
    state: "default",
    resize: "vertical",
    fullWidth: true,
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
}

// ============================================================================
// Component
// ============================================================================

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      containerClassName,
      variant,
      state,
      resize,
      fullWidth,
      error,
      helperText,
      label,
      required,
      showCount,
      maxLength,
      disabled,
      value,
      defaultValue,
      id,
      ...props
    },
    ref
  ) => {
    // Derive state from error
    const derivedState = error ? "error" : state;
    const textareaId = id || props.name;

    // Character count
    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full", containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              "text-sm font-medium text-foreground",
              disabled && "opacity-50"
            )}
          >
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          className={cn(
            textareaVariants({ variant, state: derivedState, resize, fullWidth }),
            className
          )}
          {...props}
        />

        {/* Footer: Error/Helper text and character count */}
        <div className="flex items-center justify-between gap-2">
          {/* Error or helper text */}
          {(error || helperText) && (
            <p
              className={cn(
                "text-xs",
                error ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {error || helperText}
            </p>
          )}

          {/* Character count */}
          {showCount && maxLength && (
            <p
              className={cn(
                "ml-auto text-xs text-muted-foreground",
                charCount >= maxLength && "text-destructive"
              )}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
