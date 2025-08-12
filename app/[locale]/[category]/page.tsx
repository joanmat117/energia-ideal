import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import Breadcrumbs from "@/components/breadcrumbs"
import { getCategoryBySlug, getArticlesByCategory } from "@/lib/data"
import InfiniteScrollComponent from "@/components/InfiniteScrollComponent"
import { getTranslations } from "next-intl/server"

interface Props {
  params: any
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug, locale } = await params
  const t = await getTranslations({locale})
  const category = getCategoryBySlug(categorySlug)

  if (!category) {
    return {
      title: t("CategoryPage.not_subcategory"),
    }
  }

  const baseUrl = t("Metadata.base_url")

  return {
    title: `${t(`categories.${category.id}.name`)} | ${t("Metadata.web_name")}`,
    description: t(`categories.${category.id}.description`),
    alternates: {
      canonical: `${baseUrl}/${locale}/${category.id}`,
      languages: {
        en: `${baseUrl}/en/${category.id}`,
        es:  `${baseUrl}/es/${category.id}`
      }
    },
    openGraph: {
      title: `${t(`categories.${category.id}.name`)} | ${t("Metadata.web_name")}`,
      description: t(`categories.${category.id}.description`),
      url: `${baseUrl}/${locale}/${category.id}`,
      locale: locale === "es" ? "es_ES" : "en_US",
      images: [
        {
          url: category.image,
          width: 1200,
          height: 630,
          alt: t(`categories.${category.id}.name`),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t(`categories.${category.id}.name`)} | ${t("Metadata.web_name")}`,
      description: t(`categories.${category.id}.description`),
      images: [category.image],
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug, locale } = await params
  const category = getCategoryBySlug(categorySlug)
  const t = await getTranslations({locale})

  if (!category) {
    notFound()
  }

  const initialArticles = await getArticlesByCategory(category.id, 5, 0)

  const breadcrumbs = [{ label: category.id, href: `/${category.id}` }]

  async function fetchMoreArticles(limit: number, offset: number) {
    "use server"
    return getArticlesByCategory(category.id, limit, offset)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Category Header */}
      <div className="mb-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl text-foreground-50 font-merriweather font-bold mb-4 flex items-center">
          {t(`categories.${category.id}.name`)}
        </h1>
        <p className="text-xl text-foreground-600 mb-8">{t(`categories.${category.id}.description`)}</p>
      </div>

      {/* Subcategories */}
      <div className="mb-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3 ">
          {category.subcategories.map((subcategory) => (
            <Card
              key={subcategory.id}
              className="group shadow-none px-3 py-2 text-sm hover:opacity-80 cursor-pointer rounded-lg transition border border-background-950 hover:border-accent-600 text-foreground-100"
            >
              <Link href={`/${category.id}/${subcategory.id}`}>
                <CardHeader className="p-0">
                  <CardTitle className="transition text-sm font-medium">
                    {t(`categories.${categorySlug}.subcategories.${subcategory.id}.name`)}
                  </CardTitle>
                </CardHeader>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div className="sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <InfiniteScrollComponent locale={locale} initialData={initialArticles} fetchMore={fetchMoreArticles} />
        </div>
      </div>
    </div>
  )
}
