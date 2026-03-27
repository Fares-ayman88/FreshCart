"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, ShoppingBag, Star, Truck } from "lucide-react";
import { toast } from "sonner";

import { ProductGallery } from "@/components/products/product-gallery";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { addToCart, addToWishlist, getProduct, getProducts, queryKeys } from "@/lib/api";
import { extractErrorMessage, formatCurrency, formatDate, formatSoldCount } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  const productQuery = useQuery({
    queryKey: queryKeys.product(productId),
    queryFn: () => getProduct(productId),
  });

  const relatedProductsQuery = useQuery({
    queryKey: queryKeys.products({ relatedTo: productId }),
    queryFn: async () => {
      const categoryId = productQuery.data?.data.category._id;

      if (!categoryId) {
        return { data: [], metadata: undefined, results: 0 };
      }

      return getProducts({
        limit: 5,
        "category[in]": categoryId,
      });
    },
    enabled: Boolean(productQuery.data?.data.category._id),
  });

  const addToCartMutation = useMutation({
    mutationFn: () => addToCart(productId),
    onSuccess: () => {
      toast.success("Product added to your cart.");
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: () => addToWishlist(productId),
    onSuccess: () => {
      toast.success("Product added to your wishlist.");
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

    toast.info("Sign in to continue with cart and wishlist.");
    router.push("/login");
    return false;
  }

  if (productQuery.isLoading) {
    return <div className="h-[70vh] animate-pulse rounded-[2rem] bg-white/70" />;
  }

  if (productQuery.isError || !productQuery.data?.data) {
    return (
      <div className="rounded-[2rem] border border-red-100 bg-red-50 px-6 py-8 text-sm text-red-700">
        {extractErrorMessage(productQuery.error)}
      </div>
    );
  }

  const product = productQuery.data.data;
  const relatedProducts =
    relatedProductsQuery.data?.data.filter((item) => item._id !== product._id) ?? [];

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <ProductGallery images={product.images.length ? product.images : [product.imageCover]} title={product.title} />

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <span>{product.category.name}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>{product.brand.name}</span>
            </div>
            <h1 className="section-title text-4xl font-bold text-slate-950">
              {product.title}
            </h1>
            <p className="text-base leading-8 text-slate-600">{product.description}</p>
          </div>

          <div className="grid gap-4 rounded-[1.75rem] border border-slate-200 bg-white/80 p-5 sm:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500">Price</p>
              <p className="text-2xl font-bold text-slate-950">
                {formatCurrency(product.priceAfterDiscount ?? product.price)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Rating</p>
              <p className="inline-flex items-center gap-2 text-lg font-semibold text-slate-950">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                {product.ratingsAverage.toFixed(1)} / 5
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Demand</p>
              <p className="text-lg font-semibold text-slate-950">
                {formatSoldCount(product.sold)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {product.subcategory.map((subcategory) => (
              <span
                key={subcategory._id}
                className="rounded-full bg-[var(--brand-soft)] px-4 py-2 text-sm font-medium text-[var(--brand)]"
              >
                {subcategory.name}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              isLoading={addToCartMutation.isPending}
              size="lg"
              onClick={() => {
                if (!ensureAuth()) {
                  return;
                }

                addToCartMutation.mutate();
              }}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add to cart
            </Button>
            <Button
              isLoading={addToWishlistMutation.isPending}
              size="lg"
              variant="outline"
              onClick={() => {
                if (!ensureAuth()) {
                  return;
                }

                addToWishlistMutation.mutate();
              }}
            >
              <Heart className="mr-2 h-4 w-4" />
              Add to wishlist
            </Button>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white/70 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
                <Truck className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-slate-950">Delivery and availability</p>
                <p className="text-sm leading-7 text-slate-600">
                  {product.quantity} items left in stock. Product last updated on{" "}
                  {formatDate(product.updatedAt)}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
            Related products
          </p>
          <h2 className="section-title text-3xl font-bold text-slate-950">
            More from the same category
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {relatedProducts.slice(0, 4).map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
            Reviews
          </p>
          <h2 className="section-title text-3xl font-bold text-slate-950">
            What shoppers are saying
          </h2>
        </div>

        {product.reviews?.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {product.reviews.slice(0, 6).map((review) => (
              <article key={review._id} className="surface-card rounded-[1.75rem] p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-950">{review.user.name}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    {review.rating.toFixed(1)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {review.review ?? "No written review provided."}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">
                  {formatDate(review.createdAt)}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="surface-card rounded-[1.75rem] px-6 py-10 text-center">
            <p className="text-slate-600">No reviews yet for this product.</p>
          </div>
        )}
      </section>
    </div>
  );
}
