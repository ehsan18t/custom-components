"use client";

import {
  type ChangeEvent,
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
    "flex w-full rounded-md border bg-input px-3 py-2",
    "text-sm text-foreground placeholder:text-muted-foreground",
    "transition-[border-color,box-shadow] duration-200 ease-out",
    "focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.15)]",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "resize-y min-h-[80px]",
  ],
  variants: {
    variant: {
      default: "border-border",
      filled: "border-transparent bg-muted focus-visible:bg-input",
      flushed:
        "rounded-none border-x-0 border-t-0 border-b-2 px-0 focus-visible:shadow-none focus-visible:border-primary",
      unstyled: "border-transparent bg-transparent p-0 focus-visible:shadow-none",
    },
    state: {
      default: "",
      error:
        "border-destructive focus-visible:border-destructive focus-visible:shadow-[0_0_0_3px_rgba(var(--destructive-rgb),0.15)]",
      success:
        "border-success focus-visible:border-success focus-visible:shadow-[0_0_0_3px_rgba(var(--success-rgb),0.15)]",
      warning:
        "border-warning focus-visible:border-warning focus-visible:shadow-[0_0_0_3px_rgba(var(--warning-rgb),0.15)]",
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
  /** Auto-resize textarea based on content */
  autoResize?: boolean;
  /** Minimum rows when auto-resizing */
  minRows?: number;
  /** Maximum rows when auto-resizing */
  maxRows?: number;
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
      onChange,
      id,
      autoResize = false,
      minRows = 3,
      maxRows = 10,
      ...props
    },
    ref,
  ) => {
    // Track internal value for uncontrolled inputs
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

    // Determine if controlled or uncontrolled
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

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

    // Derive state from error
    const derivedState = error ? "error" : state;
    const textareaId = id || props.name;

    // Character count - works for both controlled and uncontrolled
    const charCount = typeof currentValue === "string" ? currentValue.length : 0;

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full", containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className={cn("font-medium text-foreground text-sm", disabled && "opacity-50")}
          >
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          id={textareaId}
          disabled={disabled}
          value={isControlled ? value : undefined}
          defaultValue={!isControlled ? defaultValue : undefined}
          onChange={handleChange}
          maxLength={maxLength}
          className={cn(
            textareaVariants({
              variant,
              state: derivedState,
              resize: autoResize ? "none" : resize,
              fullWidth,
            }),
            className,
          )}
          {...props}
        />

        {/* Footer: Error/Helper text and character count */}
        <div className="flex items-center justify-between gap-2">
          {/* Error or helper text */}
          {(error || helperText) && (
            <p className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
              {error || helperText}
            </p>
          )}

          {/* Character count */}
          {showCount && maxLength && (
            <p
              className={cn(
                "ml-auto text-muted-foreground text-xs",
                charCount >= maxLength && "text-destructive",
              )}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
