export const SITE_NAME = "FreshCart Pro";
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
    title: "Fast delivery",
    description: "Checkout in minutes and keep track of every order in one place.",
  },
  {
    title: "Smart discovery",
    description: "Search, filter by brand, explore categories, and browse related products.",
  },
  {
    title: "Personalized account",
    description: "Manage your wishlist, profile details, password, and payment flow.",
  },
] as const;

export const HERO_SLIDES = [
  {
    id: "fresh-fashion",
    eyebrow: "New season picks",
    title: "Fresh looks, fast checkout, zero friction.",
    description:
      "A polished storefront experience inspired by FreshCart, powered by Next.js and the Route Academy API.",
    primaryAction: { href: "/products", label: "Shop products" },
    secondaryAction: { href: "/categories", label: "View categories" },
    image:
      "https://ecommerce.routemisr.com/Route-Academy-categories/1681511818071.jpeg",
  },
  {
    id: "kitchen-ready",
    eyebrow: "Daily essentials",
    title: "Build a basket that feels effortless.",
    description:
      "Add to cart, save to wishlist, and jump into secure online or cash payment without leaving the flow.",
    primaryAction: { href: "/cart", label: "Open cart" },
    secondaryAction: { href: "/wishlist", label: "See wishlist" },
    image:
      "https://ecommerce.routemisr.com/Route-Academy-categories/1681511452254.png",
  },
  {
    id: "electronics",
    eyebrow: "Popular brands",
    title: "From brands to subcategories, everything stays organized.",
    description:
      "Dive into product details, compare related items, and move from discovery to order history in one clean journey.",
    primaryAction: { href: "/brands", label: "Browse brands" },
    secondaryAction: { href: "/orders", label: "Track orders" },
    image:
      "https://ecommerce.routemisr.com/Route-Academy-categories/1681511121316.png",
  },
] as const;
