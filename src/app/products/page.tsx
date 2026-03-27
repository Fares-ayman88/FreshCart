"use client";

import { startTransition, useDeferredValue } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Filter, RotateCcw } from "lucide-react";

import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBrands, getCategories, getProducts, queryKeys } from "@/lib/api";
import { buildQueryString, extractErrorMessage } from "@/lib/utils";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";
  const category = searchParams.get("category") ?? "";
  const brand = searchParams.get("brand") ?? "";
  const sort = searchParams.get("sort") ?? "-updatedAt";
  const page = Number(searchParams.get("page") ?? "1");
  const deferredKeyword = useDeferredValue(keyword);

  function syncUrl(nextFilters: {
    keyword: string;
    category: string;
    brand: string;
    sort: string;
    page: number;
  }) {
    const query = buildQueryString({
      keyword: nextFilters.keyword || undefined,
      category: nextFilters.category || undefined,
      brand: nextFilters.brand || undefined,
      sort: nextFilters.sort || undefined,
      page: nextFilters.page > 1 ? nextFilters.page : undefined,
    });

    startTransition(() => {
      router.replace(query ? `/products?${query}` : "/products");
    });
  }

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => getCategories({ limit: 30 }),
  });

  const brandsQuery = useQuery({
    queryKey: queryKeys.brands,
    queryFn: () => getBrands({ limit: 30 }),
  });

  const productsQuery = useQuery({
    queryKey: queryKeys.products({
      keyword: deferredKeyword,
      category,
      brand,
      sort,
      page,
    }),
    queryFn: () =>
      getProducts({
        limit: 12,
        page,
        sort,
        brand: brand || undefined,
        keyword: deferredKeyword || undefined,
        "category[in]": category || undefined,
      }),
  });

  const products = productsQuery.data?.data ?? [];
  const meta = productsQuery.data?.metadata;

  return (
    <div className="space-y-8">
      <section className="hero-grid surface-card rounded-[2rem] p-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
            Shop catalog
          </p>
          <h1 className="section-title text-4xl font-bold text-slate-950">
            Search products, compare brands, and refine the exact aisle you want.
          </h1>
          <p className="text-base leading-8 text-slate-600">
            Use live keyword search, category and brand filters, plus sorting and
            pagination to navigate the full Route Academy product catalog.
          </p>
        </div>
      </section>

      <section className="surface-card rounded-[2rem] p-6">
        <form
          key={`${keyword}-${category}-${brand}-${sort}`}
          className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            syncUrl({
              keyword: `${formData.get("keyword") ?? ""}`.trim(),
              category,
              brand,
              sort,
              page: 1,
            });
          }}
        >
          <Input
            defaultValue={keyword}
            label="Keyword"
            name="keyword"
            placeholder="Search products..."
          />

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            <span className="font-medium">Category</span>
            <select
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-green-500/10"
              value={category}
              onChange={(event) =>
                syncUrl({
                  keyword,
                  category: event.target.value,
                  brand,
                  sort,
                  page: 1,
                })
              }
            >
              <option value="">All categories</option>
              {categoriesQuery.data?.data.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            <span className="font-medium">Brand</span>
            <select
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-green-500/10"
              value={brand}
              onChange={(event) =>
                syncUrl({
                  keyword,
                  category,
                  brand: event.target.value,
                  sort,
                  page: 1,
                })
              }
            >
              <option value="">All brands</option>
              {brandsQuery.data?.data.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            <span className="font-medium">Sort by</span>
            <select
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-green-500/10"
              value={sort}
              onChange={(event) =>
                syncUrl({
                  keyword,
                  category,
                  brand,
                  sort: event.target.value,
                  page: 1,
                })
              }
            >
              <option value="-updatedAt">Latest updates</option>
              <option value="-price">Highest price</option>
              <option value="price">Lowest price</option>
              <option value="-ratingsAverage">Top rated</option>
            </select>
          </label>

          <div className="flex items-end gap-3">
            <Button className="w-full lg:w-auto" type="submit">
              <Filter className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button
              className="w-full lg:w-auto"
              type="button"
              variant="ghost"
              onClick={() => {
                syncUrl({
                  keyword: "",
                  category: "",
                  brand: "",
                  sort: "-updatedAt",
                  page: 1,
                });
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </form>
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="section-title text-2xl font-bold text-slate-950">
              Products
            </h2>
            <p className="text-sm text-slate-600">
              {productsQuery.isFetching ? "Refreshing results..." : `${products.length} items on this page`}
            </p>
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
        ) : products.length ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                disabled={!meta?.currentPage || meta.currentPage <= 1}
                type="button"
                variant="outline"
                onClick={() =>
                  syncUrl({
                    keyword,
                    category,
                    brand,
                    sort,
                    page: Math.max(1, page - 1),
                  })
                }
              >
                Previous
              </Button>
              <span className="text-sm font-medium text-slate-600">
                Page {meta?.currentPage ?? 1} of {meta?.numberOfPages ?? 1}
              </span>
              <Button
                disabled={!meta?.numberOfPages || page >= meta.numberOfPages}
                type="button"
                variant="outline"
                onClick={() =>
                  syncUrl({
                    keyword,
                    category,
                    brand,
                    sort,
                    page: page + 1,
                  })
                }
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="surface-card rounded-[2rem] px-6 py-16 text-center">
            <h3 className="text-2xl font-semibold text-slate-950">No products found</h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
              Try a different keyword or clear some filters to expand the results.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
