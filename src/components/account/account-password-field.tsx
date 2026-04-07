"use client";

import { Eye, EyeOff } from "lucide-react";
import { useId, useState, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface AccountPasswordFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  hint?: string;
}

export function AccountPasswordField({
  className,
  error,
  hint,
  id,
  label,
  ...props
}: AccountPasswordFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label className="flex w-full flex-col gap-2 text-sm text-slate-700" htmlFor={inputId}>
      <span className="text-[1.02rem] font-medium text-slate-700">{label}</span>

      <div className="relative">
        <input
          {...props}
          id={inputId}
          className={cn(
            "h-14 w-full rounded-[1rem] border border-slate-200 bg-white px-5 pr-14 text-[1.05rem] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--brand)] focus:ring-4 focus:ring-green-500/10",
            error ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : "",
            className,
          )}
          type={isVisible ? "text" : "password"}
        />

        <button
          aria-label={isVisible ? "Hide password" : "Show password"}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
          type="button"
          onClick={() => setIsVisible((current) => !current)}
        >
          {isVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {error ? (
        <span className="text-xs font-medium text-red-600">{error}</span>
      ) : hint ? (
        <span className="text-xs text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
}
