import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import { Clock, User, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Breadcrumbs from "@/components/breadcrumbs"
import ArticleCard from "@/components/article-card"
import ArticleIndex from "@/components/article-index"
import CategoriesData from '@/data/categories.json'
import { getArticleBySlug, getRelatedArticles, getSubcategoryBySlug, getCategoryBySubcategories } from "@/lib/data"
import { markdownToHtml, extractHeadings, addIdsToHeadings } from "@/lib/markdown"
import { nicheArticleText } from "@/data/dataNiche"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const {slug:articleSlug} = await params
  const article = await getArticleBySlug(articleSlug)

  if (!article) {
    return {
      title: "Artículo no encontrado",
    }
  }

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      url: `/articulo/${article.slug}`,
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: "article",
      publishedTime: article.created_at,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title ,
      description: article.description,
      images: [article.image],
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const {slug:articleSlug} = await params
  const article = await getArticleBySlug(articleSlug)

  if (!article) {
    notFound()
  }
  // article.subcategory[0]

  const category = getCategoryBySubcategories(article.subcategory)
  const subcategory = article.subcategory[0]
  const relatedArticles = await getRelatedArticles(article)
  const headings = extractHeadings(article.content)
  const htmlContent = await markdownToHtml(article.content)
  const processedContent = addIdsToHeadings(htmlContent)

  const breadcrumbs = [
    { label: category?.name || "Categoría", href: `/${category?.id || ""}` },
    { label: subcategory[0] || "Subcategoría", href: `/${category?.id || ""}/${subcategory[0] || ""}` },
    { label: article.title, href: `/articulo/${article.slug}` },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <article>
            {/* Article Header */}
            <header className="mb-8">

              <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

              <div className="flex items-center text-gray-600 mb-6">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="mr-4">{new Date(article.created_at).toLocaleDateString("es-ES") || "no date"}</span>
              </div>

              <p className="text-xl text-gray-600 mb-6">{article.description}</p>

              <div className="relative mb-8">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  width={800}
                  height={400}
                  className="w-full h-64 md:h-96 object-cover rounded-lg"
                />
              </div>
            </header>

            {/* Article Content */}
            <div
              className="prose max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:mb-4 prose-ul:mb-4 prose-ol:mb-4 prose-li:mb-2"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            <Separator className="my-8" />

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Table of Contents */}
            <ArticleIndex headings={headings} />
          </div>
        </div>
        </article>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8">{nicheArticleText.recommended}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedArticles.map((relatedArticle) => (
              <ArticleCard key={relatedArticle.id} article={relatedArticle} />
            ))}
          </div>
        </section>
      )}
    </div>
    </div>
  )
}
