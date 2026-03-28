import { Suspense } from "react";
import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";

import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import "./globals.css";

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const headingFont = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FreshCart",
  description:
    "A modern e-commerce storefront built with Next.js, TypeScript, and the Route Academy API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${headingFont.variable}`}>
        <Providers>
          <div className="relative min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,_rgba(10,173,10,0.18),_transparent_48%),linear-gradient(180deg,_rgba(244,248,236,0.95),_rgba(255,255,255,1))]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-96 bg-[radial-gradient(circle_at_center,_rgba(13,148,136,0.12),_transparent_60%)] lg:block" />
            <Suspense
              fallback={
                <div className="sticky top-0 z-40 h-32 border-b border-white/70 bg-white/80 backdrop-blur-2xl" />
              }
            >
              <SiteHeader />
            </Suspense>
            <main className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-7xl flex-col px-4 pb-16 pt-8 sm:px-6 lg:px-8">
              {children}
            </main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
