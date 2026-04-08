"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Headphones,
  RotateCcw,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { HeroSlider } from "@/components/home/hero-slider";
import { ProductCard } from "@/components/products/product-card";
import { buttonVariants } from "@/components/ui/button";
import { getCategories, getProducts, queryKeys } from "@/lib/api";
import { FEATURE_HIGHLIGHTS } from "@/lib/constants";
import type { Category } from "@/lib/types";
import { cn, extractErrorMessage } from "@/lib/utils";

const featureStyles = [
  {
    icon: Truck,
    iconClassName: "bg-sky-50 text-sky-500",
  },
  {
    icon: ShieldCheck,
    iconClassName: "bg-emerald-50 text-emerald-500",
  },
  {
    icon: RotateCcw,
    iconClassName: "bg-orange-50 text-orange-500",
  },
  {
    icon: Headphones,
    iconClassName: "bg-violet-50 text-violet-500",
  },
] as const;

const FEATURED_CATEGORY_ORDER = [
  "Music",
  "Men's Fashion",
  "Women's Fashion",
  "SuperMarket",
  "Baby & Toys",
  "Home",
  "Books",
  "Beauty & Health",
  "Mobiles",
  "Electronics",
] as const;

function sortHomeCategories(categories: Category[]) {
  const categoryOrder = new Map<string, number>(
    FEATURED_CATEGORY_ORDER.map((name, index) => [name, index]),
  );

  return [...categories].sort((firstCategory, secondCategory) => {
    const firstRank = categoryOrder.get(firstCategory.name) ?? Number.MAX_SAFE_INTEGER;
    const secondRank = categoryOrder.get(secondCategory.name) ?? Number.MAX_SAFE_INTEGER;

    return firstRank - secondRank;
  });
}

export default function HomePage() {
  const [keyword, setKeyword] = useState("");
  const deferredKeyword = useDeferredValue(keyword);

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => getCategories({ limit: 10 }),
  });

  const productsQuery = useQuery({
    queryKey: queryKeys.products({
      keyword: deferredKeyword || "featured",
      limit: 8,
    }),
    queryFn: () =>
      getProducts(
        deferredKeyword
          ? { keyword: deferredKeyword, limit: 8 }
          : { limit: 8, sort: "-updatedAt" },
      ),
  });
  const homeCategories = sortHomeCategories(categoriesQuery.data?.data ?? []).slice(0, 10);

  return (
    <div className="space-y-12">
      <HeroSlider />

      <section className="grid gap-4 lg:grid-cols-4">
        {FEATURE_HIGHLIGHTS.map((item, index) => {
          const featureStyle = featureStyles[index];
          const Icon = featureStyle.icon;

          return (
            <article
              key={item.title}
              className="flex h-20 items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.1)]"
            >
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                  featureStyle.iconClassName,
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <h2 className="text-base font-semibold leading-6 text-slate-950">
                  {item.title}
                </h2>
                <p className="text-sm leading-5 text-slate-500">
                  {item.description}
                </p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="space-y-5 md:space-y-6">
        <div className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between md:py-4">
          <div className="flex items-center gap-3">
            <span className="h-6 w-1 shrink-0 rounded-full bg-[var(--brand)] md:h-7" />
            <h2 className="section-title text-[1.9rem] font-bold leading-none text-slate-950 md:text-[2rem] lg:text-[2.15rem]">
              Shop By <span className="text-[var(--brand)]">Category</span>
            </h2>
          </div>

          <Link
            className="inline-flex items-center gap-2 self-end text-sm font-medium text-[#16A34A] transition hover:text-[var(--brand-strong)] sm:self-auto"
            href="/categories"
          >
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {categoriesQuery.isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 min-[960px]:grid-cols-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="h-[8.85rem] animate-pulse rounded-xl border border-slate-100 bg-white/80 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_3px_12px_rgba(15,23,42,0.05)]"
              />
            ))}
          </div>
        ) : categoriesQuery.isError ? (
          <div className="rounded-[1.75rem] border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
            {extractErrorMessage(categoriesQuery.error)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 min-[960px]:grid-cols-6">
            {homeCategories.map((category) => (
              <Link
                key={category._id}
                className="group flex min-h-[8.4rem] flex-col items-center justify-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-4 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04),0_3px_12px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand)]/25 hover:shadow-[0_14px_28px_rgba(15,23,42,0.08)] md:min-h-[8.85rem]"
                href={`/categories?category=${category._id}`}
              >
                <div className="relative h-[3.75rem] w-[3.75rem] overflow-hidden rounded-full bg-[#edf9ec] shadow-[inset_0_0_0_1px_rgba(226,232,240,0.85)] transition duration-200 group-hover:scale-[1.03] md:h-[3.9rem] md:w-[3.9rem]">
                  <Image
                    alt={category.name}
                    className="h-full w-full object-cover"
                    fill
                    sizes="64px"
                    src={category.image}
                  />
                </div>
                <h3 className="text-sm font-medium leading-5 text-slate-700 md:text-[0.95rem]">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
              Recent products
            </p>
            <h2 className="section-title text-3xl font-bold text-slate-950">
              Search the latest additions in real time.
            </h2>
          </div>

          <div className="flex w-full max-w-lg items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm shadow-slate-200/60">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              placeholder="Search products from the home page..."
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </div>
        </div>

        {productsQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-[1.75rem] bg-white/70"
              />
            ))}
          </div>
        ) : productsQuery.isError ? (
          <div className="rounded-[1.75rem] border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
            {extractErrorMessage(productsQuery.error)}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {productsQuery.data?.data.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <div className="flex justify-center">
              <Link
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
                href={keyword.trim() ? `/products?keyword=${keyword.trim()}` : "/products"}
              >
                Explore the full catalog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
