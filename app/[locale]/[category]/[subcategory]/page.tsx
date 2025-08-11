import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Breadcrumbs from "@/components/breadcrumbs"
import { getCategoryBySlug, getSubcategoryBySlug, getArticlesBySubcategory } from "@/lib/data"
import InfiniteScrollComponent from "@/components/InfiniteScrollComponent"
import { getTranslations } from "next-intl/server"

interface Props {
  params: { category: string; subcategory: string; locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug, subcategory: subcategorySlug, locale } = params
  const t = await getTranslations(locale)

  const category = getCategoryBySlug(categorySlug)
  const subcategory = getSubcategoryBySlug(categorySlug, subcategorySlug)

  if (!category || !subcategory) {
    return {
      title: t("SubcategoryPage.not_page"),
    }
  }

  const baseUrl = t("Metadata.base_url")

  return {
    title: `${subcategory.name} - ${category.name} | ${t("Metadata.web_name")}`,
    description: subcategory.description,
    alternates: {
      canonical: `${baseUrl}/${category.id}/${subcategory.id}`,
    },
    openGraph: {
      title: `${subcategory.name} - ${category.name} | ${t("Metadata.web_name")}`,
      description: subcategory.description,
      url: `${baseUrl}/${category.id}/${subcategory.id}`,
      images: [
        {
          url: category.image,
          width: 1200,
          height: 630,
          alt: subcategory.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${subcategory.name} - ${category.name} | ${t("Metadata.web_name")}`,
      description: subcategory.description,
      images: [category.image],
    },
  }
}

export default async function SubcategoryPage({ params }: Props) {
  const { category: categorySlug, subcategory: subcategorySlug } = params
  const category = getCategoryBySlug(categorySlug)
  const subcategory = getSubcategoryBySlug(categorySlug, subcategorySlug)

  if (!category || !subcategory) {
    notFound()
  }

  const initialArticles = await getArticlesBySubcategory(subcategory.id, 5, 0)

  const breadcrumbs = [
    { label: category.id, href: `/${category.id}` },
    { label: subcategory.id, href: `/${category.id}/${subcategory.id}` },
  ]

  async function fetchMoreArticles(limit: number, offset: number) {
    "use server"
    return getArticlesBySubcategory(subcategory.id, limit, offset)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <div className="mb-12 px-4 sm:px-6 lg:px-8 py-2">
        <h1 className="text-4xl font-bold mb-4">{subcategory.name}</h1>
        <p className="text-xl text-foreground-800 mb-8">{subcategory.description}</p>
      </div>

      {/* Articles */}
      <div className="sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <InfiniteScrollComponent initialData={initialArticles} fetchMore={fetchMoreArticles} />
        </div>
      </div>
    </div>
  )
}
