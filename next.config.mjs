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

  async redirects() {
    return [
      {
        source: "/book/dental",
        destination: "/contact?bookingSource=dental&fromBook=1",
        permanent: true,
      },
      {
        source: "/book/aesthetic",
        destination: "/contact?bookingSource=aesthetic&fromBook=1",
        permanent: true,
      },
      {
        source: "/book/medspa",
        destination: "/contact?bookingSource=medspa&fromBook=1",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
