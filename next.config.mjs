/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  experimental: {
    missingSuspenseWithCSRBailout: false,
  },

  // Use static export only when explicitly requested via NEXT_OUTPUT=export
  ...(process.env.NEXT_OUTPUT === "export" ? { output: "export" } : {}),
}

export default nextConfig
