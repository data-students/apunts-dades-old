import { cn } from "@/lib/utils"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Toaster } from "@/components/ui/Toaster"
import Providers from "@/components/Providers"

export const metadata = {
  title: "Apunts Dades",
  description:
    "Un forum per a compartir, recomanar i discutir sobre apunts del Grau en Ciència i Enginyeria de Dades (GCED) de la UPC",
}

const inter = Inter({ subsets: ["latin"] }) // TODO: Fer servir la font de l'AED

export default async function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode
  authModal: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-slate-900 antialiased light",
        inter.className,
      )}
    >
      <body className="min-h-screen pt-12 bg-slate-50 antialiased">
        <Providers>
          {/* @ts-expect-error server component */}
          <Navbar />

          {authModal}

          <div className="container max-w-7xl mx-auto h-full pt-12">
            {children}
          </div>

          <Toaster />

          {/* @ts-expect-error server component */}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
