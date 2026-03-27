"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { addToCart, getWishlist, queryKeys, removeFromWishlist } from "@/lib/api";
import { useProtectedRoute } from "@/lib/hooks";
import { extractErrorMessage, formatCurrency } from "@/lib/utils";

export default function WishlistPage() {
  const queryClient = useQueryClient();
  const { canRender, hydrated } = useProtectedRoute();

  const wishlistQuery = useQuery({
    queryKey: queryKeys.wishlist,
    queryFn: getWishlist,
    enabled: canRender,
  });

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      toast.success("Product moved to your cart.");
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => {
      toast.success("Product removed from wishlist.");
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist });
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

  if (!hydrated || !canRender) {
    return <div className="h-[60vh] animate-pulse rounded-[2rem] bg-white/70" />;
  }

  const products = wishlistQuery.data?.data ?? [];

  if (!wishlistQuery.isLoading && !products.length) {
    return (
      <EmptyState
        action={{ href: "/products", label: "Browse products" }}
        description="Save products here while you compare options, then send any of them to the cart whenever you are ready."
        icon={Heart}
        title="Your wishlist is empty"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
          Wishlist page
        </p>
        <h1 className="section-title text-4xl font-bold text-slate-950">
          Keep your favorite items within reach
        </h1>
      </div>

      {wishlistQuery.isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-[1.75rem] bg-white/70"
            />
          ))}
        </div>
      ) : wishlistQuery.isError ? (
        <div className="rounded-[1.75rem] border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
          {extractErrorMessage(wishlistQuery.error)}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <article
              key={product._id}
              className="surface-card grid gap-5 rounded-[1.75rem] p-5 sm:grid-cols-[120px_1fr]"
            >
              <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-white p-3">
                <Image
                  alt={product.title}
                  className="h-full w-full object-contain"
                  fill
                  sizes="120px"
                  src={product.imageCover}
                />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <Link href={`/products/${product._id}`}>
                      <h2 className="text-xl font-semibold text-slate-950 transition hover:text-[var(--brand)]">
                        {product.title}
                      </h2>
                    </Link>
                    <p className="text-sm text-slate-500">
                      {product.brand.name} • {product.category.name}
                    </p>
                    <p className="text-lg font-bold text-slate-950">
                      {formatCurrency(product.priceAfterDiscount ?? product.price)}
                    </p>
                  </div>

                  <button
                    className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                    type="button"
                    onClick={() => removeMutation.mutate(product._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    isLoading={addToCartMutation.isPending}
                    type="button"
                    onClick={() => addToCartMutation.mutate(product._id)}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Add to cart
                  </Button>
                  <Link
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                    href={`/products/${product._id}`}
                  >
                    View details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
