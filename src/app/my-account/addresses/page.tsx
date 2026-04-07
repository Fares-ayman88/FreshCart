"use client";

import { MapPin, Phone, ShieldCheck } from "lucide-react";

import { useMyAccount } from "@/components/account/my-account-shell";

export default function AccountAddressesPage() {
  const { profile } = useMyAccount();
  const addresses = profile?.addresses ?? [];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="section-title text-[2rem] font-bold text-slate-950 sm:text-[2.3rem]">
          My Addresses
        </h2>
        <p className="max-w-2xl text-base leading-7 text-slate-500">
          Review the saved locations linked to your account for faster checkout
        </p>
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.45rem] bg-[var(--brand-soft)] text-[var(--brand)]">
            <MapPin className="h-7 w-7" />
          </span>
          <div className="space-y-1">
            <h3 className="text-[1.75rem] font-semibold tracking-[-0.04em] text-slate-950">
              Saved Addresses
            </h3>
            <p className="text-base text-slate-500">
              {addresses.length
                ? `${addresses.length} saved address${addresses.length > 1 ? "es" : ""} available for delivery`
                : "No saved delivery addresses were found on your account yet."}
            </p>
          </div>
        </div>

        {addresses.length ? (
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {addresses.map((address, index) => (
              <article
                key={address._id ?? `${address.city}-${index}`}
                className="rounded-[1.6rem] border border-slate-200 bg-slate-50/60 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-[1.2rem] font-semibold text-slate-950">
                      {address.city}
                    </p>
                    <p className="text-sm leading-6 text-slate-500">
                      {address.details}
                    </p>
                  </div>

                  {index === 0 ? (
                    <span className="inline-flex rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
                      Primary
                    </span>
                  ) : null}
                </div>

                <div className="mt-5 flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="h-4 w-4 text-[var(--brand)]" />
                  <span>{address.phone}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50/70 p-8">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.2rem] bg-white text-[var(--brand)] shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <div className="space-y-2">
                <h4 className="text-xl font-semibold text-slate-950">
                  No saved addresses yet
                </h4>
                <p className="max-w-xl text-sm leading-7 text-slate-500">
                  Once you add a shipping address during checkout or from your
                  account tools, it will appear here for faster future orders.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
