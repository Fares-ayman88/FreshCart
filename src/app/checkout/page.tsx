"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreditCard, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  createCashOrder,
  createCheckoutSession,
  getCart,
  getProfile,
  queryKeys,
} from "@/lib/api";
import { useProtectedRoute } from "@/lib/hooks";
import { extractErrorMessage, formatCurrency } from "@/lib/utils";

const schema = z.object({
  details: z.string().min(5, "Add the street and building details."),
  city: z.string().min(2, "Enter the city name."),
  phone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, "Use a valid Egyptian phone number."),
});

type CheckoutValues = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { canRender, hydrated } = useProtectedRoute();

  const cartQuery = useQuery({
    queryKey: queryKeys.cart,
    queryFn: getCart,
    enabled: canRender,
  });

  const profileQuery = useQuery({
    queryKey: queryKeys.me,
    queryFn: getProfile,
    enabled: canRender,
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      details: "",
      city: "Cairo",
      phone: "",
    },
  });

  useEffect(() => {
    if (profileQuery.data?.data.phone) {
      reset({
        details: "",
        city: "Cairo",
        phone: profileQuery.data.data.phone ?? "",
      });
    }
  }, [profileQuery.data, reset]);

  const cashMutation = useMutation({
    mutationFn: (values: CheckoutValues) =>
      createCashOrder(cartQuery.data?.cartId ?? "", values),
    onSuccess: () => {
      toast.success("Cash order created successfully.");
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders(profileQuery.data?.data._id ?? "") });
      router.push("/orders");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const onlineMutation = useMutation({
    mutationFn: async (values: CheckoutValues) => {
      const response = await createCheckoutSession(
        cartQuery.data?.cartId ?? "",
        values,
        window.location.origin,
      );

      window.location.href = response.session.url;
      return response;
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
        action={{ href: "/cart", label: "Back to cart" }}
        description="Your cart is empty, so there is nothing to pay for yet. Add products first, then come back to choose the payment method."
        icon={CreditCard}
        title="Checkout starts from the cart"
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
            Payment
          </p>
          <h1 className="section-title text-4xl font-bold text-slate-950">
            Add the shipping address and choose how to pay
          </h1>
        </div>

        <form className="surface-card space-y-5 rounded-[2rem] p-6">
          <Input
            error={errors.details?.message}
            label="Address details"
            placeholder="Apartment, building, street..."
            {...register("details")}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              error={errors.city?.message}
              label="City"
              placeholder="Cairo"
              {...register("city")}
            />
            <Input
              error={errors.phone?.message}
              label="Phone"
              placeholder="01000000000"
              {...register("phone")}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Button
              isLoading={cashMutation.isPending}
              size="lg"
              type="button"
              onClick={handleSubmit((values) => cashMutation.mutate(values))}
            >
              <Truck className="mr-2 h-4 w-4" />
              Cash on delivery
            </Button>
            <Button
              isLoading={onlineMutation.isPending}
              size="lg"
              type="button"
              variant="secondary"
              onClick={handleSubmit((values) => onlineMutation.mutate(values))}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Pay online
            </Button>
          </div>
        </form>
      </section>

      <aside className="surface-card h-fit rounded-[2rem] p-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
              Order summary
            </p>
            <h2 className="section-title mt-2 text-3xl font-bold text-slate-950">
              Total due
            </h2>
          </div>

          <div className="space-y-3 rounded-[1.5rem] border border-slate-200 bg-white/80 p-4">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Products</span>
              <span>{products.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Payment total</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
