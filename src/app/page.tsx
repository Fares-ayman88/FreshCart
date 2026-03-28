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

export default function HomePage() {
  const [keyword, setKeyword] = useState("");
  const deferredKeyword = useDeferredValue(keyword);

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => getCategories({ limit: 8 }),
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
              className="flex items-center gap-4 rounded-[1.35rem] border border-slate-200 bg-white px-5 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
            >
              <div
                className={cn(
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-full",
                  featureStyle.iconClassName,
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-[1.35rem] font-semibold text-slate-950">
                  {item.title}
                </h2>
                <p className="text-[15px] leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
              Browse by category
            </p>
            <h2 className="section-title text-3xl font-bold text-slate-950">
              Start with the aisle that fits your mood.
            </h2>
          </div>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/categories"
          >
            View all categories
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {categoriesQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-44 animate-pulse rounded-[1.75rem] bg-white/70"
              />
            ))}
          </div>
        ) : categoriesQuery.isError ? (
          <div className="rounded-[1.75rem] border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
            {extractErrorMessage(categoriesQuery.error)}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {categoriesQuery.data?.data.map((category) => (
              <Link
                key={category._id}
                className="surface-card group relative overflow-hidden rounded-[1.75rem] p-5"
                href={`/categories?category=${category._id}`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(10,173,10,0.14),_transparent_45%)] opacity-0 transition group-hover:opacity-100" />
                <div className="relative flex items-center gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-white">
                    <Image
                      alt={category.name}
                      className="h-full w-full object-cover"
                      fill
                      sizes="80px"
                      src={category.image}
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-950">
                      {category.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--brand)]">
                      Explore now
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
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
