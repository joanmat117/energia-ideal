import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ArticleCard from "@/components/article-card"
import { getFeaturedArticles, getLatestArticles, categories } from "@/lib/data"
import { nicheCategories, nicheHomeText } from "@/data/dataNiche"
import Image from "next/image"

export default async function HomePage() {
  const featuredArticles = await getFeaturedArticles()
  const latestArticles = await getLatestArticles()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-foreground-50 to-foreground-100 text-background-50 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center flex flex-col gap-2 py-2">
            <h1 className="text-xl font-bold">
              {nicheHomeText.title_hero}
            </h1>
            <div className="flex gap-4 justify-center items-center">
            <p className="text-sm max-w-3xl text-background-500 mx-auto">
              {nicheHomeText.description_hero}
            </p>
                <Link className="px-5 py-3 border text-sm font-semibold transition border-accent-600 p-0 rounded-xl text-background-300 hover:bg-foreground-200 hover:text-accent-500 bg-transparent" href={nicheHomeText.cta_link}>
                {nicheHomeText.cta_text}
                </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">{nicheHomeText.category_section}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="group rounded-sm border-none transition">
                <Link href={`/${category.id}`}>
                <CardHeader className="text-center p-0">
                <img src={category.image} className="aspect-[21/9] object-cover" alt={category.name}/>
                  <CardTitle className="group-hover:text-accent-600 text-start transition-colors">
                    {category.name}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                </Link>
                <CardContent>
                  <div className="space-y-2 flex flex-wrap items-center gap-2">
                    {category.subcategories.slice(0, 3).map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/${category.id}/${sub.id}`}
                        className="block text-sm border py-1 rounded-full px-4 text-foreground-800 hover:text-background-400 hover:bg-foreground-100 transition-colors m-0"
                      >
                        {sub.name}
                      </Link>
                    ))}
                    {category.subcategories.length > 3 && (
                      <Link
                        href={`/${category.id}`}
                        className="block text-sm text-foreground-100 hover:text-foreground-800 font-medium"
                      >
                        {nicheHomeText.watch_more}
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{nicheHomeText.featured_articles_section}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{nicheHomeText.last_articles_section}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              {nicheHomeText.btn_all_articles}
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{nicheHomeText.cta_section}</h2>
          <p className="text-xl mb-8">
            {nicheHomeText.cta_section_description}
          </p>
          <Button size="lg" className="bg-white hover:bg-gray-100 text-indigo-600">
            {nicheHomeText.watch_guides}
          </Button>
        </div>
      </section>
    </div>
  )
}
