"use client";

import { Eye, EyeOff, X } from "lucide-react";
import { type ChangeEvent, forwardRef, type InputHTMLAttributes, useRef, useState } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

// ============================================================================
// Variants
// ============================================================================

export const inputVariants = tv({
  base: [
    "flex w-full rounded-md border bg-input px-3 py-2",
    "text-sm text-foreground placeholder:text-muted-foreground",
    "transition-[border-color,box-shadow] duration-200 ease-out",
    "focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.15)]",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
  ],
  variants: {
    variant: {
      default: "border-border",
      filled: "border-transparent bg-muted focus-visible:bg-input",
      flushed:
        "rounded-none border-x-0 border-t-0 border-b-2 px-0 focus-visible:shadow-none focus-visible:border-primary",
      unstyled: "border-transparent bg-transparent p-0 focus-visible:shadow-none",
    },
    inputSize: {
      sm: "h-8 text-xs",
      md: "h-10 text-sm",
      lg: "h-12 text-base",
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
    fullWidth: {
      true: "w-full",
      false: "w-auto",
    },
  },
  defaultVariants: {
    variant: "default",
    inputSize: "md",
    state: "default",
    fullWidth: true,
  },
});

// ============================================================================
// Types
// ============================================================================

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  /** Icon to show on the left side */
  leftIcon?: React.ReactNode;
  /** Icon to show on the right side */
  rightIcon?: React.ReactNode;
  /** Error message to display */
  error?: string;
  /** Helper text to display below input */
  helperText?: string;
  /** Label for the input */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Container className */
  containerClassName?: string;
  /** Show clear button when input has value */
  clearable?: boolean;
  /** Callback when clear button is clicked */
  onClear?: () => void;
  /** Prefix text to show before input (e.g., "$", "https://") */
  prefix?: string;
  /** Suffix text to show after input (e.g., ".com", "kg") */
  suffix?: string;
}

// ============================================================================
// Component
// ============================================================================

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      variant,
      inputSize,
      state,
      fullWidth,
      leftIcon,
      rightIcon,
      error,
      helperText,
      label,
      required,
      type = "text",
      id,
      disabled,
      clearable,
      onClear,
      value,
      defaultValue,
      onChange,
      prefix,
      suffix,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    // Determine if controlled or uncontrolled
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const hasValue = currentValue !== "" && currentValue !== undefined;

    // Handle onChange for uncontrolled inputs
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    // Handle clear
    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
        // Update the actual input element
        if (inputRef.current) {
          inputRef.current.value = "";
          inputRef.current.focus();
        }
      }
      onClear?.();
    };

    // Derive state from error
    const derivedState = error ? "error" : state;

    const inputId = id || props.name;

    // Determine right side padding
    const hasRightContent = rightIcon || isPassword || (clearable && hasValue);
    const rightContentCount =
      (rightIcon ? 1 : 0) + (isPassword ? 1 : 0) + (clearable && hasValue ? 1 : 0);

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full", containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn("font-medium text-foreground text-sm", disabled && "opacity-50")}
          >
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </label>
        )}

        {/* Input wrapper with prefix/suffix addons */}
        <div
          className={cn(
            "relative flex",
            (prefix || suffix) && [
              "overflow-hidden rounded-md border border-border bg-background",
              "transition-[border-color,box-shadow] duration-200",
              "focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.15)]",
              derivedState === "error" && "border-destructive",
              derivedState === "success" && "border-success",
              disabled && "opacity-50",
            ],
          )}
        >
          {/* Prefix addon */}
          {prefix && (
            <span
              className={cn(
                "flex shrink-0 select-none items-center border-input border-r bg-muted px-3 text-muted-foreground text-sm",
                disabled && "opacity-50",
              )}
            >
              {prefix}
            </span>
          )}

          {/* Inner input container */}
          <div className="relative flex-1">
            {/* Left icon */}
            {leftIcon && (
              <div className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 text-muted-foreground">
                {leftIcon}
              </div>
            )}

            {/* Input */}
            <input
              ref={inputRef}
              id={inputId}
              type={inputType}
              disabled={disabled}
              value={isControlled ? value : undefined}
              defaultValue={!isControlled ? defaultValue : undefined}
              onChange={handleChange}
              className={cn(
                // When prefix/suffix present, remove border styles as wrapper handles them
                prefix || suffix
                  ? [
                      "h-10 w-full bg-transparent px-3 py-2 text-sm",
                      "placeholder:text-muted-foreground",
                      "focus:outline-none",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                    ]
                  : inputVariants({ variant, inputSize, state: derivedState, fullWidth }),
                leftIcon && "pl-10",
                hasRightContent && rightContentCount === 1 && "pr-10",
                hasRightContent && rightContentCount === 2 && "pr-16",
                hasRightContent && rightContentCount >= 3 && "pr-22",
                className,
              )}
              {...props}
            />

            {/* Right side content: clear button, password toggle, right icon */}
            {hasRightContent && (
              <div className="-translate-y-1/2 absolute top-1/2 right-3 flex items-center gap-1.5">
                {/* Clear button */}
                {clearable && hasValue && !disabled && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    tabIndex={-1}
                    aria-label="Clear input"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                )}

                {/* Password toggle */}
                {isPassword && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    tabIndex={-1}
                    aria-pressed={showPassword}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </button>
                )}

                {/* Right icon */}
                {rightIcon && !isPassword && (
                  <span className="text-muted-foreground">{rightIcon}</span>
                )}
              </div>
            )}
          </div>

          {/* Suffix addon */}
          {suffix && (
            <span
              className={cn(
                "flex shrink-0 select-none items-center border-input border-l bg-muted px-3 text-muted-foreground text-sm",
                disabled && "opacity-50",
              )}
            >
              {suffix}
            </span>
          )}
        </div>

        {/* Error or helper text */}
        {(error || helperText) && (
          <p className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
