import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "featured" | "dark";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  default: cn(
    "bg-white/70 backdrop-blur-xl",
    "border border-gray-200/60",
    "shadow-sm shadow-gray-100/50"
  ),
  featured: cn(
    "bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-xl",
    "border border-blue-100/60",
    "shadow-md shadow-blue-100/30",
    "ring-1 ring-blue-50/50"
  ),
  dark: cn(
    "bg-gray-900/95 backdrop-blur-xl",
    "border border-gray-700/60",
    "shadow-lg shadow-black/20",
    "text-white"
  ),
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", hover = true, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl p-6",
          "transition-all duration-300 ease-out",
          hover && "hover:-translate-y-1 hover:shadow-lg",
          hover && variant === "default" && "hover:shadow-gray-200/60 hover:border-gray-300/60",
          hover && variant === "featured" && "hover:shadow-blue-200/40 hover:border-blue-200/60",
          hover && variant === "dark" && "hover:shadow-black/30 hover:border-gray-600/60",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-4", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-xl font-semibold tracking-tight", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-gray-500 leading-relaxed", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mt-6 flex items-center", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export type { CardProps, CardVariant };
