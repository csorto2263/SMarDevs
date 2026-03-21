import { cn } from "@/lib/utils";

type SectionHeadingAlign = "center" | "left";

interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  description?: string;
  align?: SectionHeadingAlign;
  className?: string;
  headingClassName?: string;
  descriptionClassName?: string;
}

function SectionHeading({
  eyebrow,
  heading,
  description,
  align = "center",
  className,
  headingClassName,
  descriptionClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        align === "left" && "text-left",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "text-sm font-semibold uppercase tracking-widest",
            "text-blue-600 mb-3"
          )}
        >
          {eyebrow}
        </p>
      )}

      <h2
        className={cn(
          "text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight",
          "text-gray-900",
          "leading-[1.15]",
          headingClassName
        )}
      >
        {heading}
      </h2>

      {description && (
        <p
          className={cn(
            "mt-4 text-lg sm:text-xl leading-relaxed",
            "text-gray-500",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export { SectionHeading };
export type { SectionHeadingProps, SectionHeadingAlign };
