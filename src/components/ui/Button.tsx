"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "link";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton
  extends ButtonBaseProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  href?: never;
}

interface ButtonAsLink
  extends ButtonBaseProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> {
  href: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-6 py-3 text-base gap-2",
  lg: "px-8 py-4 text-lg gap-2.5",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-gradient-to-r from-blue-600 to-blue-500 text-white",
    "shadow-lg shadow-blue-500/25",
    "hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02]",
    "active:scale-[0.98]",
    "rounded-full font-semibold"
  ),
  secondary: cn(
    "border border-gray-200 bg-white/80 text-gray-700",
    "hover:bg-gray-50 hover:border-gray-300 hover:scale-[1.02]",
    "active:scale-[0.98]",
    "rounded-full font-medium backdrop-blur-sm"
  ),
  link: cn(
    "text-blue-600 hover:text-blue-700",
    "font-medium underline-offset-4 hover:underline",
    "p-0"
  ),
};

const arrowSizeClasses: Record<ButtonSize, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    { variant = "primary", size = "md", arrow = false, className, children, ...props },
    ref
  ) => {
    const classes = cn(
      "inline-flex items-center justify-center",
      "transition-all duration-200 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
      "disabled:opacity-50 disabled:pointer-events-none",
      variantClasses[variant],
      variant !== "link" && sizeClasses[size],
      className
    );

    const content = (
      <>
        {children}
        {arrow && (
          <ArrowRight
            className={cn(
              arrowSizeClasses[size],
              "transition-transform duration-200 group-hover:translate-x-0.5"
            )}
          />
        )}
      </>
    );

    if ("href" in props && props.href) {
      const { href, ...rest } = props as ButtonAsLink;
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={cn(classes, "group")}
          {...rest}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cn(classes, "group")}
        {...(props as ButtonAsButton)}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
