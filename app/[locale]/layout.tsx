import type React from "react";
import type { Metadata } from "next";
import { Open_Sans, Merriweather } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/navbar";
import { GoogleAnalytics } from "@next/third-parties/google";
import Footer from "@/components/Footer";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

export const opensans = Open_Sans({ subsets: ["latin"], fallback: ["sans-serif"] });
export const merriweather = Merriweather({ subsets: ["latin"], fallback: ["serif"] });

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  let t;
  try {
    t = await getTranslations(locale);
  } catch (e) {
    notFound();
  }

  return {
    title: t("Metadata.title"),
    description: t("Metadata.description"),
    authors: [{ name: t("Metadata.web_name") + " Team" }],
    creator: t("Metadata.web_name"),
    publisher: t("Metadata.web_name"),
    formatDetection: {
      email: false,
      address: false,
      telephone: false
    },
    metadataBase: new URL(t("Metadata.base_url")),
    alternates: {
      canonical: "/"
    },
    openGraph: {
      title: t("Metadata.title"),
      description: t("Metadata.description"),
      url: t("Metadata.base_url"),
      siteName: t("Metadata.web_name"),
      images: [
        {
          url: t("Metadata.meta_image"),
          width: 1200,
          height: 630,
          alt: t("Metadata.title")
        }
      ],
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: t("Metadata.title"),
      description: t("Metadata.description"),
      images: [t("Metadata.meta_image")]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1
      }
    }
  };
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;

  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (e) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <meta name="apple-mobile-web-app-title" content={messages.Metadata.web_name} />
      </head>
      <body className={opensans.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="min-h-screen bg-background-100 text-foreground-50">
            <Navbar />
            <main className="pb-12 min-h-dvh">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
        <GoogleAnalytics gaId="G-LZ5KNC37JZ" />
      </body>
    </html>
  );
}
