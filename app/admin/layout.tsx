import type { Metadata } from "next"
import { AuthProvider } from "@/context/auth-context"

export const metadata: Metadata = {
  title: { absolute: "Admin | RapidNexTech" },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
