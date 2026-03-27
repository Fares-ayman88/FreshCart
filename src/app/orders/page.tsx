"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { PackageCheck } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { getProfile, getUserOrders, queryKeys } from "@/lib/api";
import { useProtectedRoute } from "@/lib/hooks";
import { extractErrorMessage, formatCurrency, formatDate, isProductEntity } from "@/lib/utils";

export default function OrdersPage() {
  const { canRender, hydrated } = useProtectedRoute();

  const profileQuery = useQuery({
    queryKey: queryKeys.me,
    queryFn: getProfile,
    enabled: canRender,
  });

  const userId = profileQuery.data?.data._id;

  const ordersQuery = useQuery({
    queryKey: queryKeys.orders(userId ?? "me"),
    queryFn: () => getUserOrders(userId ?? ""),
    enabled: Boolean(userId),
  });

  if (!hydrated || !canRender) {
    return <div className="h-[60vh] animate-pulse rounded-[2rem] bg-white/70" />;
  }

  const orders = ordersQuery.data ?? [];

  if (!ordersQuery.isLoading && !orders.length) {
    return (
      <EmptyState
        action={{ href: "/products", label: "Shop now" }}
        description="You do not have any orders yet. Once you finish checkout, every order will appear here with product and shipping details."
        icon={PackageCheck}
        title="No orders yet"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
          All orders
        </p>
        <h1 className="section-title text-4xl font-bold text-slate-950">
          Every order connected to your account
        </h1>
      </div>

      {ordersQuery.isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-[1.75rem] bg-white/70"
            />
          ))}
        </div>
      ) : ordersQuery.isError ? (
        <div className="rounded-[1.75rem] border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
          {extractErrorMessage(ordersQuery.error)}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order._id} className="surface-card rounded-[2rem] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
                    Order #{order.id}
                  </p>
                  <h2 className="text-2xl font-semibold text-slate-950">
                    Placed on {formatDate(order.createdAt)}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                    {order.paymentMethodType}
                  </span>
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      order.isPaid
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {order.isPaid ? "Paid" : "Pending payment"}
                  </span>
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      order.isDelivered
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {order.isDelivered ? "Delivered" : "Preparing delivery"}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-4 rounded-[1.75rem] border border-slate-200 bg-white/80 p-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-slate-500">Total price</p>
                  <p className="text-xl font-bold text-slate-950">
                    {formatCurrency(order.totalOrderPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Shipping city</p>
                  <p className="text-base font-semibold text-slate-950">
                    {order.shippingAddress.city}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="text-base font-semibold text-slate-950">
                    {order.shippingAddress.phone}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {order.cartItems.map((item) => {
                  const product = isProductEntity(item.product) ? item.product : null;

                  return (
                    <div
                      key={item._id}
                      className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 sm:grid-cols-[88px_1fr_auto]"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-50 p-3">
                        {product ? (
                          <Image
                            alt={product.title}
                            className="h-full w-full object-contain"
                            fill
                            sizes="88px"
                            src={product.imageCover}
                          />
                        ) : null}
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-950">
                          {product?.title ?? "Product"}
                        </p>
                        <p className="text-sm text-slate-500">
                          Quantity: {item.count}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-slate-950">
                        {formatCurrency(item.price * item.count)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
