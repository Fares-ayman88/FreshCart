/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/register",
        destination: "/signup",
        permanent: false,
      },
      {
        source: "/deals",
        destination: "/products",
        permanent: false,
      },
      {
        source: "/track-order",
        destination: "/orders",
        permanent: false,
      },
      {
        source: "/contact",
        destination: "/about",
        permanent: false,
      },
      {
        source: "/help",
        destination: "/about",
        permanent: false,
      },
      {
        source: "/shipping",
        destination: "/checkout",
        permanent: false,
      },
      {
        source: "/returns",
        destination: "/orders",
        permanent: false,
      },
      {
        source: "/privacy",
        destination: "/about",
        permanent: false,
      },
      {
        source: "/terms",
        destination: "/about",
        permanent: false,
      },
      {
        source: "/cookies",
        destination: "/about",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ecommerce.routemisr.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
