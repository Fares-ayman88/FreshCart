"use client";

import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  User,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/api";
import { useGuestOnlyRoute } from "@/lib/hooks";
import { extractErrorMessage } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

const schema = z
  .object({
    name: z.string().min(3, "Your name should be at least 3 characters."),
    email: z.string().email("Enter a valid email address."),
    phone: z
      .string()
      .regex(/^01[0125][0-9]{8}$/, "Use a valid Egyptian phone number."),
    password: z
      .string()
      .min(6, "Password should be at least 6 characters."),
    rePassword: z.string(),
  })
  .refine((values) => values.password === values.rePassword, {
    message: "Passwords do not match.",
    path: ["rePassword"],
  });

type SignupValues = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();
  const { hydrated, isAuthenticated } = useGuestOnlyRoute();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(schema),
  });

  const signupMutation = useMutation({
    mutationFn: signUp,
    onSuccess: (response) => {
      setSession({
        token: response.token,
        user: response.user,
      });
      toast.success(`Your account is ready, ${response.user.name}.`);
      router.replace("/");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

  if (!hydrated || isAuthenticated) {
    return <div className="h-[60vh] animate-pulse rounded-[2rem] bg-white/70" />;
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-14rem)] w-full max-w-6xl items-center justify-center">
      <div className="w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_28px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:grid lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(180deg,_#f4fbef_0%,_#ecf8e6_42%,_#f8fafc_100%)] p-8 sm:p-10 lg:min-h-[48rem] lg:border-b-0 lg:border-r">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(10,173,10,0.18),_transparent_62%)]" />

          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="space-y-5">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/70 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand)] shadow-sm">
                <Sparkles className="h-4 w-4" />
                Join FreshCart
              </span>

              <div className="space-y-4">
                <h1 className="section-title max-w-md text-4xl font-bold leading-tight text-slate-950 sm:text-[2.8rem]">
                  Get Start Shopping
                </h1>
                <p className="max-w-lg text-base leading-8 text-slate-600">
                  Welcome to FreshCart! Create your account to save favorites,
                  manage your cart, and complete checkout faster every time.
                </p>
              </div>
            </div>

            <div className="relative mx-auto flex w-full max-w-md justify-center lg:justify-start">
              <div className="relative w-full max-w-[22rem] rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_20px_50px_rgba(10,173,10,0.16)]">
                <div className="absolute -right-4 -top-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand)] text-white shadow-[0_16px_30px_rgba(10,173,10,0.24)]">
                  <ShoppingBag className="h-7 w-7" />
                </div>

                <div className="space-y-5">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-[radial-gradient(circle_at_top,_rgba(10,173,10,0.22),_rgba(10,173,10,0.08))] text-[var(--brand)]">
                    <ShieldCheck className="h-10 w-10" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-950">
                      Safe and fast checkout
                    </h2>
                    <p className="text-sm leading-7 text-slate-600">
                      One account gives you your wishlist, order history, and a
                      smoother shopping flow on every device.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--brand)] shadow-sm">
                        <ShieldCheck className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Secure account setup
                        </p>
                        <p className="text-xs text-slate-500">
                          Protected profile and order access
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--brand)] shadow-sm">
                        <ShoppingBag className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Wishlist and cart sync
                        </p>
                        <p className="text-xs text-slate-500">
                          Pick up right where you left off
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/80 bg-white/80 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Fast onboarding
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Create your profile once and start shopping immediately.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/80 bg-white/80 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Cleaner checkout
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Save your details and move through orders with less friction.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="p-6 sm:p-8 lg:p-10">
          <div className="mx-auto flex h-full w-full max-w-xl flex-col justify-center">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
              <Link
                className="inline-flex items-center gap-2 font-medium text-slate-500 transition hover:text-[var(--brand)]"
                href="/"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Back to store
              </Link>

              <p>
                Already have an account?{" "}
                <Link className="font-semibold text-[var(--brand)]" href="/login">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mb-8 text-center sm:text-left">
              <div className="mx-auto mb-5 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.75rem] bg-[linear-gradient(180deg,_rgba(10,173,10,0.14),_rgba(10,173,10,0.06))] text-[var(--brand)] sm:mx-0">
                <UserPlus className="h-8 w-8" />
              </div>
              <h2 className="section-title text-3xl font-bold text-slate-950 sm:text-[2.2rem]">
                Create your account
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Enter your details below to start shopping with FreshCart.
              </p>
            </div>

            <form
              className="space-y-4"
              onSubmit={handleSubmit((values) => signupMutation.mutate(values))}
            >
              <Input
                className="h-[3.25rem] rounded-2xl"
                error={errors.name?.message}
                hint="Use your first and last name."
                label="Full name"
                placeholder="Your full name"
                {...register("name")}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-[3.15rem] h-4 w-4 text-slate-400" />
                  <Input
                    className="h-[3.25rem] rounded-2xl pl-11"
                    error={errors.email?.message}
                    label="Email address"
                    placeholder="you@example.com"
                    type="email"
                    {...register("email")}
                  />
                </div>

                <div className="relative">
                  <Phone className="pointer-events-none absolute left-4 top-[3.15rem] h-4 w-4 text-slate-400" />
                  <Input
                    className="h-[3.25rem] rounded-2xl pl-11"
                    error={errors.phone?.message}
                    label="Phone number"
                    placeholder="01000000000"
                    {...register("phone")}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-[3.15rem] h-4 w-4 text-slate-400" />
                  <Input
                    className="h-[3.25rem] rounded-2xl pl-11"
                    error={errors.password?.message}
                    label="Password"
                    placeholder="Choose a password"
                    type="password"
                    {...register("password")}
                  />
                </div>

                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-[3.15rem] h-4 w-4 text-slate-400" />
                  <Input
                    className="h-[3.25rem] rounded-2xl pl-11"
                    error={errors.rePassword?.message}
                    label="Confirm password"
                    placeholder="Repeat the password"
                    type="password"
                    {...register("rePassword")}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-800">
                Your account will be ready to use for wishlist, cart, checkout,
                and order tracking right after sign up.
              </div>

              <Button
                className="mt-2 w-full"
                isLoading={signupMutation.isPending}
                size="lg"
                type="submit"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Register
              </Button>
            </form>

            <p className="mt-5 text-sm leading-6 text-slate-500">
              By continuing, you agree to our Terms of Service and Privacy
              Policy.
            </p>

            <div className="mt-5 rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/80 px-4 py-4 text-sm text-slate-600 sm:hidden">
              <p className="font-semibold text-slate-900">Why create an account?</p>
              <p className="mt-1 leading-6">
                Save your wishlist, checkout faster, and keep all your orders in
                one place.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
