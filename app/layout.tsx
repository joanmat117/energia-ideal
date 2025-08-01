import type React from "react"
import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { nicheHeaderAndFooter, nicheMetadata } from "@/data/dataNiche"

const roboto = Roboto({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: nicheMetadata.title,
  description: nicheMetadata.description,
  authors: [{ name: nicheMetadata.web_name + " Team" }],
  creator: nicheMetadata.web_name,
  publisher: nicheMetadata.web_name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(nicheMetadata.base_url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: nicheMetadata.title,
    description:nicheMetadata.description,
    url: nicheMetadata.base_url,
    siteName: nicheMetadata.web_name,
    images: [
      {
        url: nicheMetadata.meta_image,
        width: 1200,
        height: 630,
        alt: nicheMetadata.title,
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: nicheMetadata.title,
    description:nicheMetadata.description,
    images: [nicheMetadata.base_url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={roboto.className}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pb-12">{children}</main>
          <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">EnergyHub</h3>
                  <p className="text-gray-400">
                    Tu guía completa sobre generadores eléctricos, energía solar y estaciones portátiles.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Categorías</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li>
                      <a href="/generadores-electricos" className="hover:text-white">
                        Generadores Eléctricos
                      </a>
                    </li>
                    <li>
                      <a href="/energia-solar" className="hover:text-white">
                        Energía Solar
                      </a>
                    </li>
                    <li>
                      <a href="/estaciones-portatiles" className="hover:text-white">
                        Estaciones Portátiles
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Recursos</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li>
                      <a href="/guias-consejos" className="hover:text-white">
                        Guías y Consejos
                      </a>
                    </li>
                    <li>
                      <a href="/destacados" className="hover:text-white">
                        Destacados
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Legal</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li>
                      <a href="#" className="hover:text-white">
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Terms
                      </a>
                    </li>
                  </ul>
                </div>
              </div> */}
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 {nicheMetadata.web_name}. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
