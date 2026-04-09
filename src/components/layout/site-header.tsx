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
  MapPin,
  Package,
  Phone,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";
import { startTransition, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { getCart, getWishlist, queryKeys } from "@/lib/api";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuPathname, setAccountMenuPathname] = useState<string | null>(null);
  const [accountHash, setAccountHash] = useState("");
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
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
  const accountName = user?.name ?? "My Account";
  const accountEmail = user?.email ?? "Signed in";
  const accountMenuOpen = isAuthenticated && accountMenuPathname === pathname;
  const isAccountRoute =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/addresses") ||
    pathname.startsWith("/my-account");
  const isAccountSettingsRoute = pathname.startsWith("/my-account/settings");
  const isProfileSectionActive =
    isAccountSettingsRoute && accountHash !== "#change-password";
  const isSettingsSectionActive =
    isAccountSettingsRoute && accountHash === "#change-password";
  const accountMenuItems = [
    {
      href: "/profile",
      icon: UserRound,
      label: "My Profile",
      isActive: isProfileSectionActive,
    },
    {
      href: "/orders",
      icon: Package,
      label: "My Orders",
      isActive: pathname.startsWith("/orders") || pathname.startsWith("/allorders"),
    },
    {
      href: "/wishlist",
      icon: Heart,
      label: "My Wishlist",
      isActive: pathname.startsWith("/wishlist"),
    },
    {
      href: "/addresses",
      icon: MapPin,
      label: "Addresses",
      isActive: pathname.startsWith("/my-account/addresses"),
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Settings",
      isActive: isSettingsSectionActive,
    },
  ] as const;

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const syncAccountHash = () => {
      setAccountHash(window.location.hash);
    };

    syncAccountHash();
    window.addEventListener("hashchange", syncAccountHash);

    return () => {
      window.removeEventListener("hashchange", syncAccountHash);
    };
  }, [pathname]);

  useEffect(() => {
    if (!accountMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setAccountMenuPathname(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountMenuPathname(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [accountMenuOpen]);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextKeyword = `${formData.get("keyword") ?? ""}`.trim();

    setAccountMenuPathname(null);
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
    setAccountMenuPathname(null);
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
    "relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-transparent bg-transparent text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white hover:text-[var(--brand)] hover:shadow-[0_14px_26px_rgba(148,163,184,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2";
  const activeIconButtonClass =
    "border-slate-200 bg-white text-[var(--brand)] shadow-[0_12px_24px_rgba(148,163,184,0.2)]";
  const pillButtonClass =
    "inline-flex h-11 items-center justify-center rounded-full bg-[var(--brand)] px-5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(10,173,10,0.22)] transition hover:bg-[var(--brand-strong)]";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-slate-200 bg-white/95 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="border-b border-slate-200 bg-slate-50/90">
          <div className="mx-auto flex max-w-[96rem] items-center justify-between gap-4 px-4 py-3 text-[13px] text-slate-600 sm:px-6 lg:px-8">
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
                    {accountName}
                  </Link>
                  <button
                    className="inline-flex items-center gap-2 transition hover:text-[var(--brand)]"
                    type="button"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
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
        <div className="mx-auto max-w-[96rem] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-4 lg:gap-5 xl:gap-6">
            <div className="flex items-center gap-3">
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
              className="hidden lg:flex lg:w-[34rem] lg:flex-none xl:w-[38rem] 2xl:w-[42rem]"
              onSubmit={handleSearchSubmit}
            >
              <div className="relative w-full">
                <input
                  defaultValue={keyword}
                  className="h-[2.875rem] w-full rounded-full border border-slate-200 bg-white px-5 pr-12 text-[13px] font-medium leading-none tracking-[-0.01em] text-slate-900 outline-none transition-all placeholder:text-[13px] placeholder:text-slate-400 focus:border-[var(--brand)] focus:ring-4 focus:ring-green-500/10 xl:text-[14px] xl:placeholder:text-[14px]"
                  name="keyword"
                  placeholder="Search for products, brands and more..."
                />
                <button
                  className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--brand)] text-white shadow-[0_10px_20px_rgba(10,173,10,0.28)] transition hover:bg-[var(--brand-strong)]"
                  type="submit"
                >
                  <Search className="h-[1.05rem] w-[1.05rem]" />
                </button>
              </div>
            </form>

            <div className="hidden items-center gap-4 lg:flex xl:gap-5">
              <nav className="flex items-center gap-4 xl:gap-5">
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
                className="hidden items-center gap-3 border-l border-slate-200 pl-4 2xl:flex"
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
                  pathname.startsWith("/wishlist") && activeIconButtonClass,
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
                  pathname.startsWith("/cart") && activeIconButtonClass,
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
                <div ref={accountMenuRef} className="relative hidden lg:block">
                  <button
                    aria-controls="desktop-account-menu"
                    aria-expanded={accountMenuOpen}
                    aria-haspopup="menu"
                    aria-label={
                      user?.name ? `Open ${user.name} account menu` : "Open account menu"
                    }
                    className={cn(
                      iconButtonClass,
                      (isAccountRoute || accountMenuOpen) && activeIconButtonClass,
                    )}
                    type="button"
                    onClick={() =>
                      setAccountMenuPathname((current) =>
                        current === pathname ? null : pathname,
                      )
                    }
                  >
                    <UserRound className="h-5 w-5" />
                  </button>

                  <div
                    className={cn(
                      "absolute right-0 top-full z-[70] w-[21rem] pt-4 transition duration-200",
                      accountMenuOpen
                        ? "pointer-events-auto visible translate-y-0 opacity-100"
                        : "pointer-events-none invisible translate-y-2 opacity-0",
                    )}
                    id="desktop-account-menu"
                    role="menu"
                  >
                    <div className="absolute right-5 top-[0.65rem] h-4 w-4 rotate-45 rounded-[0.35rem] border-l border-t border-slate-200 bg-white" />

                    <div className="relative overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_28px_72px_rgba(15,23,42,0.18)]">
                      <div className="flex items-center gap-4 px-5 py-5">
                        <div className="flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                          <UserRound className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[1.15rem] font-semibold text-slate-900">
                            {accountName}
                          </p>
                          <p className="truncate text-sm text-slate-400">
                            {accountEmail}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 px-3 py-3">
                        {accountMenuItems.map((item) => {
                          const Icon = item.icon;

                          return (
                            <Link
                              key={item.label}
                              className={cn(
                                "group/item flex items-center gap-3 rounded-[1.15rem] px-4 py-3.5 text-[15px] font-medium text-slate-600 transition duration-200 hover:bg-[var(--brand-soft)] hover:text-slate-950",
                                item.isActive && "bg-[var(--brand-soft)] text-slate-950",
                              )}
                              href={item.href}
                              role="menuitem"
                              onClick={() => setAccountMenuPathname(null)}
                            >
                              <Icon
                                className={cn(
                                  "h-5 w-5 text-slate-400 transition duration-200 group-hover/item:text-[var(--brand)]",
                                  item.isActive && "text-[var(--brand)]",
                                )}
                              />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>

                      <div className="border-t border-slate-100 px-3 py-3">
                        <button
                          className="flex w-full items-center gap-3 rounded-[1.15rem] px-4 py-3.5 text-[15px] font-medium text-red-500 transition duration-200 hover:bg-red-50"
                          role="menuitem"
                          type="button"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Link className={cn(pillButtonClass, "hidden lg:inline-flex")} href="/login">
                    <UserRound className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </>
              )}

              <button
                aria-expanded={mobileMenuOpen}
                aria-label="Open navigation menu"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand)] text-white shadow-[0_14px_32px_rgba(10,173,10,0.22)] transition hover:bg-[var(--brand-strong)] lg:hidden"
                type="button"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside
            className="absolute inset-y-0 right-0 flex w-full max-w-[21rem] flex-col bg-white shadow-[-24px_0_60px_rgba(15,23,42,0.16)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-5">
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
              <form
                key={`${pathname}-${keyword}-mobile-drawer`}
                className="flex items-center rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-2 shadow-sm shadow-slate-200/60"
                onSubmit={handleSearchSubmit}
              >
                <input
                  defaultValue={keyword}
                  className="h-10 min-w-0 flex-1 border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  name="keyword"
                  placeholder="Search products..."
                />
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-[0.9rem] bg-[var(--brand)] text-white transition hover:bg-[var(--brand-strong)]"
                  type="submit"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>

              <nav className="border-y border-slate-100">
                {NAV_LINKS.map((link) => {
                  const isActive = isLinkActive(link.href);

                  return (
                    <Link
                      key={link.href}
                      className={cn(
                        "flex items-center justify-between border-b border-slate-100 py-4 text-[1.05rem] font-medium text-slate-700 transition last:border-b-0 hover:text-[var(--brand)]",
                        isActive && "text-[var(--brand)]",
                      )}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{link.label}</span>
                      <span className="text-slate-300">/</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="space-y-2 border-b border-slate-100 pb-5">
                <Link
                  className="flex items-center gap-4 rounded-[1rem] px-2 py-3 text-[1.05rem] font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff5f5] text-[#ff5858]">
                    <Heart className="h-5 w-5" />
                  </span>
                  <span className="flex-1">Wishlist</span>
                  {isAuthenticated && wishlistCount ? (
                    <span className="rounded-full bg-[var(--brand)] px-2 py-1 text-xs font-semibold text-white">
                      {wishlistCount}
                    </span>
                  ) : null}
                </Link>

                <Link
                  className="flex items-center gap-4 rounded-[1rem] px-2 py-3 text-[1.05rem] font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                    <ShoppingCart className="h-5 w-5" />
                  </span>
                  <span className="flex-1">Cart</span>
                  {isAuthenticated && cartCount ? (
                    <span className="rounded-full bg-[var(--brand)] px-2 py-1 text-xs font-semibold text-white">
                      {cartCount}
                    </span>
                  ) : null}
                </Link>

                {isAuthenticated ? (
                  <Link
                    className="flex items-center gap-4 rounded-[1rem] px-2 py-3 text-[1.05rem] font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-slate-500">
                      <UserRound className="h-5 w-5" />
                    </span>
                    <span>{accountName}</span>
                  </Link>
                ) : (
                  <div className="grid gap-3 pt-1">
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

                {isAuthenticated ? (
                  <button
                    className="flex w-full items-center gap-4 rounded-[1rem] px-2 py-3 text-left text-[1.05rem] font-medium text-[#ff3b30] transition hover:bg-red-50"
                    type="button"
                    onClick={handleLogout}
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff5f5] text-[#ff3b30]">
                      <LogOut className="h-5 w-5" />
                    </span>
                    <span>Sign Out</span>
                  </button>
                ) : null}
              </div>

              <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                    <Headphones className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[1.02rem] font-semibold text-slate-900">
                      Need Help?
                    </p>
                    <a
                      className="mt-1 inline-flex text-sm font-medium text-[var(--brand)]"
                      href="mailto:support@freshcart.com"
                    >
                      Contact Support
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
