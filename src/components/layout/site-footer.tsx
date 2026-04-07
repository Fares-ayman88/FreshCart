import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Headphones,
  Instagram,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  ShieldCheck,
  Truck,
  Twitter,
  Youtube,
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
  { href: "https://www.facebook.com", icon: Facebook, label: "Facebook" },
  { href: "https://x.com", icon: Twitter, label: "Twitter" },
  { href: "https://www.instagram.com", icon: Instagram, label: "Instagram" },
  { href: "https://www.youtube.com", icon: Youtube, label: "YouTube" },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative left-1/2 w-screen -translate-x-1/2">
      <div className="border-t border-[#d8efe0] bg-[#effcf1]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-7 sm:px-6 md:grid-cols-2 xl:grid-cols-4 lg:px-8">
          {footerHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="flex items-center gap-4">
                <span className="flex h-[3.75rem] w-[3.75rem] shrink-0 items-center justify-center rounded-[1.1rem] bg-[#dcf8e2] text-[var(--brand)]">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-[1.2rem] font-semibold tracking-[-0.03em] text-slate-900">
                    {item.title}
                  </p>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#111b2d] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.45fr_0.9fr_0.9fr_0.9fr_0.85fr] lg:px-8 lg:py-14">
          <div className="space-y-6">
            <div className="inline-flex rounded-2xl bg-white px-6 py-4">
              <Image
                alt="FreshCart"
                className="h-8 w-auto"
                height={32}
                src="/freshcart-logo.svg"
                width={196}
              />
            </div>

            <p className="max-w-md text-lg leading-9 text-slate-300">
              FreshCart is your one-stop destination for quality products. From
              fashion to electronics, we bring you the best brands at competitive
              prices with a seamless shopping experience.
            </p>

            <div className="space-y-4 text-[1.05rem] text-slate-300">
              <a className="flex items-center gap-3 transition hover:text-white" href="tel:+18001234567">
                <Phone className="h-5 w-5 text-[var(--brand)]" />
                <span>+1 (800) 123-4567</span>
              </a>
              <a className="flex items-center gap-3 transition hover:text-white" href="mailto:support@freshcart.com">
                <Mail className="h-5 w-5 text-[var(--brand)]" />
                <span>support@freshcart.com</span>
              </a>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-[var(--brand)]" />
                <span>123 Commerce Street, New York, NY 10001</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    aria-label={item.label}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/7 text-slate-300 transition hover:bg-white/12 hover:text-white"
                    href={item.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Icon className="h-5 w-5" />
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
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <p>&copy; 2026 FreshCart. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4">
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
    <div className="space-y-5">
      <h2 className="text-[2rem] font-semibold tracking-[-0.04em] text-white sm:text-[1.9rem] lg:text-[1.8rem]">
        {heading}
      </h2>
      <nav className="grid gap-3 text-lg text-slate-300 sm:text-[1.05rem]">
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
