import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700 border-gray-200/60",
  primary: "bg-blue-50 text-blue-700 border-blue-200/60",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  warning: "bg-amber-50 text-amber-700 border-amber-200/60",
  danger: "bg-red-50 text-red-700 border-red-200/60",
  outline: "bg-transparent text-gray-600 border-gray-300",
};

function Badge({ variant = "default", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        "rounded-full border px-3 py-1",
        "text-xs font-medium leading-none",
        "transition-colors duration-150",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
export type { BadgeProps, BadgeVariant };
