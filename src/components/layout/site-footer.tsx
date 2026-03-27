import Link from "next/link";

import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/70 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="space-y-3">
          <p className="section-title text-xl font-bold text-slate-950">
            {SITE_NAME}
          </p>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            A complete e-commerce workflow with modern TypeScript tooling,
            cart and wishlist management, profile editing, and order tracking.
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Explore
          </p>
          <div className="flex flex-col gap-2 text-sm text-slate-700">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} className="hover:text-[var(--brand)]" href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Built with
          </p>
          <p className="text-sm leading-6 text-slate-600">
            Next.js 16, React 19, TanStack Query, Zustand, React Hook Form,
            Zod, Tailwind CSS 4, and the Route Academy API.
          </p>
        </div>
      </div>
    </footer>
  );
}
