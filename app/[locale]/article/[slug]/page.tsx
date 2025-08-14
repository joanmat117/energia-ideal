import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { Calendar } from "lucide-react";
import Breadcrumbs from "@/components/breadcrumbs";
import ArticleCard from "@/components/article-card";
import {
  getArticleBySlug,
  getRelatedArticles,
  getCategoryBySubcategories,
} from "@/lib/data";
import { markdownToHtml, addIdsToHeadings } from "@/lib/markdown";
import { getTranslations } from "next-intl/server";
import "./articulo.css";
import AdsterraAdBanner from "@/components/AdsterraAdBanner";

interface Props {
  params:any;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: articleSlug, locale } = await params;
  const t = await getTranslations({locale});

  const article = await getArticleBySlug(articleSlug);

  if (!article) {
    return {
      title: t("SubcategoryPage.not_article") || "Artículo no encontrado",
    };
  }

  const baseUrl = t("Metadata.base_url")

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `${baseUrl}/${locale}/article/${article.slug}`,
      languages: {
        en: `${baseUrl}/en/article/${article.slug}`,
        es:  `${baseUrl}/es/article/${article.slug}`
      }
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `${baseUrl}/${locale}/article/${article.slug}`,
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
      locale: locale === "es" ? "es_ES" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [article.image],
    },
  };
}


export default async function ArticlePage({ params }: Props) {
  const { slug: articleSlug, locale } = await params;

  const t = await getTranslations({locale});

  const article = await getArticleBySlug(articleSlug);
  if (!article) {
    notFound();
  }

  const category = getCategoryBySubcategories(article.subcategory[0]);
  const subcategory = article.subcategory[0];
  const relatedArticles = await getRelatedArticles(article);
  const htmlContent = await markdownToHtml(article.content);
  const processedContent = addIdsToHeadings(htmlContent);
  
  const titleArticle = locale == 'en' && article.title_en ? "title_en" : "title"

  const breadcrumbs = [
    { label: t(`categories.${category?.id}.name`) || t("CategoryPage.not_subcategory"), href: `/${category?.id || ""}` },
    { label: t(`categories.${category?.id}.subcategories.${subcategory}.name`) || t("CategoryPage.not_subcategory"), href: `/${category?.id || ""}/${subcategory || ""}` },
    { label: article[titleArticle] || article.title, href: `/article/${article.slug}` }, // Ruta en inglés y sin tilde
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="grid grid-cols-1 relative lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <article>
            {/* Article Header */}
            <header className="mb-8">
              <AdsterraAdBanner adKey="02ff867c12fb06007c19385dcca603b9" height={50} width={320}/>
              <h1 className="text-4xl font-bold mb-4 font-merriweather">{article[titleArticle]}</h1>

              <div className="flex items-center text-gray-600 mb-6">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="mr-4">
                  {new Date(article.created_at).toLocaleDateString(locale === "es" ? "es-ES" : "en-US") || "no date"}
                </span>
              </div>

              <div className="relative mb-8">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  width={800}
                  height={400}
                  className="w-full h-64 md:h-96 object-cover rounded-lg"
                />
                <AdsterraAdBanner adKey="5a7109c19094b265cfcde808d7765658" width={300} height={250}/>
                
              </div>
            </header>

            {/* Article Content */}
            <div
              id="article-content"
              className="max-w-none"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          </article>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="py-5">
            <h2 className="text-3xl mt-20 font-bold mb-8">{t("ArticleText.recommended")}</h2>
            <div className="grid grid-cols-1 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard locale={locale} key={relatedArticle.id} article={relatedArticle} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
