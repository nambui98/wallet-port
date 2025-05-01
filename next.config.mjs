import withPWAInit from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */
const withPWA = withPWAInit({
  dest: "public",
});

export default withPWA({
  output: "standalone",
  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/sepolia/:path*",
        destination: (process.env.NEXT_PUBLIC_BACKEND_API__SEPOLIA ?? '') + "/:path*",
      },
      {
        source: "/api/base-sepolia/:path*",
        destination: (process.env.NEXT_PUBLIC_BACKEND_API__BASE_SEPOLIA ?? '') + "/:path*",
      },
      {
        source: "/rpc/base-sepolia",
        destination: "https://rpc.ankr.com/base_sepolia/820e92203a6b2da998129630ed426bba0175623ee8299707de51b0dc27a915f1",
      }
    ]
  },

});

