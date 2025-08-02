import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Breadcrumbs from "@/components/breadcrumbs"
import ArticleCard from "@/components/article-card"
import { getCategoryBySlug, getArticlesByCategory } from "@/lib/data"

interface Props {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = getCategoryBySlug(categorySlug)

  if (!category) {
    return {
      title: "Categoría no encontrada",
    }
  }

  return {
    title: `${category.name} | EnergyHub`,
    description: category.description,
    openGraph: {
      title: `${category.name} | EnergyHub`,
      description: category.description,
      url: `/${category.id}`,
      images: [
        {
          url: `/placeholder.svg?height=630&width=1200&text=${encodeURIComponent(category.name)}`,
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | EnergyHub`,
      description: category.description,
      images: [`/placeholder.svg?height=630&width=1200&text=${encodeURIComponent(category.name)}`],
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

  const breadcrumbs = [{ label: category.name, href: `/${category.id}` }]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center">
          {category.name}
        </h1>
        <p className="text-xl text-gray-600 mb-8">{category.description}</p>
      </div>

      {/* Subcategories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Subcategorías</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.subcategories.map((subcategory) => (
            <Card key={subcategory.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="group-hover:text-indigo-600 transition-colors">
                  <Link href={`/${category.id}/${subcategory.id}`}>{subcategory.name}</Link>
                </CardTitle>
                <CardDescription>{subcategory.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Articles */}
      {articles.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Artículos Relacionados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
