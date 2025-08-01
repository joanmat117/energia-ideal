import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EnergyHub - Generadores, Energía Solar y Estaciones Portátiles",
  description:
    "Tu guía completa sobre generadores eléctricos, paneles solares, estaciones de energía portátil y todo sobre energía renovable.",
  keywords:
    "generadores eléctricos, paneles solares, energía solar, estaciones portátiles, EcoFlow, generadores inverter",
  authors: [{ name: "EnergyHub Team" }],
  creator: "EnergyHub",
  publisher: "EnergyHub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://energyhub.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "EnergyHub - Generadores, Energía Solar y Estaciones Portátiles",
    description:
      "Tu guía completa sobre generadores eléctricos, paneles solares, estaciones de energía portátil y todo sobre energía renovable.",
    url: "https://energyhub.com",
    siteName: "EnergyHub",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200&text=EnergyHub",
        width: 1200,
        height: 630,
        alt: "EnergyHub - Tu guía de energía",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EnergyHub - Generadores, Energía Solar y Estaciones Portátiles",
    description:
      "Tu guía completa sobre generadores eléctricos, paneles solares, estaciones de energía portátil y todo sobre energía renovable.",
    images: ["/placeholder.svg?height=630&width=1200&text=EnergyHub"],
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
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pb-12">{children}</main>
          <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
                        Política de Privacidad
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Términos de Uso
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 EnergyHub. Todos los derechos reservados.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
