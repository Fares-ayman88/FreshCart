"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { addToCart, addToWishlist, queryKeys } from "@/lib/api";
import type { Product } from "@/lib/types";
import { extractErrorMessage, formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  const addToCartMutation = useMutation({
    mutationFn: () => addToCart(product._id),
    onSuccess: () => {
      toast.success(`${product.title} was added to your cart.`);
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: () => addToWishlist(product._id),
    onSuccess: () => {
      toast.success(`${product.title} was saved to your wishlist.`);
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist });
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

  function ensureAuth() {
    if (token) {
      return true;
    }

    toast.info("Sign in first to use cart and wishlist.");
    router.push("/login");
    return false;
  }

  return (
    <article className="surface-card group flex h-full flex-col overflow-hidden rounded-[1.75rem]">
      <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(10,173,10,0.08),_transparent_60%),linear-gradient(180deg,_#ffffff,_#f6faf0)]">
        <Link className="block" href={`/products/${product._id}`}>
          <div className="relative aspect-square overflow-hidden p-6">
            <Image
              alt={product.title}
              className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              src={product.imageCover}
            />
          </div>
        </Link>
        <button
          aria-label="Add to wishlist"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-500 shadow-lg shadow-slate-200/40 transition hover:text-[var(--brand)]"
          type="button"
          onClick={() => {
            if (!ensureAuth()) {
              return;
            }

            addToWishlistMutation.mutate();
          }}
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            <span>{product.category.name}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{product.brand.name}</span>
          </div>
          <Link href={`/products/${product._id}`}>
            <h3 className="line-clamp-2 text-lg font-semibold text-slate-950 transition group-hover:text-[var(--brand)]">
              {product.title}
            </h3>
          </Link>
          <p className="line-clamp-2 text-sm leading-6 text-slate-600">
            {product.description}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xl font-bold text-slate-950">
              {formatCurrency(product.priceAfterDiscount ?? product.price)}
            </p>
            {product.priceAfterDiscount ? (
              <p className="text-sm text-slate-400 line-through">
                {formatCurrency(product.price)}
              </p>
            ) : null}
            <p className="inline-flex items-center gap-1 text-sm text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-medium text-slate-700">
                {product.ratingsAverage.toFixed(1)}
              </span>
            </p>
          </div>
          <Button
            className="shrink-0"
            isLoading={addToCartMutation.isPending}
            size="sm"
            variant="primary"
            onClick={() => {
              if (!ensureAuth()) {
                return;
              }

              addToCartMutation.mutate();
            }}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </article>
  );
}
