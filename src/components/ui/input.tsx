import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <label className="flex w-full flex-col gap-2 text-sm text-slate-700">
        {label ? <span className="font-medium">{label}</span> : null}
        <input
          ref={ref}
          className={cn(
            "h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--brand)] focus:ring-4 focus:ring-green-500/10",
            error ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : "",
            className,
          )}
          {...props}
        />
        {error ? (
          <span className="text-xs font-medium text-red-600">{error}</span>
        ) : hint ? (
          <span className="text-xs text-slate-500">{hint}</span>
        ) : null}
      </label>
    );
  },
);

Input.displayName = "Input";
