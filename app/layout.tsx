import type React from "react"
import type { Metadata } from "next"
import { Open_Sans , Merriweather} from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { nicheMetadata } from "@/data/dataNiche"
import { GoogleAnalytics } from '@next/third-parties/google'

const opensans = Open_Sans(
  { subsets: ["latin"],fallback:["sans-serif"] }
)

export const merriweather = Merriweather(
  { subsets: ["latin"],fallback:["serif"] }
)

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
    <head>
    <meta name="apple-mobile-web-app-title" content="Energia Ideal" />
    </head>
      <body className={opensans.className}>
        <div className="min-h-screen bg-background-100 text-foreground-50">
          <Navbar />
          <main className="pb-12 min-h-dvh">{children}</main>
          <footer className="bg-accent-700 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">{nicheMetadata.web_name}</h3>
                  <p className="text-gray-300">
                    {nicheMetadata.description}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Legal</h4>
                  <ul className="space-y-2 text-gray-200">
                    <li>
                      <a href="/privacy-policy.html" className="hover:text-white">
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a href="/legal-advise.html" className="hover:text-white">
                        Legal Notice
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-white/50 mt-8 pt-8 text-center text-gray-100">
                <p>&copy; 2025 {nicheMetadata.web_name}. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
      <GoogleAnalytics gaId="G-LZ5KNC37JZ"/>
    </html>
  )
}
