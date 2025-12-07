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
    "peer w-full bg-transparent",
    "text-foreground placeholder:text-muted-foreground/60",
    "transition-all duration-200 ease-out",
    "focus:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  variants: {
    variant: {
      default: "",
      filled: "",
      flushed: "",
      unstyled: "border-none p-0",
    },
    inputSize: {
      sm: "h-8 text-xs",
      md: "h-10 text-sm",
      lg: "h-12 text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    inputSize: "md",
  },
});

// Container styles with Aceternity-inspired shadows
const containerVariants = tv({
  base: [
    "group relative flex items-center",
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
    inputSize: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    variant: "default",
    state: "default",
    inputSize: "md",
  },
});

// Floating label styles
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
      false: "top-1/2 left-3 -translate-y-1/2 scale-100",
    },
    hasLeftIcon: {
      true: "",
      false: "",
    },
    inputSize: {
      sm: "",
      md: "",
      lg: "text-base",
    },
  },
  compoundVariants: [
    {
      isFloating: false,
      hasLeftIcon: true,
      className: "left-10",
    },
    {
      isFloating: true,
      inputSize: "sm",
      className: "-top-2 text-[10px]",
    },
    {
      isFloating: true,
      inputSize: "lg",
      className: "-top-3",
    },
    {
      isFloating: false,
      inputSize: "sm",
      className: "text-xs",
    },
  ],
  defaultVariants: {
    isFloating: false,
    hasLeftIcon: false,
    inputSize: "md",
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
  /** Use floating label style */
  floatingLabel?: boolean;
  /** Validation state */
  state?: "default" | "error" | "success" | "warning";
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
      containerClassName,
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
      floatingLabel = false,
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
    const containerRef = useRef<HTMLDivElement>(null);
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

    // Label should float when focused or has value
    const isLabelFloated = isFocused || hasValue;

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
        if (!containerRef.current || !animateOnError) return;

        // Only animate when error appears (not on mount)
        if (error && !prevErrorRef.current) {
          gsap.to(containerRef.current, {
            keyframes: [
              { x: -8, duration: 0.05 },
              { x: 8, duration: 0.05 },
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

    // Determine right side padding based on content
    const hasRightContent = rightIcon || isPassword || (clearable && hasValue);
    const rightContentCount =
      (rightIcon ? 1 : 0) + (isPassword ? 1 : 0) + (clearable && hasValue ? 1 : 0);

    // Padding classes for input
    const getPaddingClasses = () => {
      const left = leftIcon ? "pl-10" : prefix ? "pl-0" : "pl-3";
      let right = "pr-3";
      if (rightContentCount === 1) right = "pr-10";
      else if (rightContentCount === 2) right = "pr-16";
      else if (rightContentCount >= 3) right = "pr-22";
      if (suffix) right = "pr-0";
      return `${left} ${right}`;
    };

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {/* Non-floating label */}
        {label && !floatingLabel && (
          <label
            htmlFor={inputId}
            className={cn("font-medium text-foreground text-sm", disabled && "opacity-50")}
          >
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </label>
        )}

        {/* Main input container */}
        <div
          ref={containerRef}
          className={cn(
            containerVariants({ variant, state: derivedState, inputSize }),
            containerClassName,
          )}
        >
          {/* Prefix addon */}
          {prefix && (
            <span
              className={cn(
                "flex shrink-0 select-none items-center self-stretch border-border border-r bg-muted/50 px-3",
                "text-muted-foreground text-sm",
                "transition-colors duration-200",
                isFocused && "text-foreground",
                variant === "flushed" && "border-r-0 bg-transparent px-0 pr-2",
                disabled && "opacity-50",
              )}
            >
              {prefix}
            </span>
          )}

          {/* Left icon */}
          {leftIcon && (
            <div
              className={cn(
                "absolute left-3 flex items-center justify-center",
                "text-muted-foreground transition-colors duration-200",
                isFocused && "text-primary",
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
            placeholder={floatingLabel && label ? " " : props.placeholder}
            className={cn(inputVariants({ variant, inputSize }), getPaddingClasses(), className)}
            aria-invalid={derivedState === "error"}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {/* Floating label */}
          {floatingLabel && label && (
            <label
              htmlFor={inputId}
              className={cn(
                labelVariants({
                  isFloating: isLabelFloated,
                  hasLeftIcon: !!leftIcon,
                  inputSize,
                }),
                isLabelFloated &&
                  (derivedState === "error"
                    ? "text-destructive"
                    : derivedState === "success"
                      ? "text-success"
                      : derivedState === "warning"
                        ? "text-warning"
                        : "text-primary"),
                prefix && "left-[calc(var(--prefix-width,3rem)+0.75rem)]",
                disabled && "opacity-50",
              )}
            >
              {label}
              {required && <span className="ml-0.5 text-destructive">*</span>}
            </label>
          )}

          {/* Right side content */}
          {hasRightContent && (
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
                    "focus:outline-none focus:ring-2 focus:ring-primary/50",
                    "scale-75 opacity-0",
                    hasValue && "scale-100 opacity-100",
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
                    "focus:outline-none focus:ring-2 focus:ring-primary/50",
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
              {rightIcon && !isPassword && (
                <span
                  className={cn(
                    "text-muted-foreground transition-colors duration-200",
                    isFocused && "text-primary",
                  )}
                >
                  {rightIcon}
                </span>
              )}
            </div>
          )}

          {/* Suffix addon */}
          {suffix && (
            <span
              className={cn(
                "flex shrink-0 select-none items-center self-stretch border-border border-l bg-muted/50 px-3",
                "text-muted-foreground text-sm",
                "transition-colors duration-200",
                isFocused && "text-foreground",
                variant === "flushed" && "border-l-0 bg-transparent px-0 pl-2",
                disabled && "opacity-50",
              )}
            >
              {suffix}
            </span>
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

        {/* Error, helper text, and character count */}
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
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
