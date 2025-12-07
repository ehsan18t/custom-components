"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Eye, EyeOff, X } from "lucide-react";
import {
  type ChangeEvent,
  type FocusEvent,
  forwardRef,
  type InputHTMLAttributes,
  useRef,
  useState,
} from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

// ============================================================================
// Variants
// ============================================================================

export const inputVariants = tv({
  base: [
    "flex h-10 w-full rounded-lg border bg-background px-3 py-2",
    "text-sm text-foreground placeholder:text-muted-foreground/50",
    "transition-all duration-200 ease-out",
    "focus:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm",
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
    inputSize: {
      sm: "h-8 px-2.5 text-xs",
      md: "h-10 px-3 text-sm",
      lg: "h-12 px-4 text-base",
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
    inputSize: "md",
    state: "default",
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
  /** Wrapper className */
  wrapperClassName?: string;
  /** Show clear button when input has value */
  clearable?: boolean;
  /** Callback when clear button is clicked */
  onClear?: () => void;
  /** Prefix text to show before input (e.g., "$", "https://") */
  prefix?: string;
  /** Suffix text to show after input (e.g., ".com", "kg") */
  suffix?: string;
  /** Full width */
  fullWidth?: boolean;
  /** Show character count */
  showCount?: boolean;
  /** Animate shake on error */
  animateOnError?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      wrapperClassName,
      variant = "default",
      inputSize = "md",
      state,
      fullWidth = true,
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
      onFocus,
      onBlur,
      prefix,
      suffix,
      showCount,
      maxLength,
      animateOnError = true,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const [isFocused, setIsFocused] = useState(false);
    const internalRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;
    const prevErrorRef = useRef<string | undefined>(error);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    // Determine if controlled or uncontrolled
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const hasValue = currentValue !== "" && currentValue !== undefined;
    const characterCount = String(currentValue).length;

    // Derive state from error
    const derivedState = error ? "error" : state;

    // Handle onChange for uncontrolled inputs
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    // Handle focus
    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    // Handle blur
    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    // Handle clear
    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
        if (inputRef.current) {
          inputRef.current.value = "";
          inputRef.current.focus();
        }
      }
      onClear?.();
    };

    // Shake animation on error
    useGSAP(
      () => {
        if (!wrapperRef.current || !animateOnError) return;

        // Only animate when error appears (not on mount)
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

    const inputId = id || props.name;

    // Determine if we have addons (prefix/suffix)
    const hasAddons = prefix || suffix;

    // Determine right side elements
    const hasRightElements = rightIcon || isPassword || (clearable && hasValue);
    const rightElementsCount =
      (rightIcon ? 1 : 0) + (isPassword ? 1 : 0) + (clearable && hasValue ? 1 : 0);

    // Calculate padding based on icons and addons
    const getPaddingClasses = () => {
      if (hasAddons) return ""; // Addons handle their own spacing

      const left = leftIcon ? "pl-10" : "pl-3";
      let right = "pr-3";
      if (rightElementsCount === 1) right = "pr-10";
      else if (rightElementsCount === 2) right = "pr-16";
      else if (rightElementsCount >= 3) right = "pr-22";
      return `${left} ${right}`;
    };

    // Size mappings for addon heights
    const sizeHeightClass = {
      sm: "h-8",
      md: "h-10",
      lg: "h-12",
    };

    // Render input with optional addons
    const renderInput = () => (
      <div className={cn("relative flex items-center", fullWidth && "w-full")}>
        {/* Left icon */}
        {leftIcon && !hasAddons && (
          <div
            className={cn(
              "pointer-events-none absolute left-3 flex items-center justify-center",
              "text-muted-foreground transition-colors duration-200",
              isFocused && "text-foreground",
              derivedState === "error" && "text-destructive",
              derivedState === "success" && "text-success",
            )}
          >
            {leftIcon}
          </div>
        )}

        {/* Input element */}
        <input
          ref={inputRef}
          id={inputId}
          type={inputType}
          disabled={disabled}
          value={isControlled ? value : undefined}
          defaultValue={!isControlled ? defaultValue : undefined}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          className={cn(
            inputVariants({ variant, inputSize, state: derivedState }),
            getPaddingClasses(),
            hasAddons &&
              "rounded-none border-x-0 first:rounded-l-lg first:border-l last:rounded-r-lg last:border-r",
            className,
          )}
          aria-invalid={derivedState === "error"}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />

        {/* Right side elements */}
        {hasRightElements && !hasAddons && (
          <div className="absolute right-3 flex items-center gap-1.5">
            {/* Clear button */}
            {clearable && hasValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className={cn(
                  "flex items-center justify-center rounded-full p-0.5",
                  "text-muted-foreground transition-all duration-150",
                  "hover:bg-muted hover:text-foreground",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
                tabIndex={-1}
                aria-label="Clear input"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            )}

            {/* Password toggle */}
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  "flex items-center justify-center rounded p-0.5",
                  "text-muted-foreground transition-colors duration-150",
                  "hover:text-foreground",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
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
            {rightIcon && (
              <span
                className={cn(
                  "text-muted-foreground transition-colors duration-200",
                  isFocused && "text-foreground",
                )}
              >
                {rightIcon}
              </span>
            )}
          </div>
        )}
      </div>
    );

    return (
      <div
        ref={wrapperRef}
        className={cn("flex flex-col gap-1.5", fullWidth && "w-full", wrapperClassName)}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "font-medium text-foreground text-sm",
              disabled && "cursor-not-allowed opacity-50",
            )}
          >
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </label>
        )}

        {/* Input with optional prefix/suffix addons */}
        {hasAddons ? (
          <div
            className={cn(
              "flex items-stretch overflow-hidden rounded-lg border transition-all duration-200",
              // Default border color
              "border-border/60",
              // Hover state
              "hover:border-border",
              // Focus state
              isFocused && "border-primary ring-2 ring-primary/20",
              // Error state
              derivedState === "error" && "border-destructive/60 hover:border-destructive",
              isFocused && derivedState === "error" && "border-destructive ring-destructive/20",
              // Success state
              derivedState === "success" && "border-success/60 hover:border-success",
              isFocused && derivedState === "success" && "border-success ring-success/20",
              // Warning state
              derivedState === "warning" && "border-warning/60 hover:border-warning",
              isFocused && derivedState === "warning" && "border-warning ring-warning/20",
              // Disabled state
              disabled && "opacity-50",
            )}
          >
            {/* Prefix */}
            {prefix && (
              <span
                className={cn(
                  "flex shrink-0 select-none items-center border-border/60 border-r bg-muted/30 px-3",
                  "text-muted-foreground text-sm",
                  sizeHeightClass[inputSize ?? "md"],
                )}
              >
                {prefix}
              </span>
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
              onFocus={handleFocus}
              onBlur={handleBlur}
              maxLength={maxLength}
              className={cn(
                "flex-1 border-none bg-background px-3 text-foreground text-sm",
                "placeholder:text-muted-foreground/50",
                "focus:outline-none",
                "disabled:cursor-not-allowed",
                sizeHeightClass[inputSize ?? "md"],
                className,
              )}
              aria-invalid={derivedState === "error"}
              aria-describedby={
                error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
              }
              {...props}
            />

            {/* Suffix */}
            {suffix && (
              <span
                className={cn(
                  "flex shrink-0 select-none items-center border-border/60 border-l bg-muted/30 px-3",
                  "text-muted-foreground text-sm",
                  sizeHeightClass[inputSize ?? "md"],
                )}
              >
                {suffix}
              </span>
            )}
          </div>
        ) : (
          renderInput()
        )}

        {/* Error, helper text, and character count */}
        {(error || helperText || (showCount && maxLength)) && (
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              {error && (
                <p
                  id={`${inputId}-error`}
                  className="fade-in slide-in-from-top-1 animate-in text-destructive text-xs duration-200"
                >
                  {error}
                </p>
              )}
              {!error && helperText && (
                <p id={`${inputId}-helper`} className="text-muted-foreground text-xs">
                  {helperText}
                </p>
              )}
            </div>
            {showCount && maxLength && (
              <span
                className={cn(
                  "text-xs tabular-nums transition-colors duration-200",
                  characterCount > maxLength * 0.9
                    ? "text-destructive"
                    : characterCount > maxLength * 0.7
                      ? "text-warning"
                      : "text-muted-foreground",
                )}
              >
                {characterCount}/{maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
