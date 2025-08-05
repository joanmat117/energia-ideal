import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import { Calendar } from "lucide-react"
import Breadcrumbs from "@/components/breadcrumbs"
import ArticleCard from "@/components/article-card"
import { getArticleBySlug, getRelatedArticles, getSubcategoryBySlug, getCategoryBySubcategories } from "@/lib/data"
import { markdownToHtml, extractHeadings, addIdsToHeadings } from "@/lib/markdown"
import { nicheArticleText, nicheSubcategoryPage } from "@/data/dataNiche"
import "./articulo.css"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const {slug:articleSlug} = await params
  const article = await getArticleBySlug(articleSlug)

  if (!article) {
    return {
      title: nicheSubcategoryPage.not_article,
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

  const category = getCategoryBySubcategories(article.subcategory)
  const subcategory = article.subcategory[0]
  const relatedArticles = await getRelatedArticles(article)
  const htmlContent = await markdownToHtml(article.content)
  const processedContent = addIdsToHeadings(htmlContent)

  const breadcrumbs = [
    { label: category?.id || "Categoría", href: `/${category?.id || ""}` },
    { label: subcategory || "Subcategoría", href: `/${category?.id || ""}/${subcategory || ""}` },
    { label: article.title, href: `/articulo/${article.slug}` },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="grid grid-cols-1 relative lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 ">
          <article>
            {/* Article Header */}
            <header className="mb-8">

              <h1 className="text-4xl font-bold mb-4 font-merriweather">{article.title}</h1>

              <div className="flex items-center text-gray-600 mb-6">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="mr-4">{new Date(article.created_at).toLocaleDateString("es-ES") || "no date"}</span>
              </div>

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
              id="article-content" className="max-w-none"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
        </article>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="mt-5  sticky lg:h-screen lg:overflow-auto top-0">
          <h2 className="text-3xl mt-20 font-bold mb-8">{nicheArticleText.recommended}</h2>
          <div className="grid grid-cols-1 gap-8">
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
