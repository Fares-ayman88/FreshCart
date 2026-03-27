import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    href: string;
    label: string;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="surface-card flex flex-col items-center gap-4 rounded-[2rem] px-6 py-14 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
        <Icon className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h2 className="section-title text-2xl font-semibold">{title}</h2>
        <p className="mx-auto max-w-md text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>
      {action ? (
        <Link
          className={cn(buttonVariants({ variant: "primary" }))}
          href={action.href}
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
