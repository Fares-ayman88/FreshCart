"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Gift,
  Headphones,
  Heart,
  LogOut,
  Mail,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  Truck,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";
import { startTransition, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { getCart, getWishlist, queryKeys } from "@/lib/api";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { cn, getInitials } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const clearSession = useAuthStore((state) => state.clearSession);
  const keyword = searchParams.get("keyword") ?? "";

  const cartQuery = useQuery({
    queryKey: queryKeys.cart,
    queryFn: getCart,
    enabled: hydrated && Boolean(token),
  });

  const wishlistQuery = useQuery({
    queryKey: queryKeys.wishlist,
    queryFn: getWishlist,
    enabled: hydrated && Boolean(token),
  });

  const isAuthenticated = Boolean(token);
  const cartCount = cartQuery.data?.numOfCartItems ?? 0;
  const wishlistCount = wishlistQuery.data?.data?.length ?? 0;
  const profileLabel = user?.name?.split(" ")[0] ?? "My Account";

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextKeyword = `${formData.get("keyword") ?? ""}`.trim();

    setMobileMenuOpen(false);

    startTransition(() => {
      const params = new URLSearchParams();

      if (nextKeyword) {
        params.set("keyword", nextKeyword);
      }

      const query = params.toString();
      router.push(query ? `/products?${query}` : "/products");
    });
  }

  function handleLogout() {
    clearSession();
    setMobileMenuOpen(false);
    toast.success("You have been signed out.");
    router.push("/login");
  }

  function isLinkActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  const navLinkClass =
    "inline-flex items-center gap-1 text-[15px] font-medium text-slate-700 transition hover:text-[var(--brand)]";
  const iconButtonClass =
    "relative inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-[var(--brand)]";
  const pillButtonClass =
    "inline-flex h-11 items-center justify-center rounded-full bg-[var(--brand)] px-5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(10,173,10,0.22)] transition hover:bg-[var(--brand-strong)]";
  const mobileNavLinkClass =
    "flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="border-b border-slate-200 bg-slate-50/90">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 text-[13px] text-slate-600 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-4 sm:gap-6">
              <span className="inline-flex min-w-0 items-center gap-2 whitespace-nowrap">
                <Truck className="h-4 w-4 text-[var(--brand)]" />
                Free Shipping on Orders 500 EGP
              </span>
              <span className="hidden items-center gap-2 whitespace-nowrap md:inline-flex">
                <Gift className="h-4 w-4 text-[var(--brand)]" />
                New Arrivals Daily
              </span>
            </div>

            <div className="hidden items-center gap-5 lg:flex">
              <a
                className="inline-flex items-center gap-2 transition hover:text-[var(--brand)]"
                href="tel:+18001234567"
              >
                <Phone className="h-4 w-4" />
                +1 (800) 123-4567
              </a>
              <a
                className="inline-flex items-center gap-2 transition hover:text-[var(--brand)]"
                href="mailto:support@freshcart.com"
              >
                <Mail className="h-4 w-4" />
                support@freshcart.com
              </a>
              <span className="h-4 w-px bg-slate-200" />
              {isAuthenticated ? (
                <>
                  <Link
                    className="inline-flex items-center gap-2 transition hover:text-[var(--brand)]"
                    href="/profile"
                  >
                    <UserRound className="h-4 w-4" />
                    {profileLabel}
                  </Link>
                  <button
                    className="inline-flex items-center gap-2 transition hover:text-[var(--brand)]"
                    type="button"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    className="inline-flex items-center gap-2 transition hover:text-[var(--brand)]"
                    href="/login"
                  >
                    <UserRound className="h-4 w-4" />
                    Sign In
                  </Link>
                  <Link
                    className="inline-flex items-center gap-2 transition hover:text-[var(--brand)]"
                    href="/signup"
                  >
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-4 lg:gap-7">
            <div className="flex items-center gap-3">
              <button
                aria-expanded={mobileMenuOpen}
                aria-label="Open navigation menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-[var(--brand)] hover:text-[var(--brand)] lg:hidden"
                type="button"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>

              <Link className="shrink-0" href="/">
                <Image
                  alt={SITE_NAME}
                  className="h-6 w-auto lg:h-8"
                  height={32}
                  priority
                  src="/freshcart-logo.svg"
                  width={166}
                />
              </Link>
            </div>

            <form
              key={`${pathname}-${keyword}-desktop`}
              className="hidden flex-1 lg:flex lg:max-w-2xl"
              onSubmit={handleSearchSubmit}
            >
              <div className="relative w-full">
                <input
                  defaultValue={keyword}
                  className="h-[3.35rem] w-full rounded-full border border-slate-200 bg-slate-50/80 px-5 pr-14 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[var(--brand)] focus:bg-white focus:ring-4 focus:ring-green-500/10"
                  name="keyword"
                  placeholder="Search for products, brands and more..."
                />
                <button
                  className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--brand)] text-white shadow-[0_10px_20px_rgba(10,173,10,0.28)] transition hover:bg-[var(--brand-strong)]"
                  type="submit"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="hidden items-center gap-5 lg:flex xl:gap-7">
              <nav className="flex items-center gap-5 xl:gap-7">
                {NAV_LINKS.map((link) => {
                  const isActive = isLinkActive(link.href);
                  const isCategoryLink = link.label === "Categories";

                  return (
                    <Link
                      key={link.href}
                      className={cn(
                        navLinkClass,
                        isActive && "font-semibold text-slate-950",
                      )}
                      href={link.href}
                    >
                      {link.label}
                      {isCategoryLink ? <ChevronDown className="h-4 w-4" /> : null}
                    </Link>
                  );
                })}
              </nav>

              <Link
                className="hidden items-center gap-3 border-l border-slate-200 pl-5 xl:flex"
                href="/contact"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                  <Headphones className="h-5 w-5" />
                </span>
                <div className="text-xs leading-5">
                  <p className="text-slate-400">Support</p>
                  <p className="font-semibold text-slate-900">24/7 Help</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                aria-label="Wishlist"
                className={cn(
                  iconButtonClass,
                  "hidden lg:inline-flex",
                  pathname.startsWith("/wishlist") && "text-[var(--brand)]",
                )}
                href="/wishlist"
              >
                <Heart className="h-5 w-5" />
                {isAuthenticated && wishlistCount ? (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand)] px-1 text-[10px] font-semibold text-white">
                    {wishlistCount}
                  </span>
                ) : null}
              </Link>

              <Link
                aria-label="Cart"
                className={cn(
                  iconButtonClass,
                  pathname.startsWith("/cart") && "text-[var(--brand)]",
                )}
                href="/cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {isAuthenticated && cartCount ? (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand)] px-1 text-[10px] font-semibold text-white">
                    {cartCount}
                  </span>
                ) : null}
              </Link>

              {isAuthenticated ? (
                <Link className={cn(pillButtonClass, "px-3 sm:px-5")} href="/profile">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/18 text-xs font-bold text-white">
                    {getInitials(user?.name)}
                  </span>
                  <span className="ml-2 hidden lg:inline">{profileLabel}</span>
                </Link>
              ) : (
                <>
                  <Link
                    aria-label="Sign in"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand)] text-white shadow-[0_14px_32px_rgba(10,173,10,0.22)] transition hover:bg-[var(--brand-strong)] lg:hidden"
                    href="/login"
                  >
                    <UserRound className="h-5 w-5" />
                  </Link>
                  <Link className={cn(pillButtonClass, "hidden lg:inline-flex")} href="/login">
                    <UserRound className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>

          <form
            key={`${pathname}-${keyword}-mobile`}
            className="flex items-center rounded-full border border-slate-200 bg-slate-50/80 px-5 py-2 shadow-sm shadow-slate-200/60 md:hidden"
            onSubmit={handleSearchSubmit}
          >
            <input
              defaultValue={keyword}
              className="h-11 min-w-0 flex-1 border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              name="keyword"
              placeholder="Search for products, brands and more..."
            />
            <button
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand)] text-white transition hover:bg-[var(--brand-strong)]"
              type="submit"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside
            className="absolute inset-y-0 left-0 flex w-full max-w-sm flex-col bg-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
              <Link
                className="shrink-0"
                href="/"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Image
                  alt={SITE_NAME}
                  className="h-6 w-auto"
                  height={32}
                  src="/freshcart-logo.svg"
                  width={166}
                />
              </Link>

              <button
                aria-label="Close navigation menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                type="button"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
              <div className="grid gap-3 rounded-[1.75rem] bg-slate-50 p-4 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[var(--brand)]" />
                  Free Shipping on Orders 500 EGP
                </span>
                <span className="inline-flex items-center gap-2">
                  <Gift className="h-4 w-4 text-[var(--brand)]" />
                  New Arrivals Daily
                </span>
              </div>

              <nav className="grid gap-2">
                {NAV_LINKS.map((link) => {
                  const isActive = isLinkActive(link.href);
                  const isCategoryLink = link.label === "Categories";

                  return (
                    <Link
                      key={link.href}
                      className={cn(
                        mobileNavLinkClass,
                        isActive && "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]",
                      )}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{link.label}</span>
                      {isCategoryLink ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <span className="text-slate-300">/</span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="rounded-[1.75rem] border border-slate-200 p-4">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                    <Headphones className="h-5 w-5" />
                  </span>
                  <div className="text-sm leading-5">
                    <p className="text-slate-500">Support</p>
                    <p className="font-semibold text-slate-900">24/7 Help</p>
                  </div>
                </div>

                <div className="grid gap-3 text-sm text-slate-600">
                  <a
                    className="inline-flex items-center gap-2 transition hover:text-[var(--brand)]"
                    href="tel:+18001234567"
                  >
                    <Phone className="h-4 w-4" />
                    +1 (800) 123-4567
                  </a>
                  <a
                    className="inline-flex items-center gap-2 transition hover:text-[var(--brand)]"
                    href="mailto:support@freshcart.com"
                  >
                    <Mail className="h-4 w-4" />
                    support@freshcart.com
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  className="relative flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="h-4 w-4" />
                  Wishlist
                  {isAuthenticated && wishlistCount ? (
                    <span className="absolute right-3 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand)] px-1 text-[10px] font-semibold text-white">
                      {wishlistCount}
                    </span>
                  ) : null}
                </Link>

                <Link
                  className="relative flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Cart
                  {isAuthenticated && cartCount ? (
                    <span className="absolute right-3 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand)] px-1 text-[10px] font-semibold text-white">
                      {cartCount}
                    </span>
                  ) : null}
                </Link>
              </div>

              {isAuthenticated ? (
                <div className="grid gap-3">
                  <Link
                    className={cn(pillButtonClass, "justify-center")}
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/18 text-xs font-bold text-white">
                      {getInitials(user?.name)}
                    </span>
                    <span className="ml-2">{user?.name ?? "My profile"}</span>
                  </Link>
                  <button
                    className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-medium text-slate-700 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                    type="button"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid gap-3">
                  <Link
                    className={cn(pillButtonClass, "justify-center")}
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserRound className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-medium text-slate-700 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
