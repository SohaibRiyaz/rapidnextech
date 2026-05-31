import Link from "next/link"
import type { Metadata } from "next"

// Update the metadata
export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 blur-3xl"
          style={{
            animation: "gradient-animation 20s linear infinite alternate",
          }}
        />
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10 text-center">
        <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-6">
          404
        </h1>
        {/* Update the heading */}
        <h2 className="text-2xl md:text-3xl text-white mb-8">Page Not Found</h2>
        <p className="text-gray-300 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link href="/">
          <button className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
            Return to Home
          </button>
        </Link>
      </div>
    </div>
  )
}
