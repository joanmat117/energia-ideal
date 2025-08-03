import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Breadcrumbs from "@/components/breadcrumbs"
import ArticleCard from "@/components/article-card"
import { getCategoryBySlug, getSubcategoryBySlug, getArticlesBySubcategory } from "@/lib/data"
import { nicheMetadata, nicheSubcategoryPage } from "@/data/dataNiche"

interface Props {
  params: Promise<{ category: string,subcategory:string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug,subcategory: subcategorySlug} = await params; 
  const category = getCategoryBySlug(categorySlug)
  const subcategory = getSubcategoryBySlug(categorySlug, subcategorySlug)

  if (!category || !subcategory) {
    return {
      title: nicheSubcategoryPage.not_page,
    }
  }

  return {
    title: `${subcategory.name} - ${category.name} | ${nicheMetadata.web_name}`,
    description: subcategory.description,
    openGraph: {
      title: `${subcategory.name} - ${category.name} | ${nicheMetadata.web_name}`,
      description: subcategory.description,
      url: `/${category.id}/${subcategory.id}`,
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
      title: `${subcategory.name} - ${category.name} | ${nicheMetadata.web_name}`,
      description: subcategory.description,
      images: [category.image],
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
    { label: category.id, href: `/${category.id}` },
    { label: subcategory.id, href: `/${category.id}/${subcategory.id}` },
  ]

  return (
    <div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbs} />
    </div>
      <div className="mb-12 px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-4">{subcategory.name}</h1>
        <p className="text-xl text-foreground-800 mb-8">{subcategory.description}</p>
      </div>

      {/* Articles */}
      {articles.length > 0 ? (
        <div className="">
          <h2 className="text-2xl font-bold mb-6 px-4 sm:px-6 lg:px-8">{subcategory.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:px-6 lg:px-8 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-foreground-600 text-lg">{nicheSubcategoryPage.not_articles}</p>
        </div>
      )}
    </div>
  )
}
