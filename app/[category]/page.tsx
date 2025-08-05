import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Breadcrumbs from "@/components/breadcrumbs"
import ArticleCard from "@/components/article-card"
import { getCategoryBySlug, getArticlesByCategory } from "@/lib/data"
import { nicheCategoryPage, nicheMetadata, nicheSubcategoryPage } from "@/data/dataNiche"
interface Props {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = getCategoryBySlug(categorySlug)

  if (!category) {
    return {
      title: nicheCategoryPage.not_subcategory,
    }
  }

  return {
    title: `${category.name} | ${nicheMetadata.web_name}`,
    description: category.description,
    openGraph: {
      title: `${category.name} | ${nicheMetadata.web_name}`,
      description: category.description,
      url: `/${category.id}`,
      images: [
        {
          url: category.image,
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | ${nicheMetadata.web_name}`,
      description: category.description,
      images: [category.image],
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug } = await params
  const category = getCategoryBySlug(categorySlug)
  const articles = await getArticlesByCategory(categorySlug)

  if (!category) {
    notFound()
  }

  const breadcrumbs = [{ label: category.id, href: `/${category.id}` }]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbs} />
      </div>

      {/*===========Ad==========*/}

      <div className="mb-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl text-foreground-50 font-merriweather font-bold mb-4 flex items-center">
          {category.name}
        </h1>
        <p className="text-xl text-foreground-600 mb-8">{category.description}</p>
      </div>

      {/* Subcategories */}
      <div className="mb-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {category.subcategories.map((subcategory) => (
            <Card key={subcategory.id} className="group hover:opacity-80 hover:scale-95 cursor-pointer rounded-xl rounded-tl-md hover:shadow-lg transition border border-background-950 hover:border-accent-600 text-foreground-100">
              <Link href={`/${category.id}/${subcategory.id}`}>
              <CardHeader>
                <CardTitle className="transition">
                  {subcategory.name}
                </CardTitle>
                <CardDescription className="text-sm text-foreground-800">{subcategory.description}</CardDescription>
              </CardHeader>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Articles */}
      {articles.length > 0 && (
        <div className="sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
