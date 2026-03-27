"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ShoppingCart, Trash2 } from "lucide-react";

import { buttonVariants, Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import {
  clearCart,
  getCart,
  queryKeys,
  removeCartProduct,
  updateCartProductCount,
} from "@/lib/api";
import { useProtectedRoute } from "@/lib/hooks";
import { extractErrorMessage, formatCurrency, isProductEntity } from "@/lib/utils";

export default function CartPage() {
  const queryClient = useQueryClient();
  const { canRender, hydrated } = useProtectedRoute();

  const cartQuery = useQuery({
    queryKey: queryKeys.cart,
    queryFn: getCart,
    enabled: canRender,
  });

  const updateCountMutation = useMutation({
    mutationFn: ({ productId, count }: { productId: string; count: number }) =>
      updateCartProductCount(productId, count),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const removeProductMutation = useMutation({
    mutationFn: removeCartProduct,
    onSuccess: () => {
      toast.success("Product removed from cart.");
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      toast.success("Cart cleared successfully.");
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

  if (!hydrated || !canRender) {
    return <div className="h-[60vh] animate-pulse rounded-[2rem] bg-white/70" />;
  }

  const products = cartQuery.data?.data.products ?? [];
  const totalPrice = cartQuery.data?.data.totalCartPrice ?? 0;

  if (!cartQuery.isLoading && !products.length) {
    return (
      <EmptyState
        action={{ href: "/products", label: "Start shopping" }}
        description="Your cart is currently empty. Add some products first, then return here to update quantities or checkout."
        icon={ShoppingCart}
        title="Your cart is waiting"
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
              Cart page
            </p>
            <h1 className="section-title text-4xl font-bold text-slate-950">
              Review your selected products
            </h1>
          </div>
          <Button
            isLoading={clearCartMutation.isPending}
            type="button"
            variant="ghost"
            onClick={() => clearCartMutation.mutate()}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear cart
          </Button>
        </div>

        {cartQuery.isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-[1.75rem] bg-white/70"
              />
            ))}
          </div>
        ) : cartQuery.isError ? (
          <div className="rounded-[1.75rem] border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
            {extractErrorMessage(cartQuery.error)}
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((item) => {
              const productId =
                typeof item.product === "string" ? item.product : item.product._id;
              const product = isProductEntity(item.product) ? item.product : null;

              return (
                <article
                  key={item._id}
                  className="surface-card grid gap-5 rounded-[1.75rem] p-5 sm:grid-cols-[120px_1fr]"
                >
                  <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-white p-3">
                    {product ? (
                      <Image
                        alt={product.title}
                        className="h-full w-full object-contain"
                        fill
                        sizes="120px"
                        src={product.imageCover}
                      />
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-slate-950">
                          {product?.title ?? "Product"}
                        </h2>
                        <p className="text-sm text-slate-500">
                          {product?.brand.name ?? "Unknown brand"} •{" "}
                          {product?.category.name ?? "Unknown category"}
                        </p>
                      </div>
                      <button
                        className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                        type="button"
                        onClick={() => removeProductMutation.mutate(productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <QuantityStepper
                        disabled={updateCountMutation.isPending}
                        value={item.count}
                        onDecrease={() =>
                          updateCountMutation.mutate({
                            productId,
                            count: item.count - 1,
                          })
                        }
                        onIncrease={() =>
                          updateCountMutation.mutate({
                            productId,
                            count: item.count + 1,
                          })
                        }
                      />
                      <p className="text-2xl font-bold text-slate-950">
                        {formatCurrency(item.price * item.count)}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <aside className="surface-card h-fit rounded-[2rem] p-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
              Summary
            </p>
            <h2 className="section-title mt-2 text-3xl font-bold text-slate-950">
              Ready to checkout
            </h2>
          </div>

          <div className="space-y-3 rounded-[1.5rem] border border-slate-200 bg-white/80 p-4">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Items</span>
              <span>{products.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Total</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          <Link
            className={buttonVariants({ className: "w-full", size: "lg" })}
            href="/checkout"
          >
            Proceed to checkout
          </Link>
          <Link
            className={buttonVariants({
              className: "w-full",
              size: "lg",
              variant: "outline",
            })}
            href="/products"
          >
            Continue shopping
          </Link>
        </div>
      </aside>
    </div>
  );
}
