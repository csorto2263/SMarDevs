import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/* ─── Shared field wrapper ─── */

interface FieldWrapperProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  helperText?: string;
  className?: string;
  children: React.ReactNode;
}

function FieldWrapper({
  label,
  htmlFor,
  error,
  helperText,
  className,
  children,
}: FieldWrapperProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!error && helperText && (
        <p className="text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  );
}

/* ─── Shared input styling ─── */

const baseFieldClasses = cn(
  "w-full rounded-xl border bg-white/80 backdrop-blur-sm",
  "px-4 py-3 text-base text-gray-900 placeholder:text-gray-400",
  "border-gray-200",
  "transition-all duration-200",
  "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400",
  "hover:border-gray-300",
  "disabled:opacity-50 disabled:cursor-not-allowed"
);

const errorFieldClasses = cn(
  "border-red-300",
  "focus:ring-red-500/30 focus:border-red-400"
);

/* ─── Input ─── */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  wrapperClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, wrapperClassName, className, id, ...props }, ref) => {
    const fieldId = id || props.name;
    return (
      <FieldWrapper
        label={label}
        htmlFor={fieldId}
        error={error}
        helperText={helperText}
        className={wrapperClassName}
      >
        <input
          ref={ref}
          id={fieldId}
          className={cn(baseFieldClasses, error && errorFieldClasses, className)}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
Input.displayName = "Input";

/* ─── Textarea ─── */

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  wrapperClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, wrapperClassName, className, id, ...props }, ref) => {
    const fieldId = id || props.name;
    return (
      <FieldWrapper
        label={label}
        htmlFor={fieldId}
        error={error}
        helperText={helperText}
        className={wrapperClassName}
      >
        <textarea
          ref={ref}
          id={fieldId}
          rows={4}
          className={cn(
            baseFieldClasses,
            "resize-y min-h-[120px]",
            error && errorFieldClasses,
            className
          )}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
Textarea.displayName = "Textarea";

/* ─── Select ─── */

interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  wrapperClassName?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, helperText, options, placeholder, wrapperClassName, className, id, ...props },
    ref
  ) => {
    const fieldId = id || props.name;
    return (
      <FieldWrapper
        label={label}
        htmlFor={fieldId}
        error={error}
        helperText={helperText}
        className={wrapperClassName}
      >
        <select
          ref={ref}
          id={fieldId}
          className={cn(
            baseFieldClasses,
            "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10",
            error && errorFieldClasses,
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
      </FieldWrapper>
    );
  }
);
Select.displayName = "Select";

export { Input, Textarea, Select, FieldWrapper };
export type { InputProps, TextareaProps, SelectProps, SelectOption, FieldWrapperProps };
