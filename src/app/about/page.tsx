import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Cookie,
  Headphones,
  LockKeyhole,
  Mail,
  Phone,
  RotateCcw,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/constants";

const promiseCards = [
  {
    title: "Faster everyday shopping",
    description:
      "Discover products, build your cart, and move through checkout without losing your flow.",
    icon: Sparkles,
  },
  {
    title: "Protected accounts and payments",
    description:
      "Sign in securely, manage your wishlist, and keep your orders tied to one reliable profile.",
    icon: ShieldCheck,
  },
  {
    title: "Support that stays close",
    description:
      "From order tracking to checkout questions, the store experience is designed to stay clear and helpful.",
    icon: Headphones,
  },
] as const;

const guideCards = [
  {
    title: "Help and contact",
    description:
      "Need support with browsing, account access, or a recent order? Reach out through the store contact options below.",
    icon: Mail,
  },
  {
    title: "Privacy and security",
    description:
      "Your profile, token-based session, and account details are handled to keep checkout and order history protected.",
    icon: LockKeyhole,
  },
  {
    title: "Terms and store policies",
    description:
      "Shipping, returns, and browsing behavior all follow clear store rules so the experience stays predictable.",
    icon: ScrollText,
  },
  {
    title: "Cookies and smoother sessions",
    description:
      "Session storage helps keep you signed in and preserves a smoother cart and wishlist experience across visits.",
    icon: Cookie,
  },
] as const;

const supportCards = [
  {
    title: "Shipping guidance",
    description:
      "Review payment and shipping flow before placing the order, then complete checkout with the address details you need.",
    icon: Truck,
    href: "/checkout",
    action: "Go to checkout",
  },
  {
    title: "Returns and order follow-up",
    description:
      "Track placed orders and revisit your shopping history whenever you need an update after purchase.",
    icon: RotateCcw,
    href: "/orders",
    action: "Open orders",
  },
] as const;

export const metadata: Metadata = {
  title: `About | ${SITE_NAME}`,
  description:
    "Learn more about FreshCart, customer help, privacy expectations, and store policies.",
};

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/70 bg-[var(--brand-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">
              <Sparkles className="h-4 w-4" />
              About FreshCart
            </span>

            <div className="space-y-4">
              <h1 className="section-title max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-[3.25rem]">
                Built to make online shopping feel lighter, faster, and easier
                to trust.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                {SITE_NAME} is a polished storefront experience powered by
                Next.js and the Route Academy API. It brings products,
                categories, cart, wishlist, checkout, and order tracking into
                one clear flow for everyday shoppers.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link className={buttonVariants({ size: "lg" })} href="/products">
                Explore products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                className={buttonVariants({ variant: "outline", size: "lg" })}
                href="/signup"
              >
                Create account
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {promiseCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="surface-card rounded-[1.75rem] p-5"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-950">
                    {card.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {card.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {guideCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.title}
              className="surface-card rounded-[1.75rem] p-5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-slate-950">
                {card.title}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {card.description}
              </p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
        <div className="surface-card rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
            Customer help
          </p>
          <h2 className="section-title mt-3 text-3xl font-bold text-slate-950">
            Reach support or jump into the next step
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            Whether you are checking shipping details, following up on an
            existing order, or just learning how the store works, these routes
            are the best place to continue.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {supportCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-5"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {card.description}
                  </p>
                  <Link
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)]"
                    href={card.href}
                  >
                    {card.action}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="surface-card rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
            Contact
          </p>
          <h2 className="section-title mt-3 text-3xl font-bold text-slate-950">
            We keep the support path simple
          </h2>

          <div className="mt-6 space-y-4">
            <a
              className="flex items-center gap-4 rounded-[1.5rem] border border-slate-200 bg-white/80 px-5 py-4 transition hover:border-[var(--brand)]"
              href="mailto:support@freshcart.com"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
                <Mail className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm text-slate-500">Email support</span>
                <span className="block font-semibold text-slate-950">
                  support@freshcart.com
                </span>
              </span>
            </a>

            <a
              className="flex items-center gap-4 rounded-[1.5rem] border border-slate-200 bg-white/80 px-5 py-4 transition hover:border-[var(--brand)]"
              href="tel:+18001234567"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
                <Phone className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm text-slate-500">Call the store</span>
                <span className="block font-semibold text-slate-950">
                  +1 (800) 123-4567
                </span>
              </span>
            </a>
          </div>

          <div className="mt-6 rounded-[1.75rem] border border-emerald-100 bg-emerald-50/80 p-5 text-sm leading-7 text-emerald-900">
            Redirects like <strong>/contact</strong>, <strong>/help</strong>,
            <strong> /privacy</strong>, <strong>/terms</strong>, and
            <strong> /cookies</strong> now land on a real page with the store
            details they were meant to surface.
          </div>
        </aside>
      </section>
    </div>
  );
}
