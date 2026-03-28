export const SITE_NAME = "FreshCart";
export const API_BASE_URL = "https://ecommerce.routemisr.com/api";
export const AUTH_COOKIE_KEY = "freshcart_token";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
] as const;

export const FEATURE_HIGHLIGHTS = [
  {
    title: "Free Shipping",
    description: "On orders over 500 EGP",
  },
  {
    title: "Secure Payment",
    description: "100% secure transactions",
  },
  {
    title: "Easy Returns",
    description: "14-day return policy",
  },
  {
    title: "24/7 Support",
    description: "Dedicated support team",
  },
] as const;

export const HERO_SLIDES = [
  {
    id: "fresh-delivery",
    eyebrow: "Everyday essentials",
    title: "Fresh Products Delivered to your Door",
    description: "Get 20% off your first order",
    primaryAction: { href: "/products", label: "Shop Now" },
    secondaryAction: { href: "/products?sort=-ratingsAverage", label: "View Deals" },
    image: "/home-slider-1.png",
  },
  {
    id: "premium-quality",
    eyebrow: "Fresh from farm to table",
    title: "Premium Quality Guaranteed",
    description: "Shop trusted products with cleaner checkout and faster delivery.",
    primaryAction: { href: "/products", label: "Shop Now" },
    secondaryAction: { href: "/about", label: "Learn More" },
    image: "/home-slider-1.png",
  },
  {
    id: "smart-savings",
    eyebrow: "Daily savings",
    title: "Shop smart, stock fast, save more on your favorites",
    description: "Browse categories, compare products, and fill the cart in one smooth flow.",
    primaryAction: { href: "/products", label: "Shop Now" },
    secondaryAction: { href: "/categories", label: "Browse Categories" },
    image: "/home-slider-1.png",
  },
] as const;
