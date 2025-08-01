import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Breadcrumbs from "@/components/breadcrumbs"
import ArticleCard from "@/components/article-card"
import { getCategoryBySlug, getSubcategoryBySlug, getArticlesBySubcategory } from "@/lib/data"

interface Props {
  params: Promise<{ category: string,subcategory:string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug,subcategory: subcategorySlug} = await params; 
  const category = getCategoryBySlug(categorySlug)
  const subcategory = getSubcategoryBySlug(categorySlug, subcategorySlug)

  if (!category || !subcategory) {
    return {
      title: "Página no encontrada",
    }
  }

  return {
    title: `${subcategory.name} - ${category.name} | EnergyHub`,
    description: subcategory.description,
    openGraph: {
      title: `${subcategory.name} - ${category.name} | EnergyHub`,
      description: subcategory.description,
      url: `/${category.id}/${subcategory.id}`,
      images: [
        {
          url: `/placeholder.svg?height=630&width=1200&text=${encodeURIComponent(subcategory.name)}`,
          width: 1200,
          height: 630,
          alt: subcategory.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${subcategory.name} - ${category.name} | EnergyHub`,
      description: subcategory.description,
      images: [`/placeholder.svg?height=630&width=1200&text=${encodeURIComponent(subcategory.name)}`],
    },
  }
}

export default async function SubcategoryPage({ params }: Props) {
  const { category: categorySlug,subcategory: subcategorySlug} = await params; 
  const category = getCategoryBySlug(categorySlug)
  const subcategory = getSubcategoryBySlug(categorySlug, subcategorySlug)
  const articles = await getArticlesBySubcategory(categorySlug, subcategorySlug)

  if (!category || !subcategory) {
    notFound()
  }

  const breadcrumbs = [
    { label: category.name, href: `/${category.id}` },
    { label: subcategory.name, href: `/${category.id}/${subcategory.id}` },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">{subcategory.name}</h1>
        <p className="text-xl text-gray-600 mb-8">{subcategory.description}</p>
      </div>

      {/* Articles */}
      {articles.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold mb-6">Artículos en {subcategory.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No hay artículos disponibles en esta subcategoría aún.</p>
        </div>
      )}
    </div>
  )
}
