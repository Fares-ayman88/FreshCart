import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  CirclePlay,
  Globe,
  Headphones,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Send,
  ShieldCheck,
  Truck,
} from "lucide-react";

const footerHighlights = [
  {
    description: "On orders over 500 EGP",
    icon: Truck,
    title: "Free Shipping",
  },
  {
    description: "14-day return policy",
    icon: RotateCcw,
    title: "Easy Returns",
  },
  {
    description: "100% secure checkout",
    icon: ShieldCheck,
    title: "Secure Payment",
  },
  {
    description: "Contact us anytime",
    icon: Headphones,
    title: "24/7 Support",
  },
] as const;

const shopLinks = [
  { href: "/products", label: "All Products" },
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
  { href: "/products?category=electronics", label: "Electronics" },
  { href: "/products?category=men's fashion", label: "Men's Fashion" },
  { href: "/products?category=women's fashion", label: "Women's Fashion" },
] as const;

const accountLinks = [
  { href: "/my-account/settings", label: "My Account" },
  { href: "/orders", label: "Order History" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/cart", label: "Shopping Cart" },
  { href: "/login", label: "Sign In" },
  { href: "/signup", label: "Create Account" },
] as const;

const supportLinks = [
  { href: "/about", label: "Contact Us" },
  { href: "/about", label: "Help Center" },
  { href: "/about", label: "Shipping Info" },
  { href: "/about", label: "Returns & Refunds" },
  { href: "/orders", label: "Track Order" },
] as const;

const legalLinks = [
  { href: "/about", label: "Privacy Policy" },
  { href: "/about", label: "Terms of Service" },
  { href: "/about", label: "Cookie Policy" },
] as const;

const socialLinks = [
  { href: "https://www.facebook.com", icon: Globe, label: "Facebook" },
  { href: "https://x.com", icon: Send, label: "Twitter" },
  { href: "https://www.instagram.com", icon: Camera, label: "Instagram" },
  { href: "https://www.youtube.com", icon: CirclePlay, label: "YouTube" },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative left-1/2 w-screen -translate-x-1/2">
      <div className="border-t border-[#d8efe0] bg-[#effcf1]">
        <div className="grid w-full gap-4 px-4 py-4 sm:grid-cols-2 md:grid-cols-4 md:gap-5 md:py-5">
          {footerHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.95rem] bg-[#dcf8e2] text-[var(--brand)] md:h-11 md:w-11">
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold tracking-[-0.02em] text-slate-900 md:text-[0.95rem]">
                    {item.title}
                  </p>
                  <p className="text-[0.78rem] leading-5 text-slate-500 md:text-[0.8rem]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#111b2d] text-white">
        <div className="grid w-full gap-y-8 px-4 py-9 md:grid-cols-[1.45fr_repeat(4,minmax(0,0.72fr))] md:gap-x-7 md:gap-y-10 md:py-9 lg:grid-cols-[1.55fr_repeat(4,minmax(0,0.7fr))] lg:gap-x-10">
          <div className="space-y-5 md:max-w-[18rem] lg:max-w-[22rem]">
            <div className="inline-flex rounded-xl bg-white px-4 py-2.5 shadow-[0_8px_22px_rgba(15,23,42,0.16)]">
              <Image
                alt="FreshCart"
                className="h-6 w-auto md:h-7"
                height={32}
                src="/freshcart-logo.svg"
                width={196}
              />
            </div>

            <p className="max-w-[20rem] text-sm leading-7 text-slate-300 md:max-w-none md:text-[0.92rem]">
              FreshCart is your one-stop destination for quality products. From
              fashion to electronics, we bring you the best brands at competitive
              prices with a seamless shopping experience.
            </p>

            <div className="space-y-2.5 text-sm text-slate-300 md:text-[0.92rem]">
              <a className="flex items-center gap-3 transition hover:text-white" href="tel:+18001234567">
                <Phone className="h-4 w-4 shrink-0 text-[var(--brand)]" />
                <span>+1 (800) 123-4567</span>
              </a>
              <a className="flex items-center gap-3 transition hover:text-white" href="mailto:support@freshcart.com">
                <Mail className="h-4 w-4 shrink-0 text-[var(--brand)]" />
                <span>support@freshcart.com</span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-[var(--brand)]" />
                <span>123 Commerce Street, New York, NY 10001</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    aria-label={item.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/7 text-slate-300 transition hover:bg-white/12 hover:text-white md:h-11 md:w-11"
                    href={item.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Icon className="h-4 w-4 md:h-[1.1rem] md:w-[1.1rem]" />
                  </a>
                );
              })}
            </div>
          </div>

          <FooterColumn heading="Shop" links={shopLinks} />
          <FooterColumn heading="Account" links={accountLinks} />
          <FooterColumn heading="Support" links={supportLinks} />
          <FooterColumn heading="Legal" links={legalLinks} />
        </div>

        <div className="border-t border-white/8">
          <div className="flex w-full flex-col gap-3 px-4 py-4 text-[0.8rem] text-slate-500 md:flex-row md:items-center md:justify-between md:py-5 md:text-[0.85rem]">
            <p>&copy; 2026 FreshCart. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}) {
  return (
    <div className="space-y-3.5 md:space-y-4">
      <h2 className="text-[1rem] font-semibold tracking-[-0.02em] text-white md:text-[1.05rem] lg:text-[1.1rem]">
        {heading}
      </h2>
      <nav className="grid gap-2.5 text-[0.92rem] leading-6 text-slate-300">
        {links.map((link) => (
          <Link
            key={link.label}
            className="transition hover:text-white"
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
