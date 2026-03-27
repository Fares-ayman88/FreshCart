"use client";

import { startTransition } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Gem } from "lucide-react";

import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { getBrands, getProducts, queryKeys } from "@/lib/api";
import { buildQueryString, extractErrorMessage } from "@/lib/utils";

export default function BrandsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const brandsQuery = useQuery({
    queryKey: queryKeys.brands,
    queryFn: () => getBrands({ limit: 30 }),
  });
  const selectedBrandId =
    searchParams.get("brand") ?? brandsQuery.data?.data[0]?._id ?? "";

  const productsQuery = useQuery({
    queryKey: queryKeys.products({ brand: selectedBrandId }),
    queryFn: () =>
      getProducts({
        limit: 12,
        brand: selectedBrandId,
      }),
    enabled: Boolean(selectedBrandId),
  });

  const selectedBrand = brandsQuery.data?.data.find(
    (brand) => brand._id === selectedBrandId,
  );

  function syncQuery(brandId: string) {
    const query = buildQueryString({ brand: brandId });

    startTransition(() => {
      router.replace(`/brands?${query}`);
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <aside className="surface-card h-fit rounded-[2rem] p-5">
        <div className="mb-6 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
            Brand selector
          </p>
          <h1 className="section-title text-3xl font-bold text-slate-950">
            Browse by brand
          </h1>
        </div>

        <div className="space-y-3">
          {brandsQuery.data?.data.map((brand) => (
            <button
              key={brand._id}
              className={`flex w-full items-center gap-3 rounded-[1.5rem] border px-4 py-4 text-left transition ${
                selectedBrandId === brand._id
                  ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                  : "border-slate-200 bg-white hover:border-[var(--brand)]"
              }`}
              type="button"
              onClick={() => {
                syncQuery(brand._id);
              }}
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white p-2">
                <Image
                  alt={brand.name}
                  className="h-full w-full object-contain"
                  fill
                  sizes="56px"
                  src={brand.image}
                />
              </div>
              <div>
                <p className="font-semibold text-slate-950">{brand.name}</p>
                <p className="text-sm text-slate-500">Show brand products</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <div className="space-y-8">
        <section className="hero-grid surface-card rounded-[2rem] p-8">
          {selectedBrand ? (
            <div className="grid gap-8 lg:grid-cols-[1fr_260px] lg:items-center">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
                  Featured brand
                </p>
                <h2 className="section-title text-4xl font-bold text-slate-950">
                  {selectedBrand.name}
                </h2>
                <p className="max-w-2xl text-base leading-8 text-slate-600">
                  Explore products created by this brand and jump directly into
                  product details, cart, wishlist, and checkout.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => syncQuery(selectedBrand._id)}
                >
                  Keep this brand selected
                </Button>
              </div>
              <div className="relative mx-auto h-52 w-52 overflow-hidden rounded-[2rem] bg-white/80 p-8">
                <Image
                  alt={selectedBrand.name}
                  className="h-full w-full object-contain"
                  fill
                  sizes="208px"
                  src={selectedBrand.image}
                />
              </div>
            </div>
          ) : null}
        </section>

        <section className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
              Brand products
            </p>
            <h2 className="section-title text-3xl font-bold text-slate-950">
              Products under this brand
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
              <Gem className="mx-auto h-10 w-10 text-[var(--brand)]" />
              <p className="mt-4 text-sm text-slate-600">
                No products are available under this brand right now.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
