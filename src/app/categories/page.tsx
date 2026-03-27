"use client";

import { startTransition } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Layers3 } from "lucide-react";

import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { getCategories, getCategorySubcategories, getProducts, queryKeys } from "@/lib/api";
import { buildQueryString, extractErrorMessage } from "@/lib/utils";

export default function CategoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => getCategories({ limit: 30 }),
  });
  const selectedCategoryId =
    searchParams.get("category") ?? categoriesQuery.data?.data[0]?._id ?? "";

  const subcategoriesQuery = useQuery({
    queryKey: queryKeys.subcategories(selectedCategoryId || "all"),
    queryFn: () => getCategorySubcategories(selectedCategoryId),
    enabled: Boolean(selectedCategoryId),
  });
  const selectedSubcategoryId =
    searchParams.get("subcategory") ?? subcategoriesQuery.data?.data[0]?._id ?? "";

  const productsQuery = useQuery({
    queryKey: queryKeys.products({
      category: selectedCategoryId,
      subcategory: selectedSubcategoryId,
    }),
    queryFn: () =>
      getProducts({
        limit: 12,
        ...(selectedSubcategoryId
          ? { "subcategory[in]": selectedSubcategoryId }
          : { "category[in]": selectedCategoryId }),
      }),
    enabled: Boolean(selectedCategoryId),
  });

  const selectedCategory = categoriesQuery.data?.data.find(
    (category) => category._id === selectedCategoryId,
  );

  function syncQuery(categoryId: string, subcategoryId?: string) {
    const query = buildQueryString({
      category: categoryId,
      subcategory: subcategoryId || undefined,
    });

    startTransition(() => {
      router.replace(`/categories?${query}`);
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <aside className="surface-card h-fit rounded-[2rem] p-5">
        <div className="mb-6 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
            All categories
          </p>
          <h1 className="section-title text-3xl font-bold text-slate-950">
            Navigate by aisle
          </h1>
        </div>

        <div className="space-y-3">
          {categoriesQuery.data?.data.map((category) => (
            <button
              key={category._id}
              className={`flex w-full items-center gap-3 rounded-[1.5rem] border px-4 py-4 text-left transition ${
                selectedCategoryId === category._id
                  ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                  : "border-slate-200 bg-white hover:border-[var(--brand)]"
              }`}
              type="button"
              onClick={() => {
                syncQuery(category._id);
              }}
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-slate-50">
                <Image
                  alt={category.name}
                  className="h-full w-full object-cover"
                  fill
                  sizes="56px"
                  src={category.image}
                />
              </div>
              <div>
                <p className="font-semibold text-slate-950">{category.name}</p>
                <p className="text-sm text-slate-500">Explore products</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <div className="space-y-8">
        <section className="hero-grid surface-card rounded-[2rem] p-8">
          {selectedCategory ? (
            <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:items-center">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
                  Selected category
                </p>
                <h2 className="section-title text-4xl font-bold text-slate-950">
                  {selectedCategory.name}
                </h2>
                <p className="max-w-2xl text-base leading-8 text-slate-600">
                  Browse subcategories, then drill into the products inside each
                  one without leaving the page.
                </p>
              </div>
              <div className="relative mx-auto h-52 w-52 overflow-hidden rounded-[2rem] bg-white/80 p-6">
                <Image
                  alt={selectedCategory.name}
                  className="h-full w-full object-cover"
                  fill
                  sizes="208px"
                  src={selectedCategory.image}
                />
              </div>
            </div>
          ) : null}
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {subcategoriesQuery.data?.data.map((subcategory) => (
              <Button
                key={subcategory._id}
                type="button"
                variant={
                  selectedSubcategoryId === subcategory._id ? "primary" : "outline"
                }
                onClick={() => {
                  syncQuery(selectedCategoryId, subcategory._id);
                }}
              >
                {subcategory.name}
              </Button>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
              Products in view
            </p>
            <h2 className="section-title text-3xl font-bold text-slate-950">
              Inside this subcategory
            </h2>
          </div>

          {productsQuery.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
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
          ) : productsQuery.data?.data.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {productsQuery.data.data.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="surface-card rounded-[2rem] px-6 py-16 text-center">
              <Layers3 className="mx-auto h-10 w-10 text-[var(--brand)]" />
              <p className="mt-4 text-sm text-slate-600">
                No products are available for this subcategory yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
