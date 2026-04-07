"use client";

import Link from "next/link";
import {
  ChevronRight,
  MapPin,
  Settings,
  UserRound,
} from "lucide-react";
import {
  createContext,
  useContext,
  type PropsWithChildren,
} from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getProfile, queryKeys } from "@/lib/api";
import { useProtectedRoute } from "@/lib/hooks";
import type { UserProfile } from "@/lib/types";
import { cn, extractErrorMessage } from "@/lib/utils";

interface MyAccountContextValue {
  profile: UserProfile | null;
}

const MyAccountContext = createContext<MyAccountContextValue | null>(null);

const accountNavigation = [
  {
    href: "/my-account/addresses",
    icon: MapPin,
    label: "My Addresses",
    description: "Manage where your orders should arrive.",
  },
  {
    href: "/my-account/settings",
    icon: Settings,
    label: "Settings",
    description: "Update your profile and account security.",
  },
] as const;

export function useMyAccount() {
  const context = useContext(MyAccountContext);

  if (!context) {
    throw new Error("useMyAccount must be used inside MyAccountShell.");
  }

  return context;
}

export function MyAccountShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { canRender, hydrated } = useProtectedRoute();

  const profileQuery = useQuery({
    queryKey: queryKeys.me,
    queryFn: getProfile,
    enabled: canRender,
  });

  if (!hydrated || !canRender) {
    return <div className="h-[60vh] animate-pulse rounded-[2rem] bg-white/70" />;
  }

  if (profileQuery.isLoading && !profileQuery.data?.data) {
    return <div className="h-[70vh] animate-pulse rounded-[2rem] bg-white/70" />;
  }

  if (profileQuery.isError) {
    return (
      <div className="rounded-[2rem] border border-red-100 bg-red-50 px-6 py-5 text-sm text-red-700">
        {extractErrorMessage(profileQuery.error)}
      </div>
    );
  }

  const profile = profileQuery.data?.data ?? null;

  return (
    <MyAccountContext.Provider value={{ profile }}>
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <section className="bg-[linear-gradient(135deg,_rgba(8,176,57,1)_0%,_rgba(70,223,130,1)_100%)]">
          <div className="mx-auto max-w-7xl px-4 py-10 text-white sm:px-6 lg:px-8 lg:py-12">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Link className="transition hover:text-white" href="/">
                Home
              </Link>
              <span>/</span>
              <span className="text-white">My Account</span>
            </div>

            <div className="mt-8 flex items-start gap-5">
              <div className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-[1.4rem] border border-white/20 bg-white/12 shadow-[0_16px_40px_rgba(6,24,14,0.14)] backdrop-blur-md">
                <UserRound className="h-8 w-8 text-white" />
              </div>
              <div className="max-w-xl space-y-2">
                <h1 className="section-title text-4xl font-bold text-white sm:text-[2.6rem]">
                  My Account
                </h1>
                <p className="max-w-xl text-base leading-7 text-white/90 sm:text-lg">
                  Manage your addresses and account settings
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white/80">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            <div className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)] xl:gap-8">
              <aside className="surface-card h-fit overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
                <div className="border-b border-slate-100 px-5 py-5">
                  <h2 className="text-[1.1rem] font-semibold text-slate-950 sm:text-[1.25rem]">
                    My Account
                  </h2>
                </div>

                <nav className="grid gap-2 p-3">
                  {accountNavigation.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        className={cn(
                          "flex items-center gap-4 rounded-[1.2rem] px-4 py-4 text-slate-600 transition hover:bg-slate-50 hover:text-slate-950",
                          isActive && "bg-[var(--brand-soft)] text-[var(--brand)]",
                        )}
                        href={item.href}
                      >
                        <span
                          className={cn(
                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500",
                            isActive && "bg-[var(--brand)] text-white",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-lg font-medium xl:text-[1.05rem]">
                            {item.label}
                          </p>
                          <p
                            className={cn(
                              "mt-0.5 hidden text-sm leading-6 text-slate-400 xl:block",
                              isActive && "text-[var(--brand)]/70",
                            )}
                          >
                            {item.description}
                          </p>
                        </div>
                        <ChevronRight
                          className={cn(
                            "h-5 w-5 shrink-0 text-slate-400",
                            isActive && "text-[var(--brand)]",
                          )}
                        />
                      </Link>
                    );
                  })}
                </nav>
              </aside>

              <div className="min-w-0">{children}</div>
            </div>
          </div>
        </section>
      </div>
    </MyAccountContext.Provider>
  );
}
