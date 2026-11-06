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
    webpackBuildWorker: true,
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
      // Short links for the birthday page. Temporary (307) on purpose: they can be removed later.
      { source: "/treat-pending/hammad", destination: "/birthday/hammad", permanent: false },
      { source: "/hbd/hammad", destination: "/birthday/hammad", permanent: false },
      {
        source: "/book/medspa",
        destination: "/contact?bookingSource=medspa&fromBook=1",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
