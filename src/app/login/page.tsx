"use client";

import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Headphones,
  LockKeyhole,
  Mail,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/api";
import { useGuestOnlyRoute } from "@/lib/hooks";
import { cn, extractErrorMessage } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

const LOGIN_ILLUSTRATION =
  "https://storage.googleapis.com/uxpilot-auth.appspot.com/2e5810ff3e-e750761ebcd4ae5907db.png";

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password should be at least 6 characters."),
});

const heroBenefits = [
  { icon: Truck, label: "Free Delivery" },
  { icon: ShieldCheck, label: "Secure Payment" },
  { icon: Headphones, label: "24/7 Support" },
] as const;

const trustHighlights = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over 500 EGP",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "14-day return policy",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "100% secure checkout",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Contact us anytime",
  },
] as const;

type LoginValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { hydrated, isAuthenticated } = useGuestOnlyRoute();
  const setSession = useAuthStore((state) => state.setSession);
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(schema),
  });

  const loginMutation = useMutation({
    mutationFn: signIn,
    onSuccess: (response) => {
      setSession({
        token: response.token,
        user: response.user,
      });
      toast.success(`Welcome back, ${response.user.name}.`);
      router.replace("/");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

  function handleForgotPassword() {
    toast.info("Password reset flow is not implemented yet.");
  }

  function handleSocialSignIn(provider: "Google" | "Facebook") {
    toast.info(`${provider} sign in is not implemented yet.`);
  }

  if (!hydrated || isAuthenticated) {
    return <div className="h-[60vh] animate-pulse rounded-[2rem] bg-white/70" />;
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(29rem,0.95fr)] xl:items-start">
        <div className="space-y-8">
          <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_22px_55px_rgba(15,23,42,0.08)]">
            <div
              className="aspect-[1.1/0.88] min-h-[20rem] bg-white bg-contain bg-center bg-no-repeat p-6 sm:min-h-[24rem] sm:p-10"
              style={{ backgroundImage: `url("${LOGIN_ILLUSTRATION}")` }}
            />
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <h1 className="section-title !text-[30px] font-bold leading-tight text-slate-950 sm:text-[3rem]">
              FreshCart - Your One-Stop Shop for Fresh Products
            </h1>
            <p className="mt-5 text-[18px] leading-10 text-slate-600">
              Join thousands of happy customers who trust FreshCart for their
              daily grocery needs
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-lg text-slate-600">
              {heroBenefits.map((item) => {
                const Icon = item.icon;

                return (
                  <span key={item.label} className="inline-flex items-center gap-3">
                    <Icon className="h-5 w-5 text-[var(--brand)]" />
                    {item.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_26px_70px_rgba(15,23,42,0.10)] sm:p-8 lg:p-10">
          <div className="text-center">
            <h2 className="section-title text-5xl font-bold tracking-[-0.06em] text-slate-950">
              <span className="text-[var(--brand)]">Fresh</span>Cart
            </h2>
            <p className="mt-7 text-[2.15rem] font-bold tracking-[-0.04em] text-slate-950">
              Welcome Back!
            </p>
            <p className="mt-4 text-xl leading-9 text-slate-600">
              Sign in to continue your fresh shopping experience
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <button
              className="flex h-[3.9rem] w-full items-center justify-center gap-4 rounded-[1.15rem] border border-slate-200 bg-white px-6 text-[1.05rem] font-medium text-slate-700 transition hover:border-[var(--brand)] hover:text-slate-950"
              type="button"
              onClick={() => handleSocialSignIn("Google")}
            >
              <span className="text-[1.9rem] font-bold text-[#ea4335]">G</span>
              Continue with Google
            </button>

            <button
              className="flex h-[3.9rem] w-full items-center justify-center gap-4 rounded-[1.15rem] border border-slate-200 bg-white px-6 text-[1.05rem] font-medium text-slate-700 transition hover:border-[var(--brand)] hover:text-slate-950"
              type="button"
              onClick={() => handleSocialSignIn("Facebook")}
            >
              <span className="text-[1.9rem] font-bold text-[#1877f2]">f</span>
              Continue with Facebook
            </button>
          </div>

          <div className="my-8 flex items-center gap-5 text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            Or continue with email
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <form
            className="space-y-5"
            onSubmit={handleSubmit((values) => loginMutation.mutate(values))}
          >
            <div className="space-y-2">
              <label
                className="block text-[1.02rem] font-semibold text-slate-900"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  className={cn(
                    "h-[4rem] w-full rounded-[1.15rem] border border-slate-200 bg-white pl-14 pr-5 text-[1.05rem] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--brand)] focus:ring-4 focus:ring-green-500/10",
                    errors.email && "border-red-400 focus:border-red-500 focus:ring-red-500/10",
                  )}
                  placeholder="Enter your email"
                  type="email"
                  {...register("email")}
                />
              </div>
              {errors.email ? (
                <p className="text-sm font-medium text-red-600">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label
                  className="block text-[1.02rem] font-semibold text-slate-900"
                  htmlFor="password"
                >
                  Password
                </label>
                <button
                  className="text-[1.02rem] font-medium text-[var(--brand)] transition hover:text-[var(--brand-strong)]"
                  type="button"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  className={cn(
                    "h-[4rem] w-full rounded-[1.15rem] border border-slate-200 bg-white pl-14 pr-14 text-[1.05rem] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--brand)] focus:ring-4 focus:ring-green-500/10",
                    errors.password &&
                      "border-red-400 focus:border-red-500 focus:ring-red-500/10",
                  )}
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p className="text-sm font-medium text-red-600">
                  {errors.password.message}
                </p>
              ) : null}
            </div>

            <label className="inline-flex items-center gap-3 text-[1.02rem] text-slate-700">
              <input
                className="h-5 w-5 rounded border-slate-300 text-[var(--brand)] focus:ring-[var(--brand)]"
                type="checkbox"
              />
              Keep me signed in
            </label>

            <Button
              className="h-[4.1rem] w-full rounded-[1.15rem] text-[2rem] font-bold shadow-[0_18px_40px_rgba(10,173,10,0.22)]"
              isLoading={loginMutation.isPending}
              size="lg"
              type="submit"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 border-t border-slate-200 pt-8 text-center">
            <p className="text-[1.05rem] text-slate-600">
              New to FreshCart?{" "}
              <Link className="font-semibold text-[var(--brand)]" href="/signup">
                Create an account
              </Link>
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                SSL Secured
              </span>
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4" />
                50K+ Users
              </span>
              <span className="inline-flex items-center gap-2">
                <Star className="h-4 w-4" />
                4.9 Rating
              </span>
            </div>
          </div>
        </section>
      </section>

      <section className="grid gap-4 rounded-[2rem] bg-[#eefaf0] p-5 sm:grid-cols-2 xl:grid-cols-4">
        {trustHighlights.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="flex items-center gap-4 rounded-[1.4rem] bg-transparent px-2 py-2"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.1rem] bg-[#dff6e5] text-[var(--brand)]">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-slate-950">
                  {item.title}
                </h3>
                <p className="text-[1rem] text-slate-500">{item.description}</p>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
